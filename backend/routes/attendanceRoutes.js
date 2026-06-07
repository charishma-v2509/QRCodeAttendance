import express from "express";
import { markAttendance } from "../controllers/attendanceController.js";
import { verifyToken, verifyTeacherOrAdmin } from "../middleware/authMiddleware.js";
import { getAttendanceReport } from "../controllers/attendanceController.js";

const router = express.Router();

// Students scan QR → mark attendance
router.post("/mark", verifyToken, markAttendance);
router.get("/report", verifyToken, verifyTeacherOrAdmin, getAttendanceReport);


export default router;
