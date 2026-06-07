import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const name = localStorage.getItem("userName") || "User";

    if (!token) {
      navigate("/login");
    } else {
      setRole(userRole);
      setUserName(name);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const getRoleEmoji = () => {
    switch(role) {
      case "teacher": return "👨‍🏫";
      case "admin": return "👨‍💼";
      default: return "👨‍🎓";
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ marginBottom: "0.5rem" }}>Welcome, {userName} {getRoleEmoji()}</h1>
            <p style={{ fontSize: "1.1rem", color: "#7a8fa9" }}>You are logged in as <strong>{role.charAt(0).toUpperCase() + role.slice(1)}</strong></p>
          </div>
          <button className="btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="dashboard-grid">
        {(role === "teacher" || role === "admin") ? (
          <>
            <div className="card" onClick={() => navigate("/create-session")} style={{ cursor: "pointer" }}>
              <div className="card-icon">📋</div>
              <h3>Create Session</h3>
              <p>Start a new attendance session and generate QR code</p>
              <button style={{ marginTop: "1rem" }}>New Session →</button>
            </div>
            <div className="card" onClick={() => navigate("/view-report")} style={{ cursor: "pointer" }}>
              <div className="card-icon">📊</div>
              <h3>View Reports</h3>
              <p>Check attendance records and statistics</p>
              <button style={{ marginTop: "1rem" }}>View Reports →</button>
            </div>
          </>
        ) : (
          <div className="card" onClick={() => navigate("/scan-qr")} style={{ cursor: "pointer" }}>
            <div className="card-icon">📱</div>
            <h3>Scan QR Code</h3>
            <p>Mark your attendance by scanning the session QR code</p>
            <button style={{ marginTop: "1rem" }}>Start Scanning →</button>
          </div>
        )}
      </div>

      {/* Quick Stats (if applicable) */}
      {(role === "teacher" || role === "admin") && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Quick Stats</h2>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-label">📅 Active Sessions</div>
              <div className="stat-value">--</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">👥 Total Students</div>
              <div className="stat-value">--</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">✓ Marked Today</div>
              <div className="stat-value">--</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
