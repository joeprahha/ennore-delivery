import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Tabs,
    Tab,
    Grid,
    Typography,
    Paper,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isTokenValid, logout } from '../utils/auth';

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
                const response = await axios.get('http://localhost:5000/ennore-delivery/stores');
                console.log(response.data)
                setStores([
    {
        "name": "Elshadai",
        "id": 1,
        "open_time": "00:00:00",
        "close_time": "23:59:00",
        "status": "open",
        "category": "groceries"
    },
    {
        "name": "Test",
        "id": 2,
        "open_time": "00:00:00",
        "close_time": "23:59:00",
        "status": "open",
        "category": "groceries"
    },
    {
        "name": "Fresh Bakery",
        "id": 3,
        "open_time": "06:00:00",
        "close_time": "20:00:00",
        "status": "open",
        "category": "groceries"
    },
    {
        "name": "Dairy Delight",
        "id": 4,
        "open_time": "08:00:00",
        "close_time": "18:00:00",
        "status": "closed",
        "category": "groceries"
    },
    {
        "name": "Meat World",
        "id": 5,
        "open_time": "09:00:00",
        "close_time": "21:00:00",
        "status": "open",
        "category": "groceries"
    },
    {
        "name": "Eggcellent",
        "id": 6,
        "open_time": "05:00:00",
        "close_time": "19:00:00",
        "status": "open",
        "category": "groceries"
    },
    {
        "name": "Citrus Haven",
        "id": 7,
        "open_time": "07:00:00",
        "close_time": "22:00:00",
        "status": "closed",
        "category": "groceries"
    },
    {
        "name": "Green Grocer",
        "id": 8,
        "open_time": "06:00:00",
        "close_time": "18:30:00",
        "status": "open",
        "category": "groceries"
    },
    {
        "name": "Global Foods",
        "id": 9,
        "open_time": "09:00:00",
        "close_time": "21:30:00",
        "status": "closed",
        "category": "groceries"
    },
    {
        "name": "Sweet Tooth",
        "id": 10,
        "open_time": "10:00:00",
        "close_time": "23:00:00",
        "status": "open",
        "category": "groceries"
    }
]
);
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        };

        fetchStores();
    }, []);

    useEffect(() => {
        const newFilteredStores = stores.filter((store) => {
            const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
            if(searchQuery){
			return matchesSearch}
            else
           { const isGroceries = activeTab === 0 && store.category === 'groceries';
            const isRestaurants = activeTab === 1 && store.category === 'restaurant';

            return (
                (isGroceries || isRestaurants) &&
                matchesSearch
            );}
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
                    backgroundColor: '#fff',  // Keep background to avoid overlapping content
                    pb: 2,
                }}
            >
                <TextField
                    label="Search stores"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
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
                    const isOpen = store.open_time <= currentTimeString && store.close_time >= currentTimeString;

                    return (
                        <Grid item xs={12} sm={6} md={4} key={store.id}>
                            <Paper
                                onClick={isOpen ? () => handleStoreClick(store.id) : null} // Make it clickable only if open
                                sx={{ 
                                    p: 2, 
                                    cursor: isOpen ? 'pointer' : 'default', 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    backgroundColor: isOpen ? 'white' : 'rgba(0, 0, 0, 0.2)', // Light black for closed stores
                                }}
                            >
                                <Box sx={{ mr: 2 }}>
                                    <img 
                                        src={`path/to/store/images/${store.id}.jpg`} 
                                        alt={store.name}
                                        style={{ width: 60, height: 60, borderRadius: '50%' }} 
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="h6">{store.name}</Typography>
                                    {isOpen ? (
                                        <Typography variant="body2" color="green">Open</Typography>
                                    ) : (
                                        <Typography variant="body2" color="red">
                                            Closed. Opens at {store.open_time}
                                        </Typography>
                                    )}
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

