import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        {
          timeout: 30000,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setMessage("✓ Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Login error:", err);
      let errorMsg = "Login failed. Please try again.";
      if (err.code === 'ECONNABORTED') {
        errorMsg = "Request timeout. Backend is not responding.";
      } else if (err.code === 'ECONNREFUSED') {
        errorMsg = "Cannot connect to backend. Ensure backend is running.";
      } else {
        errorMsg = err.response?.data?.message || err.message || "Login failed. Please try again.";
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
          <div className="auth-icon">🔐</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin}>
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

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes("success") || message.includes("✓") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <p className="text-center mt-3">
          Don't have an account? <Link to="/register" style={{color: "#5a8cc5", fontWeight: "600"}}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
