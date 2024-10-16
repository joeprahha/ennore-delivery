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
    DialogTitle,TableHead,Zoom,CircularProgress
} from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import {
    Table,
    TableBody,
    TableRow,
    TableCell,
   
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
import { baseUrl,api } from '../utils/api';


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [donation, setDonation] = useState(1);
    const [deliveryFee] = useState(4.5);
    const [openModal, setOpenModal] = useState(false);
    const [userDetails, setUserDetails] = useState(getUserInfo() ||{ address1: '', area: '', phone: '' });
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [selectedDonation, setSelectedDonation] = useState(1); // Default donation amount
const[buyingStoreId,setBuyingStoreId]=useState(null)

    useEffect(() => {
        if (!isTokenValid()) {
            logout(navigate);
        }
        const fetchCartAndUserData = async () => {
            const cart = getCartFromLocalStorage();
            setCartItems(cart);

            if (!token) return;

            try {
               const response = await api.get('users')
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

    const handleQuantityChange = (storeId, itemName, newCount) => {
    console.log("item",itemName)
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.storeId === storeId && item.name === itemName
                    ? { ...item, count: newCount }
                    : item
            )
        );
    };

    const calculateTotal = (storeId) => {
        const items = groupedItems[storeId] || [];
        return items.reduce((total, item) => total + +item.price * item.count, 0) + selectedDonation + deliveryFee;
    };

    const handleBuyNow = async (storeId, storename,type) => {
		
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
                    orderType:type,
                    status: 'new',
                    customer_details: getUserInfo(),
                    items: groupedItems[storeId]
                };

               const response = await api.post('orders', orderData);

                console.log('Order created:', response.data);

                // Show success modal
                setOpenSuccessModal(true);
		        setOpenModal(false)
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
            const response = await api.put('update-user', userDetails);

            console.log('User updated:', response.data);

            localStorage.setItem('userInfo', JSON.stringify({...getUserInfo(),...userDetails}));
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
        navigate(-1);
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
                <IconButton onClick={handleClearCart} color="secondary" disabled={Object.keys(groupedItems).length} aria-label="clear cart">
                    <DeleteIcon />
                </IconButton> 
            </Box>


            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Grid container spacing={2}>
                {Object.keys(groupedItems).length === 0 ? (
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Box textAlign="center">
                        <Typography variant="h6" gutterBottom>Your cart is Empty</Typography>
                        <Button variant="contained" color="primary" onClick={() => navigate('/stores')}>
                            Click here to order
                        </Button>
                    </Box>
                </Grid>
                ) : (
                    Object.keys(groupedItems).map(storeId => (
                        <Grid item xs={12} sm={6} md={4} key={storeId}>
                           <Card variant="outlined">
    <CardContent>
        <Typography variant="h5" sx={{ mb: 1 }}>
            Store Name: {groupedItems[storeId][0].storeName}
        </Typography>
        
      <Table sx={{ width: '100%' }} stickyHeader>
      <TableHead>
    <TableRow sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Image Header */}
        <TableCell sx={{ flex: '1', display: 'flex', justifyContent: 'center', borderBottom: 'none' }}>
            <Typography variant="subtitle1" fontWeight="bold">Image</Typography>
        </TableCell>

        {/* Name Header */}
        <TableCell sx={{ flex: '3', display: 'flex', alignItems: 'center', borderBottom: 'none' }}>
            <Typography variant="subtitle1" fontWeight="bold">Name</Typography>
        </TableCell>

        {/* Quantity Header */}
        <TableCell sx={{ flex: '2', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: 'none' }}>
            <Typography variant="subtitle1" fontWeight="bold">Quantity</Typography>
        </TableCell>

        {/* Price Header */}
        <TableCell sx={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: 'none' }}>
            <Typography variant="subtitle1" fontWeight="bold">Price</Typography>
        </TableCell>
    </TableRow>
</TableHead>

    <TableBody>
        {groupedItems[storeId].map(item => (
          <TableRow key={item.id} sx={{ display: 'flex', alignItems: 'center' }}>
    {/* Image Cell */}
    <TableCell sx={{  borderBottom: 'none',width: '15%', display: 'flex', justifyContent: 'center', padding: '8px' }}>
        <img
            src={item.image}
            alt={item.name}
            style={{ width: '50px', height: '50px' }}
        />
    </TableCell>
    
    {/* Name Cell */}
    <TableCell sx={{ borderBottom: 'none', width: '50%', padding: '8px' }}>
        <Typography variant="h6" noWrap>{item.name}</Typography>
    </TableCell>
    
    {/* Quantity Controls Cell */}
    <TableCell sx={{  borderBottom: 'none',width: '20%', padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <IconButton
            onClick={() => handleQuantityChange(storeId, item.name, Math.max(item.count - 1, 1))}
            disabled={item.count <= 1}
        >
            <RemoveIcon />
        </IconButton>
        <Typography style={{ margin: '0 10px' }}>{item.count}</Typography>
        <IconButton
            onClick={() => handleQuantityChange(storeId, item.name, item.count + 1)}
        >
            <AddIcon />
        </IconButton>
    </TableCell>
    
    {/* Price Cell */}
    <TableCell sx={{ borderBottom: 'none', width: '15%', padding: '8px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
            ₹{item.count * +item.price}
        </Typography>
    </TableCell>
</TableRow>

        ))}
{/* Delivery Fee and Donation Selection */}
<TableRow>
    <TableCell sx={{ borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1">Delivery Fee:</Typography>
        <Typography variant="h6">₹4.50</Typography>
    </TableCell>
</TableRow>

<TableRow>
    <TableCell sx={{ borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Label for Donation */}
        <Typography variant="body1">Donation:</Typography>

        {/* Radio Buttons aligned to the right */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {[0, 1, 2, 5].map((amount) => (
                <label key={amount} style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="radio"
                        value={amount}
                        checked={selectedDonation === amount}
                        onChange={() => setSelectedDonation(amount)}
                    />
                    <span style={{ marginLeft: '5px' }}>₹{amount}</span>
                </label>
            ))}
        </Box>
    </TableCell>
</TableRow>


{/* Total Calculation */}
<TableRow>
    <TableCell sx={{ borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total:</Typography>
        <Typography variant="h6">₹{calculateTotal(storeId).toFixed(2)}</Typography>
    </TableCell>
</TableRow>

    </TableBody>
</Table>

        <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {setOpenModal(true);setBuyingStoreId(storeId)}}
            sx={{ mt: 2 }}
        >
            Buy Now
        </Button>
    </CardContent>
</Card>

                        </Grid>
                    ))
                )}
            </Grid>

            {/* Modal for User Details */}

<Modal
    open={openModal}
    onClose={() => setOpenModal(false)} // Closes on clicking outside
    aria-labelledby="user-details-modal-title"
    aria-describedby="user-details-modal-description"
>
    <Box 
        sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            position: 'relative',
        }}
    >
        <Box 
            sx={{ 
                p: 4, 
                bgcolor: 'background.paper', 
                borderRadius: 2, 
                maxWidth: 400, 
                width: '100%', 
                boxShadow: 24,
                position: 'relative' // To position the close button inside
            }}
        >
            {/* Close Icon */}
            <IconButton
                sx={{ position: 'absolute', top: 8, right: 8 }}
                onClick={() => setOpenModal(false)}
            >
                <CloseIcon />
            </IconButton>

            <Typography id="user-details-modal-title" variant="h6" component="h2" gutterBottom>
                Delivery Details
            </Typography>

            <TextField
                fullWidth
                label="Name"
                value={userDetails.name}
                onChange={(e) => handleUserDetailsChange('name', e.target.value)}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Address"
                value={userDetails.address1}
                onChange={(e) => handleUserDetailsChange('address1', e.target.value)}
                margin="normal"
                required
            />
           <FormControl fullWidth margin="normal" required>
	    <InputLabel id="local-area-label">Local Area</InputLabel>
	    <Select
		labelId="local-area-label"
		id="local-area-select"
		value={userDetails.area}
		onChange={(e) => handleUserDetailsChange('area', e.target.value)}
		label="Local Area"
	    >
		<MenuItem value="Chennai">Chennai</MenuItem>
		<MenuItem value="Bangalore">Bangalore</MenuItem>
		<MenuItem value="Pune">Pune</MenuItem>
		<MenuItem value="Delhi">Delhi</MenuItem>
		<MenuItem value="Hyderabad">Hyderabad</MenuItem>
	    </Select>
	</FormControl>
            <TextField
                fullWidth
                label="Phone"
                value={userDetails.phone}
                onChange={(e) => handleUserDetailsChange('phone', e.target.value)}
                margin="normal"
                required
            />

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setOpenModal(false);
                    handleUpdateUserDetails();
                    handleBuyNow(buyingStoreId, groupedItems[buyingStoreId][0].storeName,"delivery");
                     
                }}
                sx={{ mt: 2 }} 
                fullWidth
                disabled={!(userDetails.name && userDetails.phone && userDetails.area && userDetails.address1)}
            >
               {!(userDetails.name && userDetails.phone && userDetails.area && userDetails.address1) ? "fill all to Delivery":"Delivery" }
            </Button>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    handleUpdateUserDetails();
                    handleBuyNow(buyingStoreId, groupedItems[buyingStoreId][0].storeName,"collection");
                   
                }}
                sx={{ mt: 2 }} 
                fullWidth
            >
                Collect from store
            </Button>
                        {loading && <Typography variant="body1">Processing your order...</Typography>}
        </Box>
    </Box>
</Modal>


           <Modal
    open={openSuccessModal}
    onClose={() => setOpenSuccessModal(false)}
    aria-labelledby="success-modal-title"
    aria-describedby="success-modal-description"
    closeAfterTransition
>
    <Zoom in={openSuccessModal}>
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1300, // Ensure the modal appears on top
            }}
        >
            <Box
                sx={{
                    p: 4,
                    bgcolor: 'green', // Set background color to green for success
                    borderRadius: 2,
                    maxWidth: 300,
                    width: '100%',
                    boxShadow: 24,
                    color: 'white', // Change text color to white for better contrast
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Center align items
                    justifyContent: 'center', // Center vertically
                    textAlign: 'center',
                }}
            >
                {/* Success Icon */}
                <CheckCircleOutlineIcon 
                    sx={{ fontSize: 80, color: 'white', mb: 3 }} // Large success icon
                />
                <Typography
                    id="success-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ mb: 2 }}
                >
                    Order Successful!
                </Typography>
                
                {/* Button to Navigate */}
                <Button
                    variant="contained"
                    sx={{ bgcolor: 'white', color: 'green', mt: 3 }} // Inverted button colors
                    onClick={() => {
                        setOpenSuccessModal(false);
                        navigate('/orders'); // Redirect to orders page
                    }}
                >
                    Go to Orders
                </Button>
            </Box>
        </Box>
    </Zoom>
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

