import pool from "../lib/db.js";

async function create(req, res) {
  const nom = req.body.nom;
  const photo = req.body.photo;

  if (!nom) {
    return res.status(400).json({ message: "Nom est obligatoire." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.query(
      `
      INSERT INTO vehicules(nom, photo)
      VALUES(?, ?)`,
      [nom, photo]
    );
    return res.status(200).json({ message: "Creation avec succès!" });
  } catch (err) {
    return res.status(500).json({ error: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function getAll(req, res) {
  const connection = await pool.getConnection();

  try {
    const [data] = await connection.query(
      "SELECT id_vehicule, nom, photo FROM vehicules"
    );
    return res.status(200).json({ data, message: "Done!" });
  } catch (err) {
    return res.status(500).json({ error: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

export default {
  create,
  getAll,
};
