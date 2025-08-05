import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ProtectedRoute check - User and loading state validation

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    // No user found, redirecting to auth page
    return <Navigate to="/auth" replace />;
  }

  // User authenticated, showing protected content
  return children;
};

export default ProtectedRoute;
