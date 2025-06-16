import { PaymentStatus, ReservationStatus } from "../lib/constant.js";
import pool from "../lib/db.js";
import vehicule from "./vehicule.js";

function mapReservations(rows) {
  return rows.map((row) => mapReservationObject(row));
}

function mapReservationObject(row) {
  const {
    id_itineraire,
    depart,
    destination,
    statut_itineraire,
    nombre_place,
    prix,
    date_depart,
    id_utilisateur,
    nom,
    prenom,
    email,
    telephone,
    id_avatar,
    id_paiement,
    type,
    nom_vehicule,
    photo_vehicule,
    id_vehicule,
    statut_paiement,
    ...reservation
  } = row;

  return {
    ...reservation,
    itineraire: {
      id_itineraire,
      depart,
      destination,
      statut: statut_itineraire,
      nombre_place,
      prix: Number(prix),
      date_depart,
    },
    utilisateur: {
      id_utilisateur,
      nom,
      prenom,
      email,
      telephone,
      id_avatar,
    },
    vehicule: {
      id_vehicule,
      nom: nom_vehicule,
      photo: photo_vehicule,
    },
    paiement: {
      id_paiement,
      type,
      statut: statut_paiement,
    },
  };
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

  try {
    const [rows] = await connection.execute(
      `SELECT r.*,
      i.id_itineraire, i.depart, i.destination, i.date_depart, i.prix, i.statut AS statut_itineraire, i.nombre_place,
      p.id_paiement, p.type, p.statut AS statut_paiement
      FROM reservations r
      JOIN itineraires i ON r.id_itineraire = i.id_itineraire
      JOIN paiements p On r.id_paiement = p.id_paiement
      WHERE r.id_utilisateur = ?
      ORDER BY date_creation DESC`,
      [userId]
    );

    const data = mapReservations(rows);
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function getReservationById(req, res) {
  const idReservation = parseInt(req.params["id"], 10);
  const userId = req.userId;

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT r.*,
      i.id_itineraire, i.depart, i.destination, i.prix, i.date_depart , i.statut AS statut_itineraire, i.nombre_place,
      u.id_utilisateur, u.nom as nom, u.prenom as prenom, u.email, u.telephone, u.id_avatar,
      p.id_paiement, p.type , p.statut AS statut_paiement,
      v.id_vehicule, v.nom AS nom_vehicule, v.photo AS photo_vehicule
      FROM reservations r 
      JOIN utilisateurs u ON r.id_utilisateur = u.id_utilisateur 
      JOIN itineraires i ON r.id_itineraire = i.id_itineraire
      JOIN vehicules v ON v.id_vehicule = i.id_vehicule
      JOIN paiements p On r.id_paiement = p.id_paiement
      WHERE r.id_reservation = ? AND r.id_utilisateur = ?`,
      [idReservation, userId]
    );

    if (rows.length === 0) {
      return res.statut(404).json({ message: "Reservation non trouvé." });
    }

    const data = mapReservationObject(rows[0]);
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

export default {
  createReservation,
  getUserReservations,
  getReservationById,
};
