import express from "express";
import { createList, deleteList, getUserLists, updateList,  deleteListAndTitles } from "../controllers/listControllers.js";

const router = express.Router();

router.get("/", getUserLists);
router.post("/create", createList);
router.patch("/update", updateList);
router.delete("/delete", deleteList);
router.delete("/deleteAll", deleteListAndTitles);

export default router;