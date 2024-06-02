import attendanceModel from "../models/attendanceModel.js";

export const submitAttendance = async (req, res) => {
  const { userId, status } = req.body;
  if (!userId || !status) {
    return res
      .status(401)
      .json({ message: "user id and attendance status are required" });
  }

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await attendanceModel.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance already taken" });
    }

    const newAttendance = await new attendanceModel({
      userId,
      status,
    });

    await newAttendance.save();
    res.status(200).json("Attendance submitted successfully...");
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error while making attendanc Error : ${error}` });
    console.log("Error while making attendance Error is : " + error);
  }
};

export const checkAttendanceStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existAttendance = await attendanceModel.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    if (existAttendance) {
      return res.status(200).json({ hasSubmitted: true });
    }
    res.status(200).json({ hasSubmitted: false });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error while checking Attendance Status Error is : ${error}`,
      });
  }
};
