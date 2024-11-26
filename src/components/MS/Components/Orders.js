import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api'; // Ensure correct path to your API utility
import { Box, Table, TableBody, TableCell, TableContainer, TableHead,
Grid,TextField,Button,
 TableRow, Select, MenuItem, CircularProgress, Typography, Paper, FormControl, InputLabel,SwipeableDrawer } from '@mui/material';

const today = new Date().toISOString().split('T')[0];
const Orders = () => {
    const [orders, setOrders] = useState([]); // State to store orders
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isUpdating, setIsUpdating] = useState(false); // State to track update status
 const [from, setFrom] = useState(today); // Default to today
    const [to, setTo] = useState(today); // Default to today
const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);


    const statuses = ['new', 'accepted', 'ready', 'delivered', 'canceled']; // Order statuses
 const fetchOrders = async () => {
            try {
                const response = await api.get(`/orders?from=${from}&to=${to}`); // Adjust to your actual orders endpoint
                setOrders(response.data); // Assuming the response contains the orders
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders');
                setLoading(false);
            }
        };
    // Fetch orders from the API
    useEffect(() => {
       

        fetchOrders(); // Fetch orders when component mounts
    }, []);
const groupByStore = (orders) => {
    return orders.reduce((grouped, order) => {
      const store = order.storename;
      if (!grouped[store]) grouped[store] = [];
      grouped[store].push(order);
      return grouped;
    }, {});
  };
    const groupedOrders = groupByStore(orders);


    const handleStatusChange = async (orderId, newStatus) => {
   
        setIsUpdating(true);
        try {
            // Update the order status by making a PUT request to the backend
            await api.put(`/orders/${orderId}/status`, { status: newStatus }); // The URL will be /orders/:orderId/status

            // Update the orders state to reflect the updated status locally
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            setIsUpdating(false);
        } catch (error) {
            setError('Failed to update order status');
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }
    const handleRowClick = (order) => {
    const a=order
    a.items= JSON.parse(order?.items||'{}')
    setSelectedOrder(a); // Set the selected order
    
    setDrawerOpen(true); // Open the drawer
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false); // Close the drawer
    setSelectedOrder(null); // Clear the selected order
  };

    return (
        <Box sx={{ padding: 2 }}>
        
               <Grid container alignItems="center" spacing={1}>
    {/* From Date */}
    <Grid item>
        <TextField
            type="date"
            label="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
        />
    </Grid>

    {/* To Date */}
    <Grid item>
        <TextField
            type="date"
            label="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
        />
    </Grid>

    {/* Get Button */}
    <Grid item>
        <Button
            variant="contained"
            color="primary"
            onClick={() => fetchOrders()}
            size="medium"
        >
            Go
        </Button>
    </Grid>
     <Grid item>

    </Grid>
</Grid>
                 <div>
      {Object.entries(groupedOrders).map(([storename, storeOrders]) => (
        <div key={storename}>
          {/* Store Heading */}
          <h2>{storename}</h2>

          {/* Orders Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>

                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {storeOrders.map((order) => (
                  <TableRow key={order._id} >
                    <TableCell onClick={(e)=>handleRowClick(order)}>{order._id}</TableCell>

                    <TableCell>
                      <FormControl fullWidth variant="outlined" size="small">
                        <Select
                          value={order.status || ""}
onChange={(e) => {
          e.stopPropagation(); // Prevent triggering the row click event
          handleStatusChange(order._id, e.target.value); // Update status
        }}
                          disabled={isUpdating}
                          sx={{ height: 40, fontSize: "0.85rem" }}
                        >
                          {statuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </div>
              <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
        onOpen={() => {}}
      >
        <Box sx={{ p: 2, maxHeight: "auto", overflowY: "auto" }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <pre style={{ fontSize: "0.9rem", wordWrap: "break-word" }}>
            {
            
            JSON.stringify(selectedOrder, null, 2)}
          </pre>
        </Box>
      </SwipeableDrawer>  
                 

        </Box>
    );
};

export default Orders;

