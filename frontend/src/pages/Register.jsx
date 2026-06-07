import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      console.log("Starting registration...");
      
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password, role },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Registration response:", response.data);

      if (response.status === 201 || response.data.success) {
        setMessage("✓ Registration successful! Redirecting to login...");
        localStorage.setItem("userName", name);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("✗ " + (response.data.message || "Registration failed"));
      }
    } catch (err) {
      console.error("Register error details:", {
        message: err.message,
        response: err.response?.data,
        code: err.code,
        status: err.response?.status
      });
      
      let errorMsg = "Registration failed. Please try again.";
      
      if (err.code === 'ECONNABORTED') {
        errorMsg = "Request timeout. Backend is not responding. Make sure backend is running.";
      } else if (err.code === 'ECONNREFUSED') {
        errorMsg = "Cannot connect to backend. Make sure backend is running on port 5000.";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setMessage("✗ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <div className="auth-icon">✨</div>
          <h2>Create Account</h2>
          <p>Join QR Attend today</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes("success") || message.includes("✓") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <p className="text-center mt-3">
          Already have an account? <Link to="/login" style={{color: "#5a8cc5", fontWeight: "600"}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
