import express from "express";
import {
  deletUser,
  getAllUsers,
  getUser,
  updateAttendance,
} from "../controllers/adminController.js";
import { isAdmin } from "../utils/middlwares.js";

const adminRouter = express.Router();

adminRouter.get("/getuser", isAdmin, getAllUsers);
adminRouter.get("/user/:id", isAdmin, getUser);
adminRouter.post("/delete/:id", isAdmin, deletUser);
adminRouter.post("/update/:id", isAdmin, updateAttendance);

export default adminRouter;
