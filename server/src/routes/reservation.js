import express from "express";
import reservationControlleur from "../controllers/reservation.js";

const router = express.Router();

router.post("/", reservationControlleur.createReservation);
router.get("/me", reservationControlleur.getUserReservations);
router.get("/:id", reservationControlleur.getReservationById);
router.get("/:id/check-in", reservationControlleur.checkinReservation);
router.put(
  "/:id/complete-payment",
  reservationControlleur.completeReservationPaiement
);

export default router;
