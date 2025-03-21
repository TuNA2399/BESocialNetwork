import { db } from "../connect.js"
import jwt from "jsonwebtoken";
export const getUser = (req, res) =>{
    const userId = req.params.userId;
    const q = "SELECt * FROM users WHERE Id = ?"

    db.query(q, [userId], (err, data) =>{
        if(err) return res.status(500).json(err);
        const {password, ...info} = data[0];
        return res.json(info);
    })
}