import jwt from "jsonwebtoken";

import pool from "./db.js";
import { config } from "./config.js";

export async function protectedRoute(req, res, next) {
  const authorization = req.header("Authorization");
  const auths = authorization?.split(" ") || [];
  const token = auths[1] || "";

  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  } else {
    const connection = await pool.getConnection();

    try {
      const decoded = jwt.verify(token, config.tokenSecret);

      if (!decoded?.userId) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        const userId = Number(decoded?.userId) || 0;
        const [rows] = await connection.execute(
          "SELECT id_utilisateur FROM utilisateurs WHERE id_utilisateur = ?",
          [userId]
        );

        if (rows && rows.length > 0) {
          req.userId = rows[0].id_utilisateur;
          next();
        } else {
          return res.status(400).json({ message: "Not authorized" });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Access denied" });
    } finally {
      connection.release();
    }
  }
}

// const email = "rakoto@yopmail.com"
// const password = "password123"
// const hashPassword = jwt.sign(password, config.tokenSecret) // lzaejoiqjsdlkj&sfdlkjqsldkj123
