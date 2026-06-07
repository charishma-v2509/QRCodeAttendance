import express from "express";
import { createSession } from "../controllers/sessionController.js";
import { getSessions } from "../controllers/sessionController.js";
import { verifyToken, verifyTeacherOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only teacher/admin can create session
router.get("/", verifyToken, verifyTeacherOrAdmin, getSessions);
router.post("/create", verifyToken, verifyTeacherOrAdmin, createSession);

export default router;
