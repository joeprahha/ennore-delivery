// src/components/UserPage.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Button,
  Box,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, ShoppingCart as CartIcon, AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('restaurants');

  // Sample data for stores
  const stores = {
    restaurants: [
      { name: 'Pizza Place', id: 1 },
      { name: 'Sushi Spot', id: 2 },
    ],
    groceries: [
      { name: 'Local Grocery', id: 3 },
      { name: 'Fresh Mart', id: 4 },
    ],
    medicines: [
      { name: 'City Pharmacy', id: 5 },
      { name: 'Health Store', id: 6 },
    ],
  };

  const navigate = useNavigate();

  const handleStoreClick = (storeId) => {
    navigate(`/store/${storeId}`);
  };

  return (
    <div>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Dashboard
          </Typography>
          <IconButton color="inherit">
            <CartIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Search Bar */}
      <Box sx={{ padding: 2 }}>
        <InputBase
          sx={{ border: '1px solid #ccc', borderRadius: 1, padding: '8px', width: '100%' }}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Categories */}
      <Box sx={{ padding: 2 }}>
        <Button variant={selectedCategory === 'restaurants' ? 'contained' : 'outlined'} onClick={() => setSelectedCategory('restaurants')}>
          Restaurants
        </Button>
        <Button variant={selectedCategory === 'groceries' ? 'contained' : 'outlined'} onClick={() => setSelectedCategory('groceries')}>
          Groceries
        </Button>
        <Button variant={selectedCategory === 'medicines' ? 'contained' : 'outlined'} onClick={() => setSelectedCategory('medicines')}>
          Medicines
        </Button>
      </Box>

      <Divider />

      {/* List of Stores */}
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Stores in {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</Typography>
        <Grid container spacing={2}>
          {stores[selectedCategory].map(store => (
            <Grid item xs={12} sm={6} md={4} key={store.id}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" onClick={() => handleStoreClick(store.id)} style={{ cursor: 'pointer' }}>
                  {store.name}
                </Typography>
                <Button variant="contained" color="primary">View Details</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default UserPage;
