import express from "express";
import {
  getRecords,
  login,
  logout,
  userRegister,
} from "../controllers/userController.js";
import {
  checkAttendanceStatus,
  submitAttendance,
} from "../controllers/attendanceController.js";
import upload from "../utils/upload.js";

const userRouter = express.Router();

// Post Routes
userRouter.post("/register", upload.single("file"), userRegister);
userRouter.post("/login", login);
userRouter.post("/attendance", submitAttendance);
userRouter.post("/logout", logout);

// Get Routes
userRouter.get("/attendance/check/:userId", checkAttendanceStatus);
userRouter.get("/attendance/records/:userId", getRecords);

export default userRouter;
