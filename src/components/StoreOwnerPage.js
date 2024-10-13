// src/components/StoreOwnerPage.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Modal,
  InputBase,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Menu as MenuIcon, ShoppingCart as CartIcon, AccountCircle } from '@mui/icons-material';

const StoreOwnerPage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '' });
  const [menuItems, setMenuItems] = useState([]);
  const [openAddItemModal, setOpenAddItemModal] = useState(false);

  // Sample order data
  const orders = [
    { id: 1, price: 20.99, status: 'new', address: '123 Main St' },
    { id: 2, price: 15.49, status: 'accepted', address: '456 Elm St' },
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleAddItem = () => {
    setMenuItems([...menuItems, newItem]);
    setNewItem({ name: '', price: '', category: '' });
    setOpenAddItemModal(false);
  };

  return (
    <div>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Store Owner Dashboard
          </Typography>
          <IconButton color="inherit">
            <CartIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Tabs for Orders and Menu */}
      <Box sx={{ padding: 2 }}>
        <Button
          variant={activeTab === 'orders' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('orders')}
          sx={{
            backgroundColor: activeTab === 'orders' ? '#4CAF50' : 'transparent',
            color: activeTab === 'orders' ? 'white' : '#4CAF50',
            '&:hover': { backgroundColor: '#388E3C' },
          }}
        >
          Orders
        </Button>
        <Button
          variant={activeTab === 'menu' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('menu')}
          sx={{
            backgroundColor: activeTab === 'menu' ? '#4CAF50' : 'transparent',
            color: activeTab === 'menu' ? 'white' : '#4CAF50',
            '&:hover': { backgroundColor: '#388E3C' },
          }}
        >
          Menu
        </Button>
      </Box>

      <Divider />

      {/* Display Orders or Menu */}
      <Box sx={{ padding: 2 }}>
        {activeTab === 'orders' ? (
          <div>
            <Typography variant="h6">Orders</Typography>
            <List>
              {orders.map(order => (
                <ListItem button key={order.id} onClick={() => handleOrderClick(order)}>
                  <ListItemText primary={`Order #${order.id} - $${order.price}`} />
                </ListItem>
              ))}
            </List>

            {/* Order Details Modal */}
            {selectedOrder && (
              <Modal
                open={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                aria-labelledby="order-details-title"
                aria-describedby="order-details-description"
              >
                <Box sx={{ padding: 2, bgcolor: 'white', margin: 'auto', width: '400px', marginTop: '100px' }}>
                  <Typography id="order-details-title" variant="h6" component="h2">
                    Order #{selectedOrder.id}
                  </Typography>
                  <Typography>
                    Delivery Address: {selectedOrder.address}
                  </Typography>
                  <Typography>
                    Status: {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Typography>
                  <Button onClick={() => setSelectedOrder(null)}>Close</Button>
                </Box>
              </Modal>
            )}
          </div>
        ) : (
          <div>
            <Typography variant="h6">Menu</Typography>
            <Button variant="contained" onClick={() => setOpenAddItemModal(true)}>Add New Item</Button>
            <Box sx={{ marginTop: 2 }}>
              {menuItems.length === 0 ? (
                <Typography>No items in the menu</Typography>
              ) : (
                <Grid container spacing={2}>
                  {menuItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography>Price: ${item.price}</Typography>
                        <Typography>Category: {item.category}</Typography>
                        <Button variant="contained" color="primary">Edit</Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>

            {/* Add Item Modal */}
            <Modal
              open={openAddItemModal}
              onClose={() => setOpenAddItemModal(false)}
              aria-labelledby="add-item-title"
              aria-describedby="add-item-description"
            >
              <Box sx={{ padding: 2, bgcolor: 'white', margin: 'auto', width: '400px', marginTop: '100px' }}>
                <Typography id="add-item-title" variant="h6" component="h2">
                  Add New Menu Item
                </Typography>
                <InputBase
                  sx={{ border: '1px solid #ccc', borderRadius: 1, padding: '8px', width: '100%', marginTop: 1 }}
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <InputBase
                  sx={{ border: '1px solid #ccc', borderRadius: 1, padding: '8px', width: '100%', marginTop: 1 }}
                  placeholder="Price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
                <InputBase
                  sx={{ border: '1px solid #ccc', borderRadius: 1, padding: '8px', width: '100%', marginTop: 1 }}
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                />
                <Button variant="contained" onClick={handleAddItem} sx={{ marginTop: 2 }}>
                  Add Item
                </Button>
                <Button onClick={() => setOpenAddItemModal(false)} sx={{ marginTop: 2, marginLeft: 1 }}>
                  Cancel
                </Button>
              </Box>
            </Modal>
          </div>
        )}
      </Box>
    </div>
  );
};

export default StoreOwnerPage;
