import express from "express";
import { addTitleToUserList, getTitles, updateTitleDetails, moveTitleBetweenLists, deleteTitle } from "../controllers/titleController.js";

const router = express.Router();

router.post("/add", addTitleToUserList);
router.get("/:listId", getTitles);
router.patch("/updateDetails", updateTitleDetails);
router.patch("/updateList", moveTitleBetweenLists);
router.delete("/remove", deleteTitle);

export default router;