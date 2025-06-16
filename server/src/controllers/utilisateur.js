import pool from "../lib/db.js";

async function getProfile(req, res) {
  const userId = req.userId;
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      "SELECT id_utilisateur, nom, prenom, email, telephone, id_avatar FROM utilisateurs WHERE id_utilisateur = ?",
      [userId]
    );

    return res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function updateProfile(req, res) {
  const connection = await pool.getConnection();
  const userId = parseInt(req.params.id, 10);
  const values = req.body || {};

  if (!userId) {
    return res.status(400).json({ message: "ID incorrect." });
  }

  if (Object.keys(values).length === 0) {
    return res.status(400).json({ message: "Aucune valeur à mettre à jour" });
  }

  try {
    const [rows] = await connection.execute(
      "SELECT id_utilisateur FROM utilisateurs WHERE id_utilisateur = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const entries = Object.entries(values);
    const cles = entries.map(([key, _value]) => `${key} = ?`);
    const params = entries.map(([_key, value]) => value);
    params.push(userId);

    const [result] = await connection.execute(
      `UPDATE utilisateurs SET ${cles.join(", ")} WHERE id_utilisateur = ?`,
      params
    );

    if (result.affectedRows > 0) {
      const [users] = await connection.execute(
        "SELECT id_utilisateur, nom, prenom, email, telephone, id_avatar FROM utilisateurs WHERE id_utilisateur = ?",
        [userId]
      );
      return res.status(200).json({
        data: users[0],
        message: "Mise à jour réussie",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

// async function deleteUser(req, res) {
//   const id = parseInt(req.params["id"]);

//   if (!id) {
//     res.status(400).json({ message: "ID is null" });
//   } else {
//     try {
//       const conn = await getConnection();
//       await conn.query(`DELETE FROM utilisateurs WHERE id_utilisateur = ?`, [
//         id,
//       ]);

//       conn.close();
//       res.status(200).json({ message: "Suppression ok!" });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: "Erreur interne du serveur." });
//     }
//   }
// }

export default {
  getProfile,
  updateProfile,
};
