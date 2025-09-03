import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const PrivateRoute = ({ children, requiredPermissions = [] }) => {
  const { token, permissions } = useAuth();
  
    
  const hasPermission = requiredPermissions.every((perm) =>
    permissions.includes(perm)
    );
    // // console.log(localStorage.getItem("token"));
  if (!token) {
    // // console.log("No access token found, redirecting to login page.");
    // If no access token, redirect to login page
    return <Navigate to="/AdminLogin" />;
  }

  if (!hasPermission) {
    return <Navigate to="/AdminLogin"  />;
  }


  return children;
};

export default PrivateRoute;
