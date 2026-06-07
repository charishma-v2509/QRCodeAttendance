import Session from "../models/Session.js";
import { generateQRCode } from "../utils/qrCodeGenerator.js";

export const createSession = async (req, res) => {
  const { title, time } = req.body;
  try {
    // Create session in DB
    const session = await Session.create({
      title,
      time,
      createdBy: req.user._id,
    });

    // Generate QR code with session ID
    const qrCodeData = await generateQRCode(session._id.toString());

    // Save QR code data to session
    session.qrCodeData = qrCodeData;
    await session.save();

    res.status(201).json({
      success: true,
      sessionId: session._id,
      qrCodeUrl: qrCodeData,
      message: "Session created successfully!",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};