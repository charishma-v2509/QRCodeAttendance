import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // 🚨 No token? Send user to /login
    return <Navigate to="/login" replace />;
  }

  // ✅ Token exists, render the child component
  return children;
};

export default ProtectedRoute;
