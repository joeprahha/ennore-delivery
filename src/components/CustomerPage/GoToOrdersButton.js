import { useNavigate } from 'react-router-dom'; 
import React, { useEffect, useState } from 'react';// Import the useNavigate hook
import {Box,Button,Typography} from '@mui/material';
import OrdersModal from './ordersModal'; // Import the Orders modal

export const GoToOrdersButton = ({cart}) => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [ordersModalOpen, setOrdersModalOpen] = useState(false);
    
    // Function to handle navigation to the cart page
    const handleGoToCart = () => {
    setOrdersModalOpen(true)
        //navigate('/cart'); // Replace '/cart' with the actual route of your cart page
    };

    return (<>
 <Button
    variant="contained"
    color="primary"
    onClick={handleGoToCart} // Navigate to the cart page on click
    sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        height: '50px',
        borderRadius: 20,
        zIndex: 1000,
        fontSize: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
    }}
>
    {/* Centered Box for Store name and Go to Orders */}
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',  // Vertically center the text
            alignItems: 'center',      // Horizontally center the text
            flex: 1,                   // Make this Box take up full available space
            textAlign: 'center',
        }}
    >
        {/* Store name */}
        <Typography variant="body1" sx={{ fontWeight: 'normal',fontSize: '0.75rem',p:0 }}>
            {cart?.storeName}
        </Typography>
        {/* Go to Orders */}
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Go to Orders
        </Typography>
    </Box>

    {/* Right side: Cart count */}
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black', // Black background for the circle
            borderRadius: '50%',
            width: 24,
            height: 24,
        }}
    >
        <Typography variant="caption" sx={{ color: 'white', fontSize: '0.75rem' }}>
            {cart?.items?.length} 
        </Typography>
    </Box>
</Button>
 <OrdersModal
                open={ordersModalOpen}
                onClose={() => setOrdersModalOpen(false)}
               
            />

</>

    );
};

