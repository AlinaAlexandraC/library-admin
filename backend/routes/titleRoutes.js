import express from "express";
import { addTitleToUserList, getTitles, updateTitle, deleteTitle } from "../controllers/titleController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authenticateToken, addTitleToUserList);
router.get("/list", authenticateToken, getTitles);
router.patch("/update", authenticateToken, updateTitle);
router.delete("/remove", authenticateToken, deleteTitle);

export default router;