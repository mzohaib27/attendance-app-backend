import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  },
});

const attendanceModel = new mongoose.model("Attendance", attendanceSchema);
export default attendanceModel;
