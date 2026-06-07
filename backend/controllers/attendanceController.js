import Attendance from "../models/Attendance.js";
import Session from "../models/Session.js";

export const markAttendance = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check if student already marked attendance
    const alreadyMarked = await Attendance.findOne({
      user: req.user._id,
      session: sessionId,
    });
    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    // Check if current time is within allowed window (e.g., 15 min before/after session time)
    const now = new Date();
    const startTime = new Date(session.time);
    const endTime = new Date(startTime.getTime() + 15 * 60000);
    if (now < startTime || now > endTime) {
      return res.status(400).json({ message: "Attendance window closed" });
    }

    // Mark attendance
    const attendance = await Attendance.create({
      user: req.user._id,
      session: sessionId,
    });

    // Add student to session's attendee list
    session.attendees.push(req.user._id);
    await session.save();

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully!",
      attendanceId: attendance._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAttendanceReport = async (req, res) => {
  try {
    console.log("Fetching report for teacher:", req.user._id); // Add logging
    
    const sessions = await Session.find({ createdBy: req.user._id })
      .populate({
        path: 'attendees',
        select: 'name email'
      })
      .sort({ time: -1 });

    console.log("Found sessions"); // Add logging

    if (!sessions || sessions.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: "No sessions found",
        sessions: [] 
      });
    }

    res.status(200).json({ 
      success: true, 
      sessions 
    });
  } catch (err) {
    console.error("Report Error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message,
      error: err // Include full error in response
    });
  }
};