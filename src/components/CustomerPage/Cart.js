import React, { useState, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom'; // or the appropriate routing library
import {
    Box,
    Typography,
    IconButton,
    Button,
    Paper,
    Divider,
    Drawer,
    Snackbar,
    CircularProgress,
    TextField,
    Autocomplete,
    Chip
} from '@mui/material';
import TipAndDonationSection from './Components/TipAndDonationSection'; // Adjust the import path as needed

import CheckoutButton from './Components/CheckoutButton'; // Adjust the import path as needed
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import CloseIcon from '@mui/icons-material/Close';
import VillaOutlinedIcon from '@mui/icons-material/VillaOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';

import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import {  api } from '../../utils/api';


import { getCartFromLocalStorage, setCartToLocalStorage, getUserInfo } from '../../utils/localStorage';
import QuantityButton from './Components/QuantityButton';

const locations = [
    'Nettukuppam',
    'Ennore Kuppam',
    'Thazhankuppam',
    'Mugathuvara Kuppam',
    'Ulagnathapuram',
    'SVM Nagar',
    'Vallur Nagar',
    'Kamaraj Nagar',
    'High School Surroundings',
    'Kaathukuppam',
    'RS Road',
    'Ennore Bus Depot Surroundings',
];

const Cart = () => {
    const [cart, setCart] = useState(getCartFromLocalStorage());
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [address, setAddress] = useState(getUserInfo() || {name:'', phone: '', address1: '', local: '' });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [donation, setDonation] = useState(1);
    const [driverTip, setDriverTip] = useState(1);
    const [drawerItem, setDrawerItem] = useState(null);
    const navigate=useNavigate()
    
    const subtotal = cart.items.reduce((total, item) => total + item.price * item.count, 0);
    const platformFee = 1;
    const deliveryFee = 4.5;
    const total = subtotal + platformFee + deliveryFee + donation + driverTip;
	
	const handleChange = (field) => (event) => {
    setAddress({ ...address, [field]: event.target.value });
};
    useEffect(() => {
        setCart(getCartFromLocalStorage());
    }, []);

    const handleDrawer = (item) => {
        setDrawerItem(item);
        setDrawerOpen(true);
    };


    const handleCheckout = async () => {
        setLoading(true);
        
        // Create orderData object
        const orderData = {
            storeId: cart.storeId,
            storename: cart.storeName,
            createduser: getUserInfo().name,
            total: total,
            delivery_fee: deliveryFee,
            donation: donation,
            orderType: 'delivery',
            status: 'new',
            customer_details: {
                address: {
                    address1: address.address1,
                    local: address.local,
                },
                name: address.name, // Ensure you have a name field in address
                phone: address.phone,
            },
            items: cart.items,
	    driverTip,
	    platformFee,
	    subTotal:subtotal	
        };

          const response = await api.post('orders', orderData);

	if(response.data.order._id){
	navigate(`/orderSuccess/${response.data.order._id}`)
 	localStorage.removeItem('cart');
         setCart([]);
        setLoading(false);
        }
	
    };

    return (
    
    <>
 <Box 
                        sx={{ 
                            display: 'flex', 
                            position: 'sticky', 
				alignItems:'center',
                            top: 0, 
                            zIndex: 10, 
                            backgroundColor: '#fff', 
                           mt:1,ml:1
                        }}
                    >

                                <IconButton onClick={()=>navigate(-1)}>
                                    <ArrowBackIosNewOutlinedIcon />
                                </IconButton> Go back
			<Divider/>
                            </Box>
    
       { 
       	cart.items.length ?
       
      ( <Box sx={{ padding: 2 }}>
            {/* Cart Items */}
 		
            <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '0.75rem', color: '#555', mb: 1 }}>
                    Add More from{' '}
                    <Link to={`/stores/${cart.storeId}`} style={{ fontSize: '0.80rem', fontWeight: 500, color: 'main.primary', textDecoration: 'underline' }}>
                        {cart.storeName}
                    </Link>
                </Typography>
                {cart.items.map(item => (
                    <Box key={item.name} sx={{ mb: 2, display: 'flex' }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                                {item.name}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: '0.75rem', color: '#555' }}>
                                Rs.{item.price}
                            </Typography>
                        </Box>
                        <Box>
                            <QuantityButton 
                                item={item} 
                                cart={cart} 
                                setCart={setCart} 
				cartItem={item}
                            />
                            <Typography variant="body2" align="right" sx={{ flex: '0 0 0%' }}>
                                Rs. {item.price * item.count}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>Subtotal: Rs. {subtotal}</Typography>
 <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }} onClick={() => handleDrawer('charges')}>
                    <ReceiptLongOutlinedIcon />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ marginLeft: 1, fontSize: '0.8rem' }}>
                                Total Bill:
                            </Typography>
                            <Typography variant="subtitle2" sx={{ marginLeft: 1, fontWeight: 500, fontSize: '0.8rem' }}>
                                {total}
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ marginLeft: 1, fontSize: '0.8rem' }}>
                            Incl. Delivery Fee & Charges
                        </Typography>
                    </Box>
                    <IconButton onClick={() => handleDrawer('charges')}>
                        <KeyboardArrowRightOutlinedIcon />
                    </IconButton>
                </Box>
            </Paper>

            {/* Delivery Details */}
            <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DeliveryDiningOutlinedIcon />
                    <Typography variant="body1" sx={{ marginLeft: 1 }}>Delivery in 47 mins</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }} onClick={() => handleDrawer('deliver')}>
                    <VillaOutlinedIcon />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ marginLeft: 1, fontWeight: 500, fontSize: '0.8rem' }}>
                            Deliver at:
                        </Typography>
                        <Typography variant="body1" sx={{ marginLeft: 1, fontSize: '0.8rem' }}>
                            {address.address1}, {address.local}
                        </Typography>
                    </Box>
                    <IconButton onClick={() => handleDrawer('deliver')}>
                        <KeyboardArrowRightOutlinedIcon />
                    </IconButton>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }} onClick={() => handleDrawer('phone')}>
                    <LocalPhoneOutlinedIcon />
                    <Typography variant="body1" sx={{ marginLeft: 1, flexGrow: 1, fontSize: '0.8rem' }}>
                        {address.name} ({address.phone})
                    </Typography>
                    <IconButton onClick={() => handleDrawer('phone')}>
                        <KeyboardArrowRightOutlinedIcon />
                    </IconButton>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }} onClick={() => handleDrawer('charges')}>
                    <ReceiptLongOutlinedIcon />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ marginLeft: 1, fontSize: '0.8rem' }}>
                                Total Bill:
                            </Typography>
                            <Typography variant="subtitle2" sx={{ marginLeft: 1, fontWeight: 500, fontSize: '0.8rem' }}>
                                {total}
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ marginLeft: 1, fontSize: '0.8rem' }}>
                            Incl. Delivery Fee & Charges
                        </Typography>
                    </Box>
                    <IconButton onClick={() => handleDrawer('charges')}>
                        <KeyboardArrowRightOutlinedIcon />
                    </IconButton>
                </Box>
                <Divider />
            </Paper>

  	  <TipAndDonationSection 
                title="Support your delivery partner"
                subtitle="Show appreciation with a tip in these challenging times"
                amounts={[0, 1, 2, 3, 4, 5]}
                selectedAmount={driverTip}
                setSelectedAmount={setDriverTip}
                icon={<DeliveryDiningOutlinedIcon />}
            />

            {/* Donation Section */}
            <TipAndDonationSection 
                title="Donation"
                subtitle="Show appreciation with a donation to grow all"
                amounts={[0, 1, 2, 3, 4, 5]}
                selectedAmount={donation}
                setSelectedAmount={setDonation}
                icon={<VolunteerActivismOutlinedIcon />}
            />

          
            <Box sx={{ height: '80px' }} />
            {/* Checkout Button */}
          
            <CheckoutButton total={total} loading={loading} handleCheckout={handleCheckout} />

            {/* Drawer for Address */}
            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                            '& .MuiDrawer-paper': {
                                height: 'auto',
                                bottom: 0,
                                borderRadius: '16px 16px 0 0',
                            },
                        }}
            >
                <Box sx={{ padding: 2 }}>
                    {/* Close Icon */}
                 	 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <IconButton onClick={()=>setDrawerOpen(false)}>
                                    <CloseIcon />
                                </IconButton>

                            </Box>
{drawerItem === 'phone' && (
    <>
        <Typography variant="h6">Update Receiver's Details</Typography>
        <TextField
            label="Receiver's Name"
            variant="outlined"
            fullWidth
            value={address.name}
            onChange={handleChange('name')}
            sx={{ mt: 1, mb: 1 }}
        />
        <TextField
            label="Receiver's Mobile Number"
            variant="outlined"
            fullWidth
            value={address.phone}
            onChange={handleChange('phone')}
            sx={{ mt: 1, mb: 2 }}
        />
        <Button
            variant="contained"
            onClick={() => {
              setDrawerOpen(false)
            }}
        >
            Submit
        </Button>
    </>
)}

{drawerItem === 'deliver' && (
    <>
        <Typography variant="h6">Update Delivery Details</Typography>
        <TextField
            label="Full Address"
            variant="outlined"
            fullWidth
            value={address.address1}
            onChange={handleChange('address1')}
            sx={{ mt: 1, mb: 2 }}
        />
        <Autocomplete
            fullWidth
            sx={{ mt: 1, mb: 2 }}
            options={locations}
            value={address.local}
            onChange={(event, newValue) => {
                setAddress({ ...address, local: newValue });
            }}
            renderInput={(params) => (
                <TextField {...params} label="Local Area" variant="outlined" />
            )}
        />
        <Button
            variant="contained"
            onClick={() => {
              setDrawerOpen(false)
            }}
        >
            Submit
        </Button>
    </>
)}

{drawerItem === 'charges' && (
    <>
        <Typography variant="h6">Bill Summary</Typography>
        <Divider sx={{ marginY: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginY: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptLongOutlinedIcon sx={{ marginRight: 1 }} />
                <Typography sx={{ fontSize: '0.8rem' }}>Item Total:</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>₹{subtotal}</Typography>
        </Box>
        <Divider sx={{ marginY: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginY: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalShippingOutlinedIcon sx={{ marginRight: 1 }} />
                <Typography sx={{ fontSize: '0.8rem' }}>Delivery Partner Fee:</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>₹{deliveryFee}</Typography>
        </Box>
        <Divider sx={{ marginY: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginY: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MonetizationOnOutlinedIcon sx={{ marginRight: 1 }} />
                <Typography sx={{ fontSize: '0.8rem' }}>Platform Fee:</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>₹{platformFee}</Typography>
        </Box>
        <Divider sx={{ marginY: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginY: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VolunteerActivismOutlinedIcon sx={{ marginRight: 1 }} />
                <Typography sx={{ fontSize: '0.8rem' }}>Donation:</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>₹{donation}</Typography>
        </Box>
        <Divider sx={{ marginY: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginY: 1, fontWeight: 'bold' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MonetizationOnOutlinedIcon sx={{ marginRight: 1 }} />
                <Typography variant="h6">Grand Total:</Typography>
            </Box>
            <Typography variant="h6">₹{total}</Typography>
        </Box>
 	
    </>
)}



                </Box>
            </Drawer>

            {/* Snackbar for Success Message */}
            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                message={successMessage}
            />
        </Box>):     
                <Typography variant="h6">Your cart is empty</Typography>} </>
    );
};

export default Cart;

