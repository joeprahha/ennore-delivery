import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    IconButton,
    Grid,
    Paper,
    InputAdornment,
    Button,
} from '@mui/material';
import BikeLoader from '../../loader/BikeLoader';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { getCartFromLocalStorage, setCartToLocalStorage } from '../../utils/localStorage';
import { isTokenValid, logout } from '../../utils/auth';
import { api } from '../../utils/api';

const StoreDetail = () => {
    const { storeId } = useParams();
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [storeInfo, setStoreInfo] = useState(null);
    const [cart, setCart] = useState(getCartFromLocalStorage());
    const navigate = useNavigate();

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

    const filteredItems = searchTerm
        ? Object.keys(menuItems).reduce((acc, category) => {
            menuItems[category].forEach(item => {
                if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    acc.push(item);
                }
            });
            return acc;
        }, [])
        : (menuItems[Object.keys(menuItems)[0]] || []);

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

    return (
        <Box sx={{ p: 2 }}>
            {/* Store Header with Wallpaper */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    backgroundImage: `url("https://fps.cdnpk.net/images/home/subhome-ai.webp")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                    <IconButton
                        onClick={() => navigate('/stores')}
                        color="primary"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Box>
                {storeInfo && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            textAlign: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                backgroundImage: `url(${storeInfo.logoUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: '2px solid white',
                                mb: 1,
                            }}
                        />
                        <Typography variant="h6">{storeInfo.name}</Typography>
                    </Box>
                )}
            </Box>

            {/* Search Bar Below Wallpaper */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    variant="outlined"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    placeholder="Search items"
                    fullWidth
                    size="small"
                />
            </Box>

            {/* Menu Items Section with Layout as Categories */}
            <Box>
               {Object.keys(menuItems).map((category) => (
    <Box key={category} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>{category}</Typography>
            <IconButton size="small">
                <ArrowCircleRightOutlinedIcon />
            </IconButton>
        </Box>

        <Box
            sx={{
                display: 'flex',
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#888' },
            }}
        >
            {menuItems[category].map((item) => (
                <Paper
                    key={item.id}
                    onClick={() => handleAddToCart(item)} // Add click handling for adding item to cart
                    sx={{
                        cursor: 'pointer',
                        width: '200px', // Fixed width for each card
                        textAlign: 'center',
                        p: 1,
                        mr: 2,
                        flexShrink: 0,
                    }}
                >
                    <img
                        src={`path/to/item/images/${item.name}.jpg`} // Update with the correct image path for items
                        alt={item.name}
                        style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                        }}
                    />
                    <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {item.name}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.75rem', color: '#555' }}>
                        ₹{item.price}
                    </Typography>

                    {/* Display additional information if needed, like a description or address */}
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.75rem', color: '#555' }}>
                        Item Description or any additional info
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(item); }}>
                            <RemoveIcon />
                        </IconButton>
                        <Typography>{cart.find(cartItem => cartItem.name === item.name)?.count || 0}</Typography>
                        <IconButton onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Paper>
            ))}
        </Box>
    </Box>
))}

            </Box>
        </Box>
    );
};

export default StoreDetail;

