// import mysql from "mysql";

// export const db = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"social"
// })
import mysql from "mysql2"

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port:"3306",
  password: "123456",
  database: "social"
});

db.connect(err => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});
