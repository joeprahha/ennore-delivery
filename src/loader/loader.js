import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const isDarkMode = localStorage.getItem('theme') === 'dark';

const CircularLoader = () => {
    // State to control when to show the text
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        // Set a timeout to show the text after 1.5 seconds
        const timer = setTimeout(() => {
            setShowText(true);
        }, 1500);

        // Cleanup the timer on unmount or when the component is rerendered
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                backgroundColor: '#ffffff',  // White background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,  // Ensure it appears above other content
                flexDirection: 'column',  // Stack the loader and text vertically
            }}
        >
            <CircularProgress
                sx={{
                    color: isDarkMode ? '#ffffff' : '#1976d2', // Adjust color based on dark mode
                }}
            />
            
            {/* Conditionally render the text after 1.5 seconds */}
            {showText && (
              <>  <Typography
                    variant="subtitle"
                    sx={{
                        marginTop: 4, // Add some space between the loader and the text
                  
                    }}
                    fontSize='0.9rem'
                    gutterBottom
                >
                    It’s taking longer than expected
                </Typography>
                <Typography fontSize='0.9rem'>Please wait...</Typography></>
            )}
        </Box>
    );
};

export default CircularLoader;

