import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateSession() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/session/create",
        { title, time },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✓ Session created successfully!");
      setQrCodeUrl(response.data.qrCodeUrl);
      setTitle("");
      setTime("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>📋 Create New Session</h1>

        <form onSubmit={handleCreateSession}>
          <div className="form-group">
            <label className="form-label">Session Title</label>
            <input
              type="text"
              placeholder="e.g., Computer Science - Lecture 5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date & Time</label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Creating..." : "Create Session"}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes("success") || message.includes("✓") ? "success" : "error"}`} style={{ marginTop: "1.5rem" }}>
            {message}
          </div>
        )}

        {qrCodeUrl && (
          <div className="card" style={{ textAlign: "center", marginTop: "2rem" }}>
            <h3>✓ QR Code Generated</h3>
            <p style={{ color: "#7a8fa9", marginBottom: "1.5rem" }}>Share this QR code with students to mark attendance</p>
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              style={{ 
                maxWidth: "300px", 
                width: "100%", 
                borderRadius: "12px",
                border: "2px solid #5a8cc5",
                padding: "1rem",
                backgroundColor: "white"
              }} 
            />
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
              <button style={{ flex: 1 }} onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setQrCodeUrl("")}>Create Another</button>
            </div>
          </div>
        )}

        {!qrCodeUrl && (
          <button 
            className="btn-secondary" 
            style={{ width: "100%", marginTop: "1rem" }} 
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateSession;
