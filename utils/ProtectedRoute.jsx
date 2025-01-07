import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Check for userInfo in localStorage to determine authentication status
const isAuthenticated = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo && JSON.parse(userInfo); // Returns true if userInfo exists
};

// ProtectedRoute component that wraps children
const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
