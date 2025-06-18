import pool from "../lib/db.js";
import { ItineraryStatus } from "../lib/constant.js";

function mapItineraires(rows, placesDisponibles, options) {
  return rows.map((row) =>
    mapItineraireObject(row, placesDisponibles, options)
  );
}

function mapItineraireObject(row, placesDisponibles, reservations, options) {
  const afficherReservation = !!options?.afficherReservation;

  return {
    ...row,
    place_disponible: placesDisponibles,
    prix: Number(row.prix),
    vehicule: {
      id_vehicule: row.id_vehicule,
      nom_vehicule: row.nom_vehicule,
    },
    utilisateur: {
      id_avatar: row?.id_avatar ?? null,
      id_utilisateur: row.id_utilisateur,
      nom_utilisateur: row.nom_utilisateur,
      prenom_utilisateur: row.prenom_utilisateur,
      telephone: row.telephone,
    },
    ...(afficherReservation && {
      reservations: reservations?.map((reserve) => ({
        id_itineraire: reserve.id_itineraire,
        id_reservation: reserve.id_reservation,
        nombre_place_reserve: reserve.nombre_place_reserve,
        utilisateur: {
          id_utilisateur: reserve.id_utilisateur,
          id_avatar: reserve.id_avatar,
          nom: reserve.nom,
          prenom: reserve.prenom,
          telephone: reserve.telephone,
          statut: reserve.statut,
        },
      })),
    }),
  };
}

async function createItinerary(req, res) {
  const userId = req.userId;

  const vehiculeId = req.body.vehiculeId;
  const depart = req.body.depart;
  const destination = req.body.destination;
  const prix = Number(req.body.prix) || 0;
  const nombrePlace = Number(req.body.nombrePlace) || 0;
  const dateDepart = req.body.dateDepart;
  const statut = ItineraryStatus.waiting;

  if (!prix || !depart || !destination || !req.body.dateDepart || !vehiculeId) {
    return res
      .status(400)
      .json({ message: "Tous les champs sont obligatoires." });
  }

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `INSERT INTO itineraires(depart, destination, prix, date_depart, nombre_place, statut, id_vehicule, id_utilisateur)
      VALUES(?,?,?,?,?,?,?,?)`,
      [
        depart,
        destination,
        prix,
        dateDepart,
        nombrePlace,
        statut,
        vehiculeId,
        userId,
      ]
    );
    return res.status(200).json({
      insertId: rows.insertId,
      message: "Creation avec succès!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function getItineraryById(req, res) {
  const idItineraire = parseInt(req.params["id"], 10);

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT i.*, 
      v.id_vehicule, v.nom AS nom_vehicule,
      u.id_utilisateur, u.nom AS nom_utilisateur, u.prenom AS prenom_utilisateur, u.id_avatar, u.telephone
      FROM itineraires i
      JOIN vehicules v ON i.id_vehicule = v.id_vehicule
      JOIN utilisateurs u ON i.id_utilisateur = u.id_utilisateur
      WHERE i.id_itineraire = ?`,
      [idItineraire]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Itinéraire non trouvé." });
    }

    const [reservations] = await connection.execute(
      `SELECT COALESCE(SUM(nombre_place_reserve), 0) AS places_reserve
      FROM reservations 
      WHERE id_itineraire = ?`,
      [idItineraire]
    );

    const placesDisponibles =
      Number(rows[0].nombre_place) - Number(reservations[0].places_reserve);

    const data = mapItineraireObject(rows[0], placesDisponibles, {
      afficherPlaceDispo: true,
    });
    console.log({ data: rows[0] });
    return res.status(200).json({ data });
  } catch (err) {
    console.error("Erreur dans getItineraryById:", err);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function findAllItinerary(req, res) {
  const limit = Number(req.query.limit);
  const depart = req.query.depart || "";
  const destination = req.query.destination || "";
  const idVehicule = Number(req.query.id_vehicule) || "";

  const connection = await pool.getConnection();

  try {
    let queryString = `
      SELECT i.*, v.id_vehicule, v.nom AS nom_vehicule, u.id_utilisateur, u.nom AS nom_utilisateur
      FROM itineraires i
      JOIN vehicules v ON i.id_vehicule = v.id_vehicule
      JOIN utilisateurs u ON i.id_utilisateur = u.id_utilisateur
      WHERE 1
    `;
    const params = [];

    if (depart) {
      queryString += " AND i.depart LIKE CONCAT(?, '%')";
      params.push(depart);
    }

    if (destination) {
      queryString += " AND i.destination LIKE CONCAT(?, '%')";
      params.push(destination);
    }

    if (idVehicule) {
      queryString += " AND i.id_vehicule = ?";
      params.push(idVehicule);
    }

    queryString += " ORDER BY i.date_creation DESC";

    if (limit && limit > 0) {
      queryString += " LIMIT ?";
      params.push(limit);
    }

    const [rows] = await connection.execute(queryString, params);

    const data = mapItineraires(rows);

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erreur dans findAllItinerary:", err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function updateItinerary(req, res) {
  const connection = await pool.getConnection();
  const id = Number(req.params.id);
  const values = req.body || {};

  if (!id) {
    return res.status(400).json({ message: "ID incorrect." });
  }

  if (Object.keys(values).length === 0) {
    return res.status(400).json({ message: "Aucune valeur à mettre à jour." });
  }

  try {
    const [rows] = await connection.execute(
      `SELECT id_itineraire FROM itineraires WHERE id_itineraire = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Itinéraire non trouvé." });
    }

    const entries = Object.entries(values);
    const cles = entries.map(([key, value]) => `${key} = ?`);
    const params = entries.map(([key, value]) => value);
    params.push(id);

    const [result] = await connection.execute(
      `UPDATE itineraires SET ${cles.join(", ")} WHERE id_itineraire = ?`,
      params
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Mise à jour réussie" });
    } else {
      return res
        .status(200)
        .json({ message: "Aucune modification effectuée." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erreur de la mise à jour." });
  } finally {
    connection.release();
  }
}

async function getUserItinerary(req, res) {
  const connection = await pool.getConnection();
  const userId = req.userId;
  const idItineraire = parseInt(req.params["id"], 10);

  try {
    const [rows] = await connection.execute(
      `SELECT i.*, 
      v.id_vehicule, v.nom AS nom_vehicule,
      u.id_utilisateur, u.nom AS nom_utilisateur
      FROM itineraires i
      JOIN vehicules v ON i.id_vehicule = v.id_vehicule
      JOIN utilisateurs u ON i.id_utilisateur = u.id_utilisateur
      WHERE i.id_utilisateur = ? ORDER BY date_creation DESC`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Itinéraire non trouvé." });
    }

    const [reservations] = await connection.execute(
      `SELECT COALESCE(SUM(nombre_place_reserve), 0) AS places_reserve
      FROM reservations 
      WHERE id_itineraire = ? `,
      [idItineraire]
    );

    const placesDisponibles =
      Number(rows[0].nombre_place) - Number(reservations[0].places_reserve);

    const data = mapItineraires(rows, placesDisponibles, {
      afficherPlaceDispo: true,
    });

    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function getUserItineraryDetail(req, res) {
  const connection = await pool.getConnection();
  const idItineraire = parseInt(req.params["id"], 10);

  try {
    const [rows] = await connection.execute(
      `SELECT i.*,
      v.id_vehicule, v.nom AS nom_vehicule,
      u.id_utilisateur, u.nom AS nom_utilisateur, u.prenom AS prenom_utilisateur, u.id_avatar, u.telephone
      FROM itineraires i
      JOIN vehicules v ON i.id_vehicule = v.id_vehicule
      JOIN utilisateurs u ON i.id_utilisateur = u.id_utilisateur
      WHERE i.id_itineraire = ?`,
      [idItineraire]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Itinéraire non trouvé." });
    }

    const [reservations] = await connection.execute(
      `SELECT r.*,
      u.id_utilisateur, u.id_avatar, u.nom, u.prenom, u.telephone ,
      p.id_paiement, p.type, p.statut
      FROM reservations r 
      JOIN utilisateurs u ON r.id_utilisateur = u.id_utilisateur
      JOIN paiements p ON r.id_paiement = p.id_paiement
      WHERE r.id_itineraire = ?`,
      [idItineraire]
    );

    const [reserve] = await connection.execute(
      `SELECT COALESCE(SUM(nombre_place_reserve), 0) AS places_reserve
      FROM reservations
      WHERE id_itineraire = ? `,
      [idItineraire]
    );

    const placesDisponibles =
      Number(rows[0].nombre_place) - Number(reserve[0].places_reserve);

    const data = mapItineraireObject(rows[0], placesDisponibles, reservations, {
      afficherReservation: true,
    });

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function deleteItinerary(req, res) {
  // const id = parseInt(req.params["id"]);
  // try {
  //   const conn = await getConnection();
  //   await conn.conn.query("DELETE FROM itineraires WHERE id_itineraire = ?", [
  //     id,
  //   ]);
  //   conn.close();
  //   res.status(200).json({ message: "Suppression ok!" });
  // } catch (err) {
  //   res.status(500).json({ error: "Erreur interne du serveur." });
  // }
}

export default {
  createItinerary,
  getItineraryById,
  getUserItinerary,
  getUserItineraryDetail,
  findAllItinerary,
  updateItinerary,
  deleteItinerary,
};
