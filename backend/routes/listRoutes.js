import express from "express";
import { createList, deleteList, getUserLists, updateList, getListById } from "../controllers/listControllers.js";

const router = express.Router();

router.get("/", getUserLists);
router.post("/create", createList);
router.patch("/update", updateList);
router.delete("/delete", deleteList);
router.get("/:listId", getListById);

export default router;