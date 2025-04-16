import moment from "moment/moment.js";
import { db } from "../connect.js"
import jwt from "jsonwebtoken";

export const getComments = (req, res) => {
    const q = `
                SELECT DISTINCT c.*, u.id AS userId, u.name, u.profilePic
                FROM comments AS c
                JOIN users AS u ON u.id = c.userId
                WHERE c.postId = ?
                ORDER BY c.createdAt DESC
          `;

    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    })
}

export const addComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is invalid!!")
        const q = " INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUE (?) ";

        const values = [
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comment has been created!!");
        })
    })
}

export const deleteComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("You must be logged in to delete a post.");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Invalid authentication token.");

        const commentId = req.params.id;
        if (!commentId) {
            return res.status(400).json("Comment ID is required.");
        }

        const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

        db.query(q, [commentId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json("Database error: " + err);

            if (data.affectedRows > 0) {
                return res.status(200).json({ success: true, message: "Comment has been deleted." });
            } else {
                return res.status(403).json("You can only delete your own comment.");
            }
        });
    });
};
export const updateComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("You must be logged in to delete a post.");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Invalid authentication token.");

        const commentId = req.params.id;
        if (!commentId) {
            return res.status(400).json("Comment ID is required.");
        }

        const q = "UPDATE comments SET `desc` = ? WHERE `id` = ? AND `userId` = ?";

        const content = req.body.desc;

        db.query(q, [content, commentId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json("Database error: " + err);

            if (data.affectedRows > 0) {
                return res.status(200).json({ success: true, message: "Updated!!!" });
            } else {
                return res.status(403).json("You can only update your own comment.");
            }
        });
    });
};