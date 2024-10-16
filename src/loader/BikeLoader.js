import React from 'react';
import { Box } from '@mui/material';

const BikeLoader = () => {
    return (
        <Box
            sx={{
                position: 'fixed', // Fixed positioning to cover the entire screen
                top: 0,
                left: 0,
                width: '100vw', // Full viewport width
                height: '100vh', // Full viewport height
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
                display: 'flex', // Flexbox for centering
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                zIndex: 9999, // High z-index to overlay on other content
            }}
        >
            <Box
                className="bike-loader"
                sx={{
                    animation: 'moveRight 2s linear infinite', // CSS animation for moving
                }}
            >
                <img
                    src="/img2.png" // Replace with your bike logo path
                    alt="Bike Logo"
                    style={{ height: '180px' }} // Adjust height as needed
                />
            </Box>
        </Box>
    );
};

export default BikeLoader;

