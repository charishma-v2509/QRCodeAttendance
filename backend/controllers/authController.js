import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    console.log("Signup request received:", { name, email, role });
    
    if (!name || !email || !password || !role) {
      console.warn("Missing fields in signup");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    console.log("Checking if user exists:", email);
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.warn("User already exists:", email);
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    console.log("Creating new user...");
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role 
    });

    console.log("User created successfully:", user._id);

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    console.log("Signup successful for:", email);
    res.status(201).json({ 
      success: true, 
      token, 
      role: user.role, 
      userId: user._id,
      message: "Registration successful! Please log in." 
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ 
      message: err.message || "Registration failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    console.log("Login request received:", email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn("User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("Password mismatch for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    console.log("Login successful for:", email);
    res.json({ 
      success: true, 
      token, 
      role: user.role,
      userId: user._id
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ 
      message: err.message || "Login failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
