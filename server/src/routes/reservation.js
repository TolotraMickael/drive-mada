import express from "express";
import reservationControlleur from "../controllers/reservation.js";

const router = express.Router();

router.post("/", reservationControlleur.createReservation);
router.get("/me", reservationControlleur.getUserReservations);
router.get("/:id", reservationControlleur.getReservationById);
// router.put("/:id", reservationControlleur.updateReservation);
// router.delete("/id", reservationControlleur.deleteReservation);

export default router;
