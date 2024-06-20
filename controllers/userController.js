import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isObjectIdOrHexString } from "mongoose";
import attendanceModel from "../models/attendanceModel.js";

// Register Function
export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const file = req.body.file;
  console.log(file);
  try {
    const checkUser = await userModel.findOne({ email: req.body.email });
    if (checkUser) {
      throw new Error("User already Exist");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      profileimage: file ? `${file}` : "",
    });

    await newUser.save();

    return res.status(200).json({ message: "new user saved" });
  } catch (error) {
    return res.status(500).json({
      message: "error while registering new user...Error is : " + error,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  // console.log(user);
  if (!user) {
    return res.status(401).json({ success: false, message: "User Not Found" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  console.log(password);
  if (!validPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials." });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SEC);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 3600000,
  });
  const userinfo = { ...user._doc, password: password };
  res.status(200).json({
    success: true,
    message: "Log in successfully...  ",
    userinfo,
    token,
  });
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "user logged out successfully..." });
  } catch (error) {
    return res.status(500).json({ message: "error while logging out user" });
  }
};

// Get User Attendance Records Function
export const getRecords = async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching attendance records for user ID: ${userId}`);

  try {
    const attendanceRecords = await attendanceModel
      .find({ userId })
      .sort({ date: -1 });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    return res
      .status(500)
      .json("Error while getting attendance records Error is : " + error);
  }
};

// User Updating Profile Image
export const updatingUser = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  const { profileimage, name, email, password } = req.body;
  console.log(
    `Name is ${name} , Email is : ${email} , Password is : ${password}`
  );
  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "user not found",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    {
      profileimage: profileimage,
      name: name,
      email: email,
      password: hashedPassword,
    },
    { new: true }
  );

  await updatedUser.save();
  updatedUser.password = password;
  res.status(200).json({
    success: true,
    message: "user updated successfully",
    updatedUser,
  });
};
