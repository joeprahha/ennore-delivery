import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Tabs,
    Tab,
    Typography,
    Button,
    IconButton,
    Grid,Paper	
} from '@mui/material';
import BikeLoader from '../loader/BikeLoader';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { getCartFromLocalStorage, setCartToLocalStorage } from '../utils/localStorage';
import { isTokenValid, logout } from '../utils/auth';
import { api } from '../utils/api';

const StoreDetail = () => {
    const { storeId } = useParams();
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [storeInfo, setStoreInfo] = useState(null);
    const [cart, setCart] = useState(getCartFromLocalStorage());
    const navigate = useNavigate();
    const location = useLocation();

    // Get the query parameter
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(location.search);
        return urlParams.get(param);
    };

    const initialActiveTab = getQueryParam('category') || Object.keys(menuItems)[0];
    const [activeTab, setActiveTab] = useState(initialActiveTab);

    // Fetch store details and menu
    const fetchMenu = async () => {
        try {
            const response = await api.get(`menus/${storeId}`);
            setMenuItems(response.data);
            setActiveTab(Object.keys(response.data)[0]);
            const storeResponse = await api.get(`stores/${storeId}`);
            setStoreInfo(storeResponse.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
           setLoading(false);
        }
    };

    useEffect(() => {
        if (!isTokenValid()) {
            logout(navigate);
        }
        fetchMenu();
    }, []);

    useEffect(() => {
        if (cart.length) {
            setCartToLocalStorage(cart);
        }
    }, [cart]);

    useEffect(() => {
        const currentCategory = getQueryParam('category');
        if (currentCategory && currentCategory !== activeTab) {
            setActiveTab(currentCategory);
        }
    }, [location.search]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        navigate(`?category=${newValue}`);
    };

    const filteredItems = searchTerm
        ? Object.keys(menuItems).reduce((acc, category) => {
            menuItems[category].forEach(item => {
                if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    acc.push(item);
                }
            });
            return acc;
        }, [])
        : (menuItems[activeTab] || []);

    const handleAddToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.name === item.name
                    ? { ...cartItem, count: cartItem.count + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, storeId, storeName: storeInfo.name, count: 1 }]);
        }
    };

    const handleRemoveFromCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            if (existingItem.count === 1) {
                setCart(cart.filter(cartItem => cartItem.name !== item.name));
            } else {
                setCart(cart.map(cartItem =>
                    cartItem.name === item.name
                        ? { ...cartItem, count: cartItem.count - 1 }
                        : cartItem
                ));
            }
        }
    };

    const handleAddToCartMain = () => {
        if (cart.length) {
            setCartToLocalStorage(cart);
        }
        navigate('/cart');
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Store Header with Wallpaper */}
            <Box
    sx={{
        position: 'relative',
        width: '100%',
        height: '100px',
        backgroundImage: `url("https://fps.cdnpk.net/images/home/subhome-ai.webp")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}
>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
        <IconButton
            onClick={() => navigate('/stores')}
            color="primary"
            sx={{ color: 'white' }}
        >
            <ArrowBackIcon />
        </IconButton>
        <TextField
    variant="standard"  // Set variant to "standard"
    onChange={(e) => setSearchTerm(e.target.value)}
    InputProps={{
        startAdornment: (
            <InputAdornment position="start">
                <SearchIcon style={{ color: 'white' }} />
            </InputAdornment>
        ),
    }}
    InputLabelProps={{
        style: { color: 'white' },  // Make the label text white
    }}
    placeholder="Search items"
    fullWidth
    size="small"  // Set the size to small
    eror
    sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',  // Translucent white background
        borderRadius: '8px',  // Slightly rounded corners for the glass effect
        '& .MuiInputBase-input': {
            color: 'white',  // White text inside the input field
        },
        
        '& .MuiInputAdornment-root': {
            color: 'white',  // White color for adornments like the search icon
        },
        '& .Mui-focused .MuiInputAdornment-root': {
            color: 'white',  // Ensure the icon stays white when focused
        },
    }}
/>

    </Box>

    {storeInfo ? (
       <>
        <Box 
            sx={{ 
                position: 'absolute', 
                top: '110%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', // Center vertically and horizontally
                textAlign: 'center'
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    backgroundImage: `url(${storeInfo.logoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '2px solid white',
                    mb: 1,
                }}
            />
        </Box>
        
           
</>
    ):<></>}
    </Box>
  {storeInfo ?   <Typography variant="h6" sx={{ color: 'white' }}>{storeInfo.name}</Typography>:<></>}
           
            {/* Sticky Tabs */}
            <Box sx={{ position: 'sticky', top: '64px', zIndex: 10, pb: 2, width: '100%' }}>
                {(!searchTerm && Object.keys(menuItems).length)? (
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: '1px solid #ccc' }}
                    >
                        {Object.keys(menuItems).filter((cat) => menuItems[cat].length).map((category, index) => (
                            <Tab label={category} value={category} key={index} />
                        ))}
                    </Tabs>
                ):<></>}
            </Box>

            {/* Menu Items */}
            {loading ? (
                <BikeLoader />
            ) : filteredItems.length > 0 ? (
              <Grid container spacing={2}>
    {filteredItems.map(item => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                   
                    padding: 1,
                    borderRadius: 1,
                    width: '95%',
                    justifyContent: 'space-between',
                }}
            >
                <img
                    src={`path/to/item/images/${item.name}.jpg`}
                    alt={item.name}
                    style={{ width: 50, height: 50, borderRadius: '4px', marginRight: '10px' }}
                />
                <Box sx={{ flexGrow: 1, mx: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                    <Typography variant="body2">₹{item.price}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {cart.find(cartItem => cartItem.name === item.name) ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                            <IconButton onClick={() => handleRemoveFromCart(item)} disabled={!cart.find(cartItem => cartItem.id === item.id)?.count}>
                                <RemoveIcon />
                            </IconButton>
                            <Typography>{cart.find(cartItem => cartItem.name === item.name)?.count || 0}</Typography>
                            <IconButton onClick={() => handleAddToCart(item)}>
                                <AddIcon />
                            </IconButton>
                             <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleAddToCartMain}
                            sx={{ padding: '4px 8px', fontSize: '0.75rem',ml:2 }}
                        >
                            Go to Cart
                        </Button>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddToCart(item)}
                            sx={{ mr: 1, padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                            Add to Cart
                        </Button>
                    )}
                   
                </Box>
            </Paper>
        </Grid>
    ))}
</Grid>

            ) : (
                <Typography>No items found.</Typography>
            )}
        </Box>
    );
};

export default StoreDetail;

