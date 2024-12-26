import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';



const CheckoutButton = ({ total, loading, handleCheckout,storeOpen }) => {
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
          //  setVisible(false); // Scrolling down
        } else {
         //   setVisible(true); // Scrolling up
        }
       // setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <Box
            sx={{
                position: 'fixed',
                  position: 'fixed',
                        bottom: 60,
                        left: 0,
                        right: 0,
                        height: '50px',
                        borderRadius: 20,
                        zIndex: 1000,
                        fontSize: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        transition: 'transform 0.3s ease',
                        transform: visible ? 'translateY(0)' : 'translateY(100%)', // Hide/show based on scroll
                  }}
        >
           <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                sx={{ width: '100%', height: '50px', borderRadius: 20 }}
                disabled={loading || !storeOpen}>
                {!storeOpen ? (
                    // Display message when the store is closed
                    <Typography variant="body2" sx={{ color: 'red', textAlign: 'center', width: '100%' }}>
                        Store Closed, Couldn't Place Order
                    </Typography>
                ) : loading ? (
        // Show loading spinner while loading
        <CircularProgress />
    ) : (
        // Show normal button content when store is open and not loading
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {/* Box for total, 30% width */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: '0 0 30%',
                    p: 1,
                }}
            >
                <Typography variant="subtitle2" sx={{ marginLeft: 1, fontWeight: 500 }}>
                    Rs. {total}
                </Typography>
                <Typography variant="subtitle2" sx={{ marginLeft: 1, fontWeight: 400 }}>
                    TOTAL
                </Typography>
            </Box>

            {/* Box for order button, 70% width */}
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" sx={{ marginLeft: 1, fontWeight: 500, fontSize: '1.5rem' }}>
                    Place Order
                </Typography>
                <PlayArrowIcon sx={{ ml: 2 }} />
            </Box>
        </Box>
    )}
</Button>

        </Box>
    );
};

export default CheckoutButton;

