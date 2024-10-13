import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Grid,
    Card,
    CardContent,
    Modal,
    TextField,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import {
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
    Remove as RemoveIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCartFromLocalStorage, isValidCustomerDetails, getUserInfo } from '../utils/localStorage';
import { isTokenValid } from '../utils/auth';
import { logout } from '../utils/auth';
import { baseUrl } from '../utils/api';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [donation, setDonation] = useState(1);
    const [deliveryFee] = useState(4.5);
    const [openModal, setOpenModal] = useState(false);
    const [userDetails, setUserDetails] = useState({ address1: '', local_area: '', phone: '' });
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [selectedDonation, setSelectedDonation] = useState(1); // Default donation amount

    useEffect(() => {
        if (!isTokenValid()) {
            logout(navigate);
        }
        const fetchCartAndUserData = async () => {
            const cart = getCartFromLocalStorage();
            setCartItems(cart);

            if (!token) return;

            try {
                const response = await axios.get(`${baseUrl}/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                localStorage.setItem('userInfo', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
            }
        };

        fetchCartAndUserData();
    }, [token, navigate]);

    const groupedItems = cartItems.reduce((acc, item) => {
        acc[item.storeId] = acc[item.storeId] || [];
        acc[item.storeId].push(item);
        return acc;
    }, {});

    const handleQuantityChange = (storeId, itemId, newCount) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.storeId === storeId && item.id === itemId
                    ? { ...item, count: newCount }
                    : item
            )
        );
    };

    const calculateTotal = (storeId) => {
        const items = groupedItems[storeId] || [];
        return items.reduce((total, item) => total + +item.price * item.count, 0) + selectedDonation + deliveryFee;
    };

    const handleBuyNow = async (storeId, storename) => {
        if (isValidCustomerDetails()) {
            setLoading(true);
            setErrorMessage('');
            try {
                const orderData = {
                    storeId,
                    storename,
                    createduser: getUserInfo().name,
                    total: calculateTotal(storeId),
                    delivery_fee: deliveryFee,
                    donation,
                    status: 'new',
                    customer_details: getUserInfo(),
                    items: groupedItems[storeId]
                };

                const response = await axios.post(`${baseUrl}/orders`, orderData);
                console.log('Order created:', response.data);

                // Show success modal
                setOpenSuccessModal(true);

                // Clear the cart
                localStorage.removeItem('cart');
                setCartItems([]);
            } catch (error) {
                console.error('Error creating order:', error);
                setErrorMessage('Failed to create order. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setOpenModal(true);
        }
    };

    const handleUpdateUserDetails = async () => {
        try {
            const response = await axios.put(`${baseUrl}/update-user`, userDetails, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('User updated:', response.data);
            localStorage.setItem('userInfo', JSON.stringify(userDetails));
            setOpenModal(false);
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const handleClearCart = () => {
        setOpenConfirmDialog(true);
    };

    const confirmClearCart = () => {
        localStorage.removeItem('cart');
        setCartItems([]);
        setOpenConfirmDialog(false);
    };

    const handleGoBack = () => {
        navigate('/stores');
    };

    const handleDonationChange = (amount) => {
        setDonation(amount);
    };

    const handleUserDetailsChange = (field, value) => {
        setUserDetails(prevDetails => ({ ...prevDetails, [field]: value }));
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handleGoBack} color="primary" aria-label="go back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontSize: '1.5rem' }}>Your Cart</Typography>
                <IconButton onClick={handleClearCart} color="secondary" aria-label="clear cart">
                    <DeleteIcon />
                </IconButton>
            </Box>

            {loading && <Typography variant="body1">Processing your order...</Typography>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Grid container spacing={2}>
                {Object.keys(groupedItems).length === 0 ? (
                    <Typography>No items in cart.</Typography>
                ) : (
                    Object.keys(groupedItems).map(storeId => (
                        <Grid item xs={12} sm={6} md={4} key={storeId}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" sx={{ mb: 1 }}>
                                        Store Name: {groupedItems[storeId][0].storeName}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        Store ID: {storeId}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        {groupedItems[storeId].map(item => (
                                            <Box
                                                key={item.id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                                    />
                                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>{item.name}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <IconButton
                                                        onClick={() => handleQuantityChange(storeId, item.id, Math.max(item.count - 1, 1))}
                                                        disabled={item.count <= 1}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography sx={{ mx: 1 }}>{item.count}</Typography>
                                                    <IconButton
                                                        onClick={() => handleQuantityChange(storeId, item.id, item.count + 1)}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>₹{item.count * +item.price}</Typography>
                                                </Box>
                                            </Box>
                                        ))}

                                        {/* Delivery Fee and Donation Selection */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                            <Typography variant="body1">Delivery Fee:</Typography>
                                            <Typography variant="h6">₹4.50</Typography>
                                        </Box>
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body1">Donation:</Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
                                                {[0, 1, 2, 5].map((amount) => (
                                                    <label key={amount}>
                                                        <input
                                                            type="radio"
                                                            value={amount}
                                                            checked={selectedDonation === amount}
                                                            onChange={() => setSelectedDonation(amount)}
                                                        />
                                                        ₹{amount}
                                                    </label>
                                                ))}
                                            </Box>
                                        </Box>

                                        {/* Total Calculation */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                            <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Total:</Typography>
                                            <Typography variant="h6">₹{calculateTotal(storeId).toFixed(2)}</Typography>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={() => handleBuyNow(storeId, groupedItems[storeId][0].storeName)}
                                            sx={{ mt: 2 }}
                                        >
                                            Buy Now
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Modal for User Details */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="user-details-modal-title"
                aria-describedby="user-details-modal-description"
            >
                <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 400, margin: 'auto' }}>
                    <Typography id="user-details-modal-title" variant="h6" component="h2">
                        User Details
                    </Typography>
                    <TextField
                        fullWidth
                        label="Address"
                        value={userDetails.address1}
                        onChange={(e) => handleUserDetailsChange('address1', e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Local Area"
                        value={userDetails.local_area}
                        onChange={(e) => handleUserDetailsChange('local_area', e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        value={userDetails.phone}
                        onChange={(e) => handleUserDetailsChange('phone', e.target.value)}
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleUpdateUserDetails}>
                        Save
                    </Button>
                </Box>
            </Modal>

            {/* Success Modal */}
            {/* Success Modal */}
            <Modal
                open={openSuccessModal}
                onClose={() => setOpenSuccessModal(false)}
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                <Box
                    sx={{
                        p: 4,
                        bgcolor: 'white', // Set background color to green
                        borderRadius: 2,
                        maxWidth: 400,
                        margin: 'auto',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)', // Center the modal
                        boxShadow: 24,
                        color: 'white', // Change text color to white for better contrast
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // Center align items
                        justifyContent: 'center', // Center vertically
                    }}
                >
                    <Typography id="success-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', color: 'black' }}>
                        Order Successful!
                    </Typography>
                    <Typography id="success-modal-description" sx={{ mt: 2, textAlign: 'center', color: 'black' }}>
                        Thank you for your order! It has been placed successfully.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setOpenSuccessModal(false);
                            navigate('/orders'); // Redirect to orders page
                        }}
                    >
                        See Order
                    </Button>
                </Box>
            </Modal>

            {/* Confirmation Dialog for Clearing Cart */}
            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>Confirm Clear Cart</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to clear the cart?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={confirmClearCart} color="secondary">Clear Cart</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Cart;
