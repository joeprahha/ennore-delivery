import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    Chip,
    InputAdornment,
    Button,
    IconButton,
    Menu,
    MenuItem,Divider
} from '@mui/material';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { useNavigate, useLocation } from 'react-router-dom';
import BikeLoader from '../../loader/BikeLoader';
import { isTokenValid, logout } from '../../utils/auth';
import { api } from '../../utils/api';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import StoreCategoryListModal from './Components/StoreCategoryList';
import { getCartFromLocalStorage, getUserInfo } from '../../utils/localStorage';
import { GoToOrdersButton } from './Components/GoToOrdersButton';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deliveryType, setDeliveryType] = useState('Delivery');

    const [isModalOpen, setModalOpen] = useState(false);
    const [cart, setCart] = useState(getCartFromLocalStorage() || { items: [] });

    const categories = [
        "Groceries",
        "Fast Food",
        "Pizza",
        "Burger",
        "Bakery"
    ];

    useEffect(() => {
        if (!isTokenValid()) {
            logout(navigate);
        }

        const fetchStores = async () => {
            setLoading(true);
            try {
                const response = await api.get('stores');
                setStores(response.data);
            } catch (error) {
                console.error('Error fetching stores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, [navigate]);

    useEffect(() => {
        const newFilteredStores = stores.filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(store.category);
            return matchesSearch && matchesCategory;
        });
        setFilteredStores(newFilteredStores);
    }, [stores, selectedCategories, searchQuery]);

 

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

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <Box sx={{ p: 2, minHeight: '100vh', overflowX: 'hidden' }}>
           

            {/* Sticky Search Bar */}
          <Box
		    sx={{
			position: 'sticky',
			top: 0,
			zIndex: 1,
			backgroundColor: 'transparent',
			width: '100%',
			mb: 2,
			transition: 'background-color 0.3s ease',
			height: '30px'
		    }}
		>
		    <TextField
			variant="outlined"
			size="small"
			onChange={(e) => setSearchQuery(e.target.value)}
			InputProps={{
			    startAdornment: (
				<InputAdornment position="start">
				    <SearchIcon sx={{ color: 'black' }} />
				</InputAdornment>
			    ),
			    // Adjust the input style to reduce height
			    sx: {
				height: '30px', // Set your desired height
				padding: '4px 8px', // Adjust padding as needed
			    },
			}}
			placeholder="search Ennore Delivery "
			sx={{
			    width: '100%',
			    p: 0,
			    boxSizing: 'border-box',
			}}
		    />
		</Box>


            {/* Display Loader while fetching data */}
            {loading ? (
                <BikeLoader />
            ) : (
                <>
		<Divider sx={{mb:1}}/>
                    <Typography variant="h6" sx={{ mb: 1 , fontWeight:'bold'}}>All Stores</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {filteredStores.map(store => {
                            const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const isOpen = store.open_time <= currentTimeString &&
                                           store.close_time >= currentTimeString &&
                                           store.status === 'open';
                            return (
                                <Paper
                                    key={store._id}
                                    elevation={0}
                                    onClick={isOpen ? () => handleStoreClick(store._id) : null}
                                    sx={{
                                        mb: 1,
                                        width: '100%',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: '6px'
                                    }}
                                >
                                    <img
                                        src={store.image}
                                        alt="store"
                                        style={{
                                            width: '100%',
                                            height: '120px',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    <Box sx={{ display: "flex", flexDirection: "column", p: 0.5 }}>
                                        <Typography variant="subtitle2" align='left' sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                            {store.name}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            align="left" 
                                            sx={{ mb: 1, fontSize: '0.75rem', color: '#555' }}
                                        >
                                            {store.address1}
                                        </Typography>
                                    </Box>
                                    {!isOpen && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '5px',
                                                zIndex: 1,
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Typography variant="subtitle2" color="white" display="flex" alignItems="center">
					    Store Closed
					    <BedtimeIcon sx={{ marginLeft: 0.5 }} />
					</Typography>hy>
                                            {store.open_time >= currentTimeString && (
                                                <Typography variant="subtitle2" color="white">
                                                    opens at: {store.open_time}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Paper>
                            );
                        })}
                    </Box>
                </>
            )}

            {/* Go to Orders Button */}
            {cart.storeId && <GoToOrdersButton cart={cart} />}
            <StoreCategoryListModal open={isModalOpen} onClose={handleModalClose} stores={stores} handleStoreClick={handleStoreClick} />
        </Box>
    );
};

export default Stores;

