import express from "express";
import { getUser, updateUser, getUserByName } from "../controller/user.js";
const router =  express.Router();

router.get("/find/:userId", getUser)
router.get("/search", getUserByName)
router.put("/", updateUser);

export default router;