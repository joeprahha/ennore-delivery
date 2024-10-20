import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    Button,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isTokenValid, logout } from '../../utils/auth';
import { api } from '../../utils/api';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import StoreList from './StoreList'; // Import the StoreList component
import { getCartFromLocalStorage, setCartToLocalStorage } from '../../utils/localStorage';
import {GoToOrdersButton} from './GoToOrdersButton'

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStores, setFilteredStores] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deliveryType, setDeliveryType] = useState('Delivery');
    const navigate = useNavigate();
    
        const [ordersModalOpen, setOrdersModalOpen] = useState(false);
    
        const [cart, setCart] = useState(getCartFromLocalStorage() || { items: [] });
	
	const[goToCartButton,setGoToCartButton]=useState(cart?.storeId||false)
	
    const currentTime = new Date();
    const currentTimeString = currentTime.toTimeString().split(' ')[0].slice(0, 5); // HH:mm format

    useEffect(() => {
        if (!isTokenValid()) {
            logout(navigate);
        }

        const fetchStores = async () => {
            try {
                const response = await api.get('stores');
                setStores(response.data);
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        };

        fetchStores();
        
        
    }, [navigate]);

    useEffect(() => {
        const newFilteredStores = stores.filter((store) => {
            const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
            const isGroceries = activeTab === 0 && store.category === 'groceries';
            const isRestaurants = activeTab === 1 && store.category === 'restaurant';

            return (isGroceries || isRestaurants) && matchesSearch;
        });
        setFilteredStores(newFilteredStores);
    }, [stores, activeTab, searchQuery]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleStoreClick = (storeId) => {
        navigate(`/stores/${storeId}`);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (option) => {
        setDeliveryType(option);
        setAnchorEl(null);
    };

    return (
        <Box sx={{ p: 1 }}>
        
        
        	{
    goToCartButton ? <GoToOrdersButton cart={cart}/> : null
}
            {/* Address and Delivery Type Selection */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box display="flex" alignItems="center">
                    <LocationOnIcon sx={{ color: '#42A5F5', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        123 Main Street, City
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleMenuClick}
                    sx={{ backgroundColor: '#42A5F5', fontSize: '0.8rem' }}
                >
                    {deliveryType}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => handleMenuClose(deliveryType)}
                >
                    <MenuItem onClick={() => handleMenuClose('Delivery')}>Delivery</MenuItem>
                    <MenuItem onClick={() => handleMenuClose('Collection')}>Collection</MenuItem>
                </Menu>
            </Box>

            {/* Search Bar */}
            <TextField
                variant="outlined"
                fullWidth
                size="small"
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 1.5 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                placeholder="Search stores"
            />

            {/* Scrollable Categories */}
         {  searchQuery ? <></> : <Box
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    mb: 2,
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none',
                }}
            >
                {['Groceries', 'Fast Food', 'Restaurants', 'Pharmacy'].map((category, index) => (
                    <Box key={index} sx={{ mr: 2, textAlign: 'center' }}>
                        <Paper
                            sx={{
                                width: 50,
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                mb: 0.5,
                            }}
                        >
                            <img
                                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzW4EUZFweH3nNXHU6USz5v0ys6cK0a5xn7w&s`}
                                alt={category}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </Paper>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{category}</Typography>
                    </Box>
                ))}
            </Box>}

            {/* Render StoreList if there is a search query, otherwise render the filtered store categories */}
            {searchQuery ? (
                <StoreList stores={filteredStores} onStoreClick={handleStoreClick}/>
            ) : (
                ['Groceries', 'Fast Food', 'Restaurants'].map((category) => (
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
                            {filteredStores
                                .filter((store) => store.category === category.toLowerCase())
                                .map((store) => {
                                    const isOpen =
                                        store.open_time <= currentTimeString &&
                                        store.close_time >= currentTimeString &&
                                        store.status === 'open';

                                    return (
                                        <Paper
                                            key={store._id}
                                            onClick={isOpen ? () => handleStoreClick(store._id) : null}
                                            sx={{
                                                cursor: isOpen ? 'pointer' : 'default',
                                                width: '200px', // Fixed width for each card
                                                textAlign: 'center',
                                                p: 1,
                                                mr: 2,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <img
                                                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzW4EUZFweH3nNXHU6USz5v0ys6cK0a5xn7w&s`}
                                                alt="store"
                                                style={{
                                                    width: '100%',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                }}
                                            />

                                            <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                                {store.name}
                                            </Typography>

                                            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.75rem', color: '#555' }}>
                                                456 Elm Street, City
                                            </Typography>

                                            {store.status !== 'open' && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ mt: 1, fontSize: '0.7rem' }}
                                                    disabled={store.status === 'close'}
                                                >
                                                    {store.status === 'open' ? 'Shop Now' : 'Closed'}
                                                </Button>
                                            )}
                                        </Paper>
                                    );
                                })}
                        </Box>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default Stores;

