import express from "express";
import { registerUser, loginUser, logoutUser, checkIfEmailExists } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/", loginUser);
router.post("/logout", logoutUser);
router.post("/check-email", checkIfEmailExists);

export default router;