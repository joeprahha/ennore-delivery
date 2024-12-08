import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography, Button } from '@mui/material';

const CircularLoader = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [showConnectionIssue, setShowConnectionIssue] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
      setShowConnectionIssue(true);
    }, 60000); // 50 seconds

    return () => clearTimeout(timeout); // Clean up timeout on unmount
  }, []);

  const handleRetry = () => {
    window.location.reload(); // Refresh the page
  };

  return showLoader ? (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Half-transparent white
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 9999,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        overflowX: 'hidden',
      }}
    >
      {/* LinearProgress on top */}
      <Box sx={{ width: '100%', position: 'absolute', backgroundColor: 'white', top: 0, zIndex: 1000 }}>
        <LinearProgress
          sx={{
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'blue', // Set to blue or any custom color you prefer
            },
          }}
        />
      </Box>
     
    </Box>
  ) : showConnectionIssue ? (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white', // Fully white screen
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 9999,
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Connection Issue
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRetry}>
        Retry
      </Button>
    </Box>
  ) : null;
};

export default CircularLoader;

