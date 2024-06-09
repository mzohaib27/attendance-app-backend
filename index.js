import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoutes.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Database Connection
// console.log(process.env.DB_URL);
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connected successfully...");
  })
  .catch((error) => {
    console.log("Error while connecting db...Error is : " + error);
  });

// middlewares
app.use(
  cors({
    credentials: true,
    origin: "https://attendance-app-frontend-three.vercel.app",

    // origin: "http://localhost:5173",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
const uploadDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadDir));
// routes
// app.use("/", (req, res) => {
//   res.send({
//     message: "Hello, This is the home route of the application",
//   });
// });
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server started Successfully on port " + port);
});
