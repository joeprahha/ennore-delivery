// OrdersModal.js
import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    AppBar,
    Toolbar,
    Button,
    Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCartFromLocalStorage } from '../../utils/localStorage';

// Transition for swipe-up effect
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const OrdersModal = ({ open, onClose }) => {
    const cart = getCartFromLocalStorage() || { items: [], storeName: 'Store 1' }; // Add a default store name if not available
    const subtotal = cart?.items?.reduce((total, item) => total + item.price * item.count, 0);

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
            <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        {cart.storeName}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ padding: 2, overflowY: 'auto', height: '100vh' }}>
                {/* Cart Item List */}
                <Box sx={{ mb: 2 }}>
                    {!cart?.items?.length ? (
                        <Typography variant="body1">No items in the cart.</Typography>
                    ) : (
                        cart.items.map((item) => (
                            <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">{item.name} (x{item.count})</Typography>
                                <Typography variant="body1">Rs. {item.price * item.count}</Typography>
                            </Box>
                        ))
                    )}
                </Box>

                {/* Subtotal */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Subtotal: Rs. {subtotal}
                </Typography>

                {/* Checkout Button */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                           position: 'absolute',
                            bottom: 16,
                            left: 16,
                            right: 16,
                            height: '50px',
                             bottom: 16,
			borderRadius: 20,
			fontSize: '1rem',
			px: 2,
                        }} 
                    onClick={() => alert('Proceed to Checkout!')} // Placeholder for checkout action
                >
                    Checkout
                </Button>
            </Box>
        </Dialog>
    );
};

export default OrdersModal;

