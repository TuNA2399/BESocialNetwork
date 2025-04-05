import express from "express";
import {getStories, addStories} from "../controller/stories.js";
const router =  express.Router();

router.get("/", getStories);
router.post("/", addStories);

export default router;