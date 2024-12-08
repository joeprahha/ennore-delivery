import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const BikeLoader = () => {
   const isDarkMode = localStorage.getItem('theme') === 'dark';

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
              // backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
               // zIndex: 999, // Ensure it overlays other elements
            }}
        >
            <CircularProgress 
               color={ 'primary'} 
                sx={{ zIndex: 999 }} 
                thickness={4} 
            />
            
        </Box>
    );
};

export default BikeLoader;

   {/* <img
               src="/img2.png"
                alt="Loading..."
                style={{
                    width: '100px', // Adjust the size as needed
                    animation: 'blink 0.5s infinite', // Blinking effect
                     filter: !isDarkMode && 'invert(1)' 
                }}
            />
            <style>
                {`
                    @keyframes blink {
                        0% { opacity: 1; }
                        50% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                `}
            </style> */}
