import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, ...rest }) => {
  const { token } = useAuth();

  return (
    <Routes>
    <Route
      {...rest}
      element={
        token ? (
          children
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />
    </Routes>
  );
};

export default ProtectedRoute;