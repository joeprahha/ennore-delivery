import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderSuccess = () => {
    const { orderid } = useParams();
    const navigate = useNavigate();

    const handleGoToOrders = () => {
        navigate('/orders');
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                position: 'relative',
            }}
        >
            <Box 
                sx={{ 
                    mb: 2, 
                    animation: 'zoom-out 0.5s forwards', 
                    '@keyframes zoom-out': {
                        '0%': {
                            transform: 'scale(1)',
                        },
                        '100%': {
                            transform: 'scale(0.8)',
                            opacity: 0.8,
                        },
                    },
                }}
            >
                <CheckCircleIcon color="success" style={{ fontSize: 100 }} />
            </Box>
            <Typography variant="h4" gutterBottom>
                Your order has been placed successfully!
            </Typography>
            <Typography variant="h6">
                Your Order ID: <strong>{orderid}</strong>
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGoToOrders}
                sx={{ mt: 3 }}
            >
                Go to Orders
            </Button>
        </Container>
    );
};

export default OrderSuccess;

