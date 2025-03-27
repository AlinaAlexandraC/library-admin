import express from "express";
import { addTitleToUserList, getTitles, updateTitle, deleteTitle } from "../controllers/titleController.js";

const router = express.Router();

router.post("/add", addTitleToUserList);
router.get("/:listId", getTitles);
router.patch("/update", updateTitle);
router.delete("/remove", deleteTitle);

export default router;