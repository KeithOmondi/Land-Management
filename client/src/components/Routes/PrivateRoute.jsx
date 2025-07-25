// src/components/Routes/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-gray-600">Checking access...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    console.warn("🔒 Not authenticated. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toLowerCase();
  const allowed = allowedRoles.map((role) => role.toLowerCase());

  console.log("🛡️ Access Check:", {
    isAuthenticated,
    userRole,
    allowedRoles: allowed,
  });

  const hasAccess = allowed.includes(userRole);

  // If authenticated but not authorized
  if (!hasAccess) {
    console.warn(`❌ Role '${userRole}' is not allowed. Redirecting to /unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized access
  return <Outlet />;
};

export default PrivateRoute;
