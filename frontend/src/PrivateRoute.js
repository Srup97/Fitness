import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.js';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, role } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />; // Redirigir a una página no autorizada o de error
  }

  return children;
};

export default PrivateRoute;
