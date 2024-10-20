import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    IconButton,
    Paper,
    InputAdornment,Chip
} from '@mui/material';
import BikeLoader from '../../loader/BikeLoader';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

import { isTokenValid, logout } from '../../utils/auth';
import { api } from '../../utils/api';
import ItemDetailModal from './ItemModal';
import StoreList from './StoreList'
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

import { getCartFromLocalStorage, setCartToLocalStorage } from '../../utils/localStorage';
import {GoToOrdersButton} from './GoToOrdersButton'

const StoreDetail = () => {
    const { storeId } = useParams();
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [storeInfo, setStoreInfo] = useState(null);
    
    const [cart, setCart] = useState(getCartFromLocalStorage() || { items: [] });
    	const[goToCartButton,setGoToCartButton]=useState(cart?.storeId||false)
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

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
    
      const getItemCountFromCart = (itemName) => {
        if (cart.storeId === storeInfo?._id) { // Check if storeId matches
            const cartItem = cart?.items?.find(cartItem => cartItem.name === itemName); // Check if the item exists in the cart
            return cartItem ? cartItem.count : 0; // Return the count if found
        }
        return 0;
    };

    useEffect(() => {
        if (!isTokenValid()) {
            logout(navigate);
        }
        fetchMenu();
    }, []);
    useEffect(() => {
      
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

  

    return (
        <Box sx={{width:'100%',p:0 }}>
            {/* Store Header with Wallpaper */}
            {
    goToCartButton ? <GoToOrdersButton cart={cart}/> : null
}
          <Box
    sx={{
        position: 'relative',
        width: '100%',
        height: '150px',
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

        {/* Centered Store Name */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {storeInfo && <Typography variant="h6">{storeInfo.name}</Typography>}
        </Box>

        {/* Optional space for alignment */}
        <Box sx={{ width: '48px' }} /> {/* This box ensures that there's space on the right */}
    </Box>
</Box>


            {/* Search Bar Below Wallpaper */}
            <Box sx={{ mt: 1,p:1 }}>
               
                 <TextField
                variant="outlined"
                fullWidth
                size="small"
                onChange={(e) => setSearchTerm(e.target.value)}
               
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                placeholder={`Search items in "${storeInfo?.name}"`}	
            />
            </Box>

          {searchTerm ? (
    <StoreList stores={filteredItems} onStoreClick={() => {}} />
) : (
    <Box sx={{ p: 1 }}>
        {Object.keys(menuItems).map((category) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                           <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', mb: 1 }}>
                    {category}
                </Typography>
                 <IconButton size="small">
                                <ArrowCircleRightOutlinedIcon />
                            </IconButton>
                        </Box>
                
                <Box sx={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'thin' }}>
                    {menuItems[category].map((item) => (
                        <Paper
                            key={item.id}
                            onClick={() => handleOpenModal(item)} // Open modal on click
                            sx={{
                                cursor: 'pointer',
                                width: '100px', // Fixed width for each card
                                textAlign: 'center',
                                p: 1,
                                mr: 2,
                                flexShrink: 0,
                                textAlign:'left'
                            }}
                        >
                            <img
                                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzW4EUZFweH3nNXHU6USz5v0ys6cK0a5xn7w&s`}
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
                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.75rem', color: '#555' }}>
                                                    ₹{item.price}
                                                </Typography>
                                                {/* Show count in the line of price if item is in cart */}
                                                {getItemCountFromCart(item.name) > 0 && (
                                                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.75rem', color: '#555' }}>
                                                        <Chip label={getItemCountFromCart(item.name)} size="small" />

                                                    </Typography>
                                                )}
                                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>
        ))}

        {/* Item Detail Modal */}
        {selectedItem && (
            <ItemDetailModal
                open={modalOpen}
                onClose={handleCloseModal}
                item={selectedItem}
		storeInfo={storeInfo}
		cart={cart}
		setCart={setCart}
            />
        )}
    </Box>
)}

        </Box>
    );
};

export default StoreDetail;

