import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
     return res.status(401).json({ message: "Not an Admin" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    // console.log(decoded);
    const user = await userModel.findById(decoded.userId);
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized, user is not an admin" });
    }
    req.user = user;
    next();
  } catch (error) {
  return res.status(500).json({ success: false, message: "Error in middleware" });
  }
};
