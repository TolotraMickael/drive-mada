import { PaymentStatus, ReservationStatus } from "../lib/constant.js";
import pool from "../lib/db.js";

function mapReservationObject(
  rows,
  placesDisponibles,
  nombre_place_reserve,
  options
) {
  const afficherPlaceDispo = !!options?.afficherPlaceDispo;
  const afficherPlaceReserve = !!options?.afficherPlaceReserve;

  return rows.map(
    ({
      id_itineraire,
      depart,
      destination,
      statut_itineraire,
      nombre_place,
      prix,
      date_depart,
      id_utilisateur,
      nom_utilisateur,
      email,
      telephone,
      id_avatar,
      id_paiement,
      type,
      statut_paiement,
      ...reservation
    }) => ({
      ...reservation,
      itineraire: {
        id_itineraire,
        depart,
        destination,
        statut: statut_itineraire,
        nombre_place,
        prix,
        date_depart,
      },
      utilisateur: {
        id_utilisateur,
        nom_utilisateur,
        email,
        telephone,
        id_avatar,
      },
      paiement: {
        id_paiement,
        type,
        statut: statut_paiement,
      },
      ...(afficherPlaceDispo && { place_disponible: placesDisponibles }),
      ...(afficherPlaceReserve && {
        nombre_place_reserve: nombre_place_reserve,
      }),
    })
  );
}

async function createReservation(req, res) {
  const userId = req.userId;
  const nbPlaceReserve = Number(req.body.nombre_place_reserve);
  const idItineraire = req.body.id_itineraire;
  const paymentType = req.body.type_paiement;

  if (
    !idItineraire ||
    !paymentType ||
    (!nbPlaceReserve && nbPlaceReserve <= 0)
  ) {
    return res
      .status(400)
      .json({ message: "Tous les champs sont obligatoires." });
  }

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      "SELECT id_itineraire, nombre_place FROM itineraires WHERE id_itineraire = ?",
      [idItineraire]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ID itineraire introuvable." });
    }

    const [reservations] = await connection.execute(
      "SELECT COALESCE(SUM(nombre_place_reserve), 0) as nombrePlaceReserve FROM reservations WHERE id_itineraire = ?",
      [idItineraire]
    );

    const nombrePlaceTotal = rows[0].nombre_place;
    const nombrePlaceReserve = Number(reservations[0].nombrePlaceReserve);
    const placeDisponible = nombrePlaceTotal - nombrePlaceReserve;

    if (placeDisponible < nbPlaceReserve) {
      return res
        .status(400)
        .json({ message: "Nombre de place non suffisant." });
    }

    const reservationStatus = ReservationStatus.reserved;
    const [createdReservations] = await connection.execute(
      `INSERT INTO reservations(nombre_place_reserve, statut, id_utilisateur, id_itineraire)
      VALUES(?,?,?,?) RETURNING id_reservation`,
      [nbPlaceReserve, reservationStatus, userId, idItineraire]
    );

    const paymentStatus = PaymentStatus.authorized;
    const [createdPayments] = await connection.execute(
      "INSERT INTO paiements(statut, type) VALUES(?,?) RETURNING id_paiement",
      [paymentStatus, paymentType]
    );

    const idPaiement = createdPayments[0].id_paiement;
    const idReservation = createdReservations[0].id_reservation;
    await connection.execute(
      "UPDATE reservations SET id_paiement= ? WHERE id_reservation = ?",
      [idPaiement, idReservation]
    );

    return res.status(200).json({ message: "Creation avec succès!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function getUserReservations(req, res) {
  const connection = await pool.getConnection();
  const userId = req.userId;
  const idItineraire = parseInt(req.params["id"], 10);

  try {
    const [rows] = await connection.execute(
      `SELECT r.*,
      i.id_itineraire, i.depart, i.destination, i.date_depart , i.statut AS statut_itineraire, i.nombre_place,
      p.id_paiement, p.type , p.statut AS statut_paiement
      FROM reservations r
      JOIN itineraires i ON r.id_itineraire = i.id_itineraire
      JOIN paiements p On r.id_paiement = p.id_paiement
      WHERE r.id_utilisateur = ?
      ORDER BY date_creation DESC;`,
      [userId]
    );

    const placesReserve = Number(rows.nombre_place_reserve);

    const data = mapReservationObject(rows, placesReserve, {
      afficherPlaceReserve: true,
    });

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function getReservationById(req, res) {
  const idReservation = parseInt(req.params["id"], 10);

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT r.*,
      i.id_itineraire, i.depart, i.destination, i.prix, i.date_depart , i.statut AS statut_itineraire, i.nombre_place,
      u.id_utilisateur, u.nom as nom_utilisateur, u.email, u.telephone, u.id_avatar,
      p.id_paiement, p.type , p.statut AS statut_paiement
      FROM reservations r 
      JOIN utilisateurs u ON r.id_utilisateur = u.id_utilisateur 
      JOIN itineraires i ON r.id_itineraire = i.id_itineraire
      JOIN paiements p On r.id_paiement = p.id_paiement
      WHERE r.id_reservation = ?;`,
      [idReservation]
    );

    if (rows.length === 0) {
      return res.statut(404).json({ message: "Reservation non trouvé." });
    }

    const idItineraire = rows[0].id_itineraire;

    const [reservations] = await connection.execute(
      `
        SELECT COALESCE(SUM(nombre_place_reserve),0) AS place_reserve 
        FROM reservations
        WHERE id_itineraire = ?
      `,
      [idItineraire]
    );

    const placeDisponible =
      Number(rows[0].nombre_place) - Number(reservations[0].place_reserve);

    const data = mapReservationObject(rows[0], placeDisponible, {
      afficherPlaceDispo: true,
    });

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

// async function updateReservation(req, res) {
//   const conn = await getConnection();
//   try {
//     const { id } = req.params;

//     const valeurs = req.body || {};

//     if (Object.keys(valeurs).length === 0) {
//       return res.status(400).json({ message : "Aucune valeur à mettre à jour." });
//     }

//     const rows = await conn.query(
//       `SELECT * FROM reservations WHERE id_reservation = ?`,
//       [id]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message : "Reservation non trouvé." });
//     }

//     const entries = Object.entries(valeurs);
//     const cles = entries.map(([key, value]) => `${key} = ?`);
//     const valeur = entries.map(([key, value]) => value);

//     valeur.push(id);

//     const result = await conn.query(
//       `UPDATE reservations SET ${cles.join(", ")} WHERE id_reservation = ?`,
//       valeur
//     );

//     conn.close();

//     if (result.affectedRows > 0) {
//       return res.status(200).json({
//         message: "Mise à jour réussie",
//         affectedRows: result.affectedRows,
//       });
//     } else {
//       return res
//         .status(200)
//         .json({ message: "Aucune modification effectuée." });
//     }
//   } catch (error) {
//     conn.close();
//     res.status(500).json({ err: "Erreur de la mise à jour." });
//     console.log(error);
//   }
// }

// async function deleteReservation(req, res) {
//   const id = parseInt(req.params["id"]);
//   try {
//     const conn = await getConnection();
//     await conn.conn.query("DELETE FROM reservations WHERE id_reservation = ?", [
//       id,
//     ]);

//     conn.close();
//     res.status(200).json({ message: "Suppression ok!" });
//   } catch (err) {
//     res.status(500).json({ message : "Erreur interne du serveur." });
//   }
// }

export default {
  createReservation,
  getUserReservations,
  getReservationById,
  // updateReservation,
  // deleteReservation,
};
