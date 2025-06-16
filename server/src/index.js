import cors from "cors";
import express from "express";

import { config } from "./lib/config.js";
import authRoutes from "./routes/auth.js";
import { protectedRoute } from "./lib/token.js";
import userRoutes from "./routes/utilisateur.js";
import vehiculeRoutes from "./routes/vehicule.js";
import itineraryRoutes from "./routes/itineraire.js";
import reservationRoutes from "./routes/reservation.js";
import { getLocalIp } from "./lib/ip.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/api", (req, res) => res.json("Welcome"));
app.use("/api/auth", authRoutes);
app.use("/api/vehicules", vehiculeRoutes);
app.use("/api/utilisateurs", protectedRoute, userRoutes);
app.use("/api/itineraires", protectedRoute, itineraryRoutes);
app.use("/api/reservations", protectedRoute, reservationRoutes);

app.listen(config.port, "0.0.0.0", () => {
  const ip = getLocalIp();
  console.log(`Server running at :
      -> Local:    http://localhost:${config.port}
      -> Network:  http://${ip}:${config.port}
  `);
});
