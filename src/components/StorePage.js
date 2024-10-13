// src/components/StorePage.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import { Menu as MenuIcon, ShoppingCart as CartIcon, AccountCircle } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const StorePage = () => {
  const { storeId } = useParams(); // Get the store ID from the route parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('items');

  // Sample data for items
  const categories = ['Items', 'Deals', 'New Arrivals'];
  const items = [
    { name: 'Pizza', id: 1, category: 'items' },
    { name: 'Sushi', id: 2, category: 'items' },
    { name: 'Fresh Apples', id: 3, category: 'deals' },
    { name: 'New Pizza Flavor', id: 4, category: 'new arrivals' },
  ];

  const filteredItems = items.filter(item => 
    item.category === selectedCategory && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User/Store/{storeId}
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
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Categories */}
      <Box sx={{ padding: 2, display: 'flex', overflowX: 'auto' }}>
        {categories.map(category => (
          <Button 
            key={category} 
            variant={selectedCategory === category.toLowerCase() ? 'contained' : 'outlined'} 
            onClick={() => setSelectedCategory(category.toLowerCase())}
            sx={{ marginRight: 1 }}
          >
            {category}
          </Button>
        ))}
      </Box>

      <Divider />

      {/* List of Items */}
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Items in {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</Typography>
        <Grid container spacing={2}>
          {filteredItems.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Button variant="contained" color="primary">Add to Cart</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default StorePage;
