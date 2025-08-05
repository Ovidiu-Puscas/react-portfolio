import React from 'react';
import { Alert, AlertTitle, Button, Box, Typography } from '@mui/material';
import { Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';

const TaskManagerErrorFallback = ({ error, resetErrorBoundary }) => {
  const isAuthError =
    error.message?.toLowerCase().includes('auth') ||
    error.message?.toLowerCase().includes('permission');

  const isNetworkError =
    error.message?.toLowerCase().includes('network') ||
    error.message?.toLowerCase().includes('fetch');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Alert
        severity="error"
        sx={{
          maxWidth: 600,
          width: '100%',
          mb: 3,
          '& .MuiAlert-icon': {
            fontSize: '2rem',
          },
        }}
      >
        <AlertTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {isAuthError
            ? 'Authentication Error'
            : isNetworkError
              ? 'Network Error'
              : 'Something went wrong'}
        </AlertTitle>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {isAuthError
            ? 'There was a problem with your authentication. Please try logging in again.'
            : isNetworkError
              ? 'Unable to connect to the server. Please check your internet connection and try again.'
              : 'An unexpected error occurred while processing your request.'}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            p: 2,
            bgcolor: 'error.dark',
            color: 'error.contrastText',
            borderRadius: 1,
            fontFamily: 'monospace',
            wordBreak: 'break-word',
          }}
        >
          {error.message}
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={resetErrorBoundary}
          sx={{ minWidth: 120 }}
        >
          Try Again
        </Button>

        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => (window.location.href = '/')}
          sx={{ minWidth: 120 }}
        >
          Go Home
        </Button>
      </Box>

      <Typography
        variant="caption"
        sx={{
          mt: 4,
          color: 'text.secondary',
          textAlign: 'center',
        }}
      >
        If this problem persists, please refresh the page or contact support. Your data has been
        automatically saved.
      </Typography>
    </Box>
  );
};

export default TaskManagerErrorFallback;
