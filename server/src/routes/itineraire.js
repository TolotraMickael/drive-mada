import express from "express";
import itineraryContoller from "../controllers/itineraire.js";

const router = express.Router();

router.post("/", itineraryContoller.createItinerary);
router.get("/", itineraryContoller.findAllItinerary);
router.get("/me", itineraryContoller.getUserItinerary);
router.get("/me/:id", itineraryContoller.getUserItineraryDetail);
router.get("/:id", itineraryContoller.getItineraryById);
router.put("/:id", itineraryContoller.updateItinerary);
router.delete("/:id", itineraryContoller.deleteItinerary);

export default router;
