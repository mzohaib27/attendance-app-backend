import userModel from "../models/userModel.js";
import attendanceModel from "../models/attendanceModel.js";

// Get All users
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find({});
    res.status(200).json({
      success: true,
      message: "All users",
      allUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error while fetching all users Error is  :  ${error}`,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId).select("-password");
    const attendanceRecord = await attendanceModel
      .find({ userId })
      .sort({ date: -1 })
      .limit(30);
    res.status(200).json({ user, attendanceRecord });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: `Error while getting users by admin Error is : ${error}`,
    });
  }
};

export const deletUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const checkAdmin = await userModel.findById(userId);
    if (checkAdmin.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "You cannot delete an admin",
      });
    }
    const user = await userModel.findByIdAndDelete(userId);
    await attendanceModel.deleteMany({ userId });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json({
      success: true,
      message: "User and his attendance record Deleted successfully...",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error while deleting user Error is : ${error}`,
    });
  }
};

// Update Attendacne
export const updateAttendance = async (req, res) => {
  try {
    const { userId, status, date } = req.body;
    await attendanceModel.updateOne({ userId, date }, { status });
    res.status(200).json({
      success: true,
      message: "User Attendance updated successfully",
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: `Error while updating user attendance Error is : ${error}`,
    });
  }
};
