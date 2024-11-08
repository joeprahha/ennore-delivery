import React from 'react';
import { Box } from '@mui/material';

const isDarkMode=localStorage.getItem('theme')==='dark'
const BikeLoader = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <img
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
            </style>
        </Box>
    );
};

export default BikeLoader;

