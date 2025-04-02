import express from "express";
import { getRelationships, addRelationship, deleteRelationship, getFriends, getUnfollowed} from "../controller/relationships.js";
const router =  express.Router();

router.get("/", getRelationships)
router.get("/friends", getFriends)
router.get("/unfollowed", getUnfollowed)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)

export default router;