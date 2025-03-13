import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/", loginUser);
router.post("/logout", logoutUser);

export default router;