import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const PrivateRoute = ({ children, requiredPermissions = [] }) => {
  const { token, permissions, isInitializing } = useAuth();
  
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasPermission = requiredPermissions.every((perm) =>
    permissions.includes(perm)
  );

  if (!token) {
    return <Navigate to="/AdminLogin" />;
  }

  if (!hasPermission) {
    return <Navigate to="/AdminLogin"  />;
  }

  return children;
};

export default PrivateRoute;
