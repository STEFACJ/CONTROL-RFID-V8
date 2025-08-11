import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Logged in but not authorized, redirect to home or unauthorized page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;


