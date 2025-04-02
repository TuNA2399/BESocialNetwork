import moment from "moment/moment.js";
import { db } from "../connect.js"
import jwt from "jsonwebtoken";
export const getRelationships = (req, res) => {
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(relationship => relationship.followerUserId));
    })
}

export const getFriends = (req, res) => {
    const token = req.cookies.accessToken;
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is invalid!!");
        const q = `SELECT u.id, u.name, u.profilePic 
                    FROM relationships AS r1
                    JOIN relationships AS r2 
                        ON r1.followedUserId = r2.followerUserId 
                        AND r1.followerUserId = r2.followedUserId
                    JOIN users AS u ON u.id = r1.followedUserId
                    WHERE r1.followerUserId = ?`;

        db.query(q, [userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
    })


}

export const getUnfollowed = (req, res) => {
    const token = req.cookies.accessToken;
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is invalid!!");

        const q = `SELECT u.id, u.name, u.profilePic 
                    FROM users AS u
                    LEFT JOIN relationships AS r 
                        ON u.id = r.followedUserId 
                        AND r.followerUserId = ?
                    WHERE r.followedUserId IS NULL 
                      AND u.id <> ?`;

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

export const addRelationship = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is invalid!!")
        const q = " INSERT INTO relationships(`followerUserId`, `followedUserId`) VALUE (?) ";

        const values = [
            userInfo.id,
            req.body.followedUserId
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been followed!!");
        })
    })
}

export const deleteRelationship = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is invalid!!")
        const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

        db.query(q, [userInfo.id, req.query.followedUserId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been unfollowed !!");
        })
    })
}