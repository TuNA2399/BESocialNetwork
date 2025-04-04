import express from "express";
import {getStories, addStories, deleteStories} from "../controller/stories.js";
const router =  express.Router();

router.get("/", getStories);
router.post("/", addStories);
router.delete("/:id", deleteStories);

export default router;