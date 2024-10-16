import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Tabs,
    Tab,
    Grid,
    Typography,
    Paper,Button
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isTokenValid, logout } from '../utils/auth';
import { baseUrl ,api} from '../utils/api';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStores, setFilteredStores] = useState([]);
    const navigate = useNavigate();

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    useEffect(() => {
        if (!isTokenValid()) {
            logout(navigate);
        }

        const fetchStores = async () => {
            try {
                const response = await api.get(`stores`);
              	console.log("re",response)
                setStores(response.data);
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        };

        fetchStores();
    }, []);

    useEffect(() => {
        const newFilteredStores = stores?.filter((store) => {
            const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
            if (searchQuery) {
                return matchesSearch
            }
            else {
                const isGroceries = activeTab === 0 && store.category === 'groceries';
                const isRestaurants = activeTab === 1 && store.category === 'restaurant';

                return (
                    (isGroceries || isRestaurants) &&
                    matchesSearch
                );
            }
        });

        setFilteredStores(newFilteredStores);
    }, [stores, activeTab, searchQuery]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleStoreClick = (storeId) => {
        navigate(`/stores/${storeId}`);
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Sticky search bar and category tabs */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 64,  // Adjust this to match your app bar's height
                    zIndex: 1000,
                    pb: 2,
                }}
            >
                <TextField
		    variant="outlined"
		    fullWidth
		    onChange={(e) => setSearchQuery(e.target.value)}
		    sx={{ mb: 2 }}
		    InputProps={{
			startAdornment: (
			    <InputAdornment position="start">
				<SearchIcon />
			    </InputAdornment>
			),
		    }}
		    placeholder="Search stores"
		/>
		
                {!searchQuery && (
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="store tabs" sx={{ mb: 2 }}>
                        <Tab label="Groceries" />
                        <Tab label="Restaurants" />
                    </Tabs>
                )}
            </Box>

            {/* Store list */}
            <Grid container spacing={2}>
                {filteredStores.map((store) => {
                    // Check if the store is open based on open and close time
                    const isOpen = store.open_time <= currentTimeString && store.close_time >= currentTimeString && store.status==='open';

                    return (
                        <Grid item xs={12} sm={6} md={4} key={store.id}>
                           <Paper
			 onClick={store.status==='open' ? () => handleStoreClick(store._id) : null}
			    sx={{ cursor: isOpen ? 'pointer' : 'default' }}
			>
    <Box
        sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
        }}
    >
        {/* Image Cell */}
        <Box sx={{ mr: 2 }}>
            <img
                src={`path/to/store/images/${store.id}.jpg`}
                alt={'image'}
                style={{ width: 60, height: 60, borderRadius: '50%' }}
            />
        </Box>
        
        {/* Store Info Cell */}
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">{store.name}</Typography>
            {/* Star Rating below Store Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {/* Example: Star rating (5 stars) */}
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ color: star <= store.rating ? '#FFD700' : '#ccc' }}>
                        ★
                    </span>
                ))}
            </Box>
        </Box>
        
        {/* Shop Now Button */}
        <Button
            variant="contained"
            color="primary"
            onClick={store.status==='open' ? () => handleStoreClick(store._id) : null}
            sx={{ padding: '4px 8px', fontSize: '0.75rem' , width:'25%'}} // Smaller button
            disabled={store.status==='close'}
        >
            {store.status==='open' ? 'Shop Now' : 'Closed'}
        </Button>
    </Box>
</Paper>

                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Stores;

