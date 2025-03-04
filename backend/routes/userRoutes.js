import express from "express";
import { getUserByUid, updateUserDetails, deleteUserAccount } from "../controllers/userController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/details", authenticateToken, getUserByUid);
router.patch("/update", authenticateToken, updateUserDetails);
router.delete("/delete", authenticateToken, deleteUserAccount);

export default router;
