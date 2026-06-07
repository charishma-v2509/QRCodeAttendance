import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Attendance", attendanceSchema);
