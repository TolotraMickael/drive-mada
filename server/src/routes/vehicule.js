import express from "express";
import vehiculeControlleur from "../controllers/vehicule.js";

const router = express.Router();

router.post("/", vehiculeControlleur.create);
router.get("/", vehiculeControlleur.getAll);

export default router;
