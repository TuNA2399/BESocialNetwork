import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User already exists!!");

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);

        const insertQuery = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
        const values = [req.body.username, req.body.email, hashPassword, req.body.name];

        db.query(insertQuery, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created!");
        });
    });
};

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found!!");

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if (!checkPassword) return res.status(400).json("Wrong password or username");

        const accessToken = jwt.sign(
            { id: data[0].id },
            "secretkey",
            { expiresIn: "5h" }
        );

        const refreshToken = jwt.sign(
            { id: data[0].id },
            "refreshSecretKey",
            { expiresIn: "30d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        const { password, ...userInfo } = data[0];

        return res.status(200).json({
            accessToken,
            user: userInfo,
        });
    });
};

export const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        secure: true,
        sameSite: "strict",
    }).status(200).json("User has been logged out!!");
};
