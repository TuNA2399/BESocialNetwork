import { db } from "../connect.js"

export const login = (req,res) => {
    //Check user if exist
    const q = "SELECT FROM users WHERE usernam = ?"
    db.query(q,[req.body.username])

    //Create a new user


}

export const register = (req,res) => {
    
}

export const logout = (req,res) => {
    
}