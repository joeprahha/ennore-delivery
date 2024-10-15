import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Tabs,
    Tab,
    Typography,
    Button,
    CircularProgress,
    IconButton,
    Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getCartFromLocalStorage, setCartToLocalStorage } from '../utils/localStorage';
import { isTokenValid, logout } from '../utils/auth';
import { baseUrl,api } from '../utils/api';


const StoreDetail = () => {
    const { storeId } = useParams();
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [storeInfo, setStoreInfo] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [cart, setCart] = useState(getCartFromLocalStorage());
    const navigate = useNavigate();

    // Fetch store details and menu
    const fetchMenu = async () => {
        try {
            const response = await api.get(`menus/${storeId}`);
            setMenuItems(response.data);
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

    // Filter menu items based on the search term and selected tab
    const filteredItems = searchTerm
        ? Object.keys(menuItems).reduce((acc, category) => {
            menuItems[category].forEach(item => {
                if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    acc.push(item);
                }
            });
            return acc;
        }, [])
        : (menuItems[Object.keys(menuItems)[activeTab]] || []);

  // Function to add an item to the cart
  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
      // If the item is already in the cart, increment the count
      setCart(cart.map(cartItem =>
        cartItem.name === item.name
          ? { ...cartItem, count: cartItem.count + 1 }
          : cartItem
      ));
    } else {
      // If the item is not in the cart, add it with a count of 1
      setCart([...cart, { ...item,storeId,storeName:storeInfo.name ,count: 1 }]);
    }
  };

  // Function to remove an item from the cart
  const handleRemoveFromCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
      if (existingItem.count === 1) {
        // If the count is 1, remove the item from the cart
        setCart(cart.filter(cartItem => cartItem.name !== item.name));
      } else {
        // If more than 1, decrement the count
        setCart(cart.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, count: cartItem.count - 1 }
            : cartItem
        ));
      }
    }
  };
    // Add to cart button
    const handleAddToCartMain = () => {
        console.log('Cart:', cart);
        if (cart.length) {
            setCartToLocalStorage(cart);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Store Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center',mb: 1, width: '100%' }}>
                    <IconButton onClick={() => navigate('/stores')} color="primary" aria-label="go back">
                        <ArrowBackIcon />
                    </IconButton>
                     <TextField
                    label={`Search items in "${storeInfo?.name}"`}
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2}}
                    
                />
                </Box>
              
            </Box>

            {/* Sticky Search Bar and Tabs */}
            <Box sx={{ position: 'sticky', top: '64px', zIndex: 10, backgroundColor: 'white', pb: 2 ,width:'100%'}}>
               
                {!searchTerm && (
                    <Tabs
                        value={activeTab}
                        onChange={(event, newValue) => setActiveTab(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: '1px solid #ccc' }}
                    >
                        {Object.keys(menuItems).map((category, index) => (
                            <Tab label={category} key={index} />
                        ))}
                    </Tabs>
                )}
            </Box>

            {/* Menu Items */}
            {loading ? (
                <CircularProgress />
            ) : filteredItems.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredItems.map(item => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    padding: 1,
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    width: '95%',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <img
                                    src={`path / to / item / images / ${item.name}.jpg`}
                                    alt={item.name}
                                    style={{ width: 50, height: 50, borderRadius: '4px', marginRight: '10px' }}
                                />
                                <Box sx={{ flexGrow: 1, mx: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                                    <Typography variant="body2">₹{item.price}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton onClick={() => handleRemoveFromCart(item)} disabled={!cart.find(cartItem => cartItem.id === item.id)?.count}>
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography sx={{ mx: 1 }}>{cart.find(cartItem => cartItem.name === item.name)?.count || 0}</Typography>
                                        <IconButton onClick={() => handleAddToCart(item)}>
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddToCartMain}
                                        sx={{ mt: 1, padding: '4px 8px', fontSize: '0.75rem' }} // Smaller button
                                        disabled={!cart.find(cartItem => cartItem.name === item.name)}
                                    >
                                        Add to Cart
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No items found.</Typography>
            )}
        </Box>
    );
};

export default StoreDetail;

