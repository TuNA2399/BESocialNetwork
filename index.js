import express from "express";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import strRoutes from "./routes/stories.js"
import relationshipRoutes from "./routes/relationships.js"
import { generateCloudinarySignature } from "./cloudinary.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { startStoryCleanupCron } from "./cron/storiesCron.js";

const app = express();

//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
})
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
}
));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../FE/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res)=>{
    const file = req.file;
    res.status(200).json(file.filename);
})

//Cronjob
startStoryCleanupCron();

//API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", strRoutes);
app.get("/api/signature", generateCloudinarySignature);

//Refresh token
app.post("/refresh-token", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) return res.status(401).json("No refresh token");
  
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json("Invalid refresh token");
  
      const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "5h" });
  
      res.json({ accessToken: newAccessToken });
    });
  });
  

app.listen(8800, () => {
    console.log("API running !!");
});