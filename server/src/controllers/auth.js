import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import pool from "../lib/db.js";
import { config } from "../lib/config.js";

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email et mot de passe sont obligatoires." });
  }

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      "SELECT id_utilisateur, email, mot_de_passe FROM utilisateurs WHERE email = ?",
      [email]
    );

    console.log(rows);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Adresse email n'existe pas." });
    } else {
      const userInfo = rows[0];
      const isValid = await bcrypt.compare(password, userInfo["mot_de_passe"]);

      if (!isValid) {
        return res.status(400).json({ message: "Mot de passe incorrect." });
      } else {
        const token = jwt.sign(
          { userId: userInfo["id_utilisateur"] },
          config.tokenSecret,
          { expiresIn: "30d" }
        );
        return res.status(200).json({ token, message: "Utilisateur connecté" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

async function register(req, res) {
  const { nom, prenom, email, telephone, password } = req.body;

  if (!nom || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nom, Email et Mot de passe sont obligatoires." });
  }

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      "SELECT email FROM utilisateurs WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).json({ message: "Adresse email déjà utilisé." });
    } else {
      const hashPassword = await bcrypt.hash(password, 8);
      const [result] = await connection.execute(
        `
        INSERT INTO utilisateurs(nom, prenom, email, telephone, mot_de_passe)
        VALUES(?, ?, ?, ?, ?)`,
        [nom, prenom, email, telephone, hashPassword]
      );

      if (!result && !result?.insertId) {
        return res.status(500).json({ message: "Erreur interne du serveur" });
      }

      const token = jwt.sign({ userId: result.insertId }, config.tokenSecret, {
        expiresIn: "30d",
      });
      return res
        .status(200)
        .json({ token, message: "Utilisateur créé avec succès." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  } finally {
    connection.release();
  }
}

export default {
  login,
  register,
};
