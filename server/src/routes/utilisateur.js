import express from "express";
import userController from "../controllers/utilisateur.js";

const router = express.Router();

router.get("/profile", userController.getProfile);
router.put("/:id", userController.updateProfile);
// router.get("/:id", userController.getUserById);
// router.delete("/:id", userController.deleteUser);

export default router;
