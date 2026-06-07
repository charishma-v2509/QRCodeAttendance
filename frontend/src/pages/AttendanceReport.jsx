import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function AttendanceReport() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/attendance/report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const sessionsData = response.data.sessions || response.data;
        setSessions(Array.isArray(sessionsData) ? sessionsData : []);
        
        if (response.data.message === "No sessions found") {
          setError("No sessions found for your account");
        }
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to load sessions");
        
        if (error.response?.status === 403) {
          navigate("/dashboard");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [navigate]);

  const getChartData = () => {
    return sessions.map(session => ({
      name: session.title.substring(0, 15),
      attendees: session.attendees?.length || 0,
    }));
  };

  const getTotalStats = () => {
    const totalSessions = sessions.length;
    const totalAttendees = sessions.reduce((sum, s) => sum + (s.attendees?.length || 0), 0);
    return { totalSessions, totalAttendees };
  };

  if (loading) return <div className="loading">📊 Loading attendance data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const { totalSessions, totalAttendees } = getTotalStats();
  const chartData = getChartData();

  const COLORS = ["#5a8cc5", "#8b9db1", "#6b8dbf", "#4a7ab5", "#7a8fa9"];

  return (
    <div className="report-container">
      <h1 style={{ marginBottom: "2rem" }}>📊 Attendance Report</h1>

      {sessions.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ fontSize: "1.1rem", color: "#7a8fa9" }}>No sessions found for your account.</p>
          <button 
            className="btn-secondary" 
            style={{ marginTop: "1.5rem", maxWidth: "200px" }}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="dashboard-grid" style={{ marginBottom: "2rem" }}>
            <div className="stat-card">
              <div className="stat-label">📋 Total Sessions</div>
              <div className="stat-value">{totalSessions}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">👥 Total Attendances</div>
              <div className="stat-value">{totalAttendees}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">📈 Avg per Session</div>
              <div className="stat-value">{totalSessions > 0 ? (totalAttendees / totalSessions).toFixed(1) : 0}</div>
            </div>
          </div>

          {/* Charts */}
          {chartData.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
              {/* Bar Chart */}
              <div className="chart-container">
                <div className="chart-title">📊 Attendance by Session</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#7a8fa9" />
                    <YAxis stroke="#7a8fa9" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #d0d0d0", borderRadius: "8px" }}
                    />
                    <Bar dataKey="attendees" fill="#5a8cc5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              {chartData.length <= 5 && (
                <div className="chart-container">
                  <div className="chart-title">🥧 Distribution</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="attendees"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Sessions List */}
          <h2 style={{ marginBottom: "1.5rem" }}>Sessions</h2>
          <div className="sessions-grid">
            {sessions.map((session) => (
              <div key={session._id} className="session-card">
                <h3 className="session-title">{session.title}</h3>
                
                <div className="session-meta">
                  <div className="session-meta-item">📅 {new Date(session.time).toLocaleDateString()}</div>
                  <div className="session-meta-item">🕐 {new Date(session.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>

                <div className="attendee-count">
                  <div className="attendee-count-number">{session.attendees?.length || 0}</div>
                  <div style={{ color: "#5a8cc5", fontSize: "0.9rem" }}>Attendees</div>
                </div>

                <button 
                  onClick={() => setSelectedSession(selectedSession?._id === session._id ? null : session)}
                  style={{ width: "100%" }}
                >
                  {selectedSession?._id === session._id ? "Hide Details" : "View Details"}
                </button>
                
                {selectedSession?._id === session._id && (
                  <div className="attendance-details">
                    <h4>👥 Attendees ({session.attendees?.length || 0})</h4>
                    {session.attendees?.length > 0 ? (
                      <ul>
                        {session.attendees.map(user => (
                          <li key={user._id}>
                            <strong>{user.name}</strong> • {user.email}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: "#7a8fa9", fontStyle: "italic" }}>No attendees for this session</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            className="btn-secondary" 
            onClick={() => navigate("/dashboard")}
            style={{ marginTop: "2rem", maxWidth: "200px" }}
          >
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
}

export default AttendanceReport;
