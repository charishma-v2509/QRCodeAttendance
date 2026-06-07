import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-icon">📱</div>
        <h1 className="hero-title">QR Attend</h1>
        <p className="hero-subtitle">
          Modern attendance tracking using QR codes.<br/>
          Secure, fast, and easy to use.
        </p>
      </div>

      <div className="hero-buttons">
        <button onClick={() => navigate("/login")}>Sign In</button>
        <button className="btn-secondary" onClick={() => navigate("/register")}>Create Account</button>
      </div>
    </div>
  );
}

export default Home;
