import express from "express";
import { getUserByUid, updateUserDetails, deleteUserAccount } from "../controllers/userController.js";

const router = express.Router();

router.get("/details", getUserByUid);
router.patch("/update", updateUserDetails);
router.delete("/delete", deleteUserAccount);

export default router;
