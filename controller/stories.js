import moment from "moment/moment.js";
import { db } from "../connect.js"
import jwt from "jsonwebtoken";

export const getStories = (req, res) => {
    const token = req.cookies.accessToken;
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is invalid!!");

        const q = `
            SELECT s.*, u.id AS userId, u.name, u.profilePic
            FROM stories AS s
            JOIN users AS u ON s.userId = u.id
            WHERE u.id = ? 
            OR u.id IN (
                SELECT followedUserId FROM relationships WHERE followerUserId = ?
            )
            ORDER BY s.createdAt DESC`;

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};


export const addStories = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is invalid!!")
        const q = " INSERT INTO stories(`img`, `userId`, `createdAt`) VALUE (?) ";

        const values = [
            req.body.img,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Story has been created!!");
        })
    })
}
