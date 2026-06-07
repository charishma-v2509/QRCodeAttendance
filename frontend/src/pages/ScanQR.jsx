import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ScanQR() {
  const qrCodeRegionId = "qr-code-full-region";
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    scannerRef.current = new Html5QrcodeScanner(qrCodeRegionId, {
      fps: 10,
      qrbox: 250,
    });

    scannerRef.current.render(
      async (decodedText, decodedResult) => {
        console.log("Scanned code:", decodedText);
        setScanned(true);
        try {
          const response = await axios.post(
            "http://localhost:5000/api/attendance/mark",
            { sessionId: decodedText },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMessage("✓ " + (response.data.message || "Attendance marked successfully!"));
          setMessageType("success");
          
          setTimeout(() => {
            setScanned(false);
            setMessage("");
            if (scannerRef.current) {
              scannerRef.current.resume?.();
            }
          }, 3000);
        } catch (err) {
          console.error(err);
          const errorMsg = err.response?.data?.message || "Failed to mark attendance";
          setMessage("✗ " + errorMsg);
          setMessageType("error");
          setScanned(false);
          
          setTimeout(() => {
            setMessage("");
            if (scannerRef.current) {
              scannerRef.current.resume?.();
            }
          }, 3000);
        }
      },
      (error) => {
        console.warn("QR Scan Error:", error);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear QR scanner.", error);
        });
      }
    };
  }, [navigate]);

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-wrapper">
        <div className="qr-scanner-title">
          <h2>📱 Mark Attendance</h2>
          <p>Point camera at QR code to mark attendance</p>
        </div>

        <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }} />

        {message && (
          <div className={`message ${messageType}`} style={{ marginTop: "1.5rem", width: "100%" }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
          <button 
            className="btn-secondary" 
            style={{ flex: 1 }} 
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScanQR;
