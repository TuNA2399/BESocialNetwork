import { db } from "../connect.js"
import jwt from "jsonwebtoken";
export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECt * FROM users WHERE Id = ?"

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        const { password, ...info } = data[0];
        return res.json(info);
    })
}

export const getUserByName = (req, res) => {
    const searchName = req.query.name;

    const q = "SELECT id, name, profilePic FROM users WHERE LOWER(name) LIKE LOWER(?)";

    db.query(q, [`%${searchName}%`], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?"

        db.query(q, [
            req.body.name || userInfo.name,
            req.body.city || userInfo.city,
            req.body.website || userInfo.website,
            req.body.profilePic || userInfo.profilePic,
            req.body.coverPic || userInfo.coverPic,
            userInfo.id
        ], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows > 0) return res.json("Updated!!");
            return res.status(403).json("You can update your profile only!")
        })
    });
}