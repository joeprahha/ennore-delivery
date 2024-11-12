import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api'; // Ensure correct path to your API utility
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, CircularProgress, Typography, Paper, FormControl, InputLabel } from '@mui/material';

const Orders = () => {
    const [orders, setOrders] = useState([]); // State to store orders
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isUpdating, setIsUpdating] = useState(false); // State to track update status

    const statuses = ['new', 'accepted', 'ready', 'delivered', 'canceled']; // Order statuses

    // Fetch orders from the API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders'); // Adjust to your actual orders endpoint
                setOrders(response.data); // Assuming the response contains the orders
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders');
                setLoading(false);
            }
        };

        fetchOrders(); // Fetch orders when component mounts
    }, []);

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

    return (
        <Box sx={{ padding: 2 }}>
        
              
                
                
                 <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Table>
                   <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell sx={{ height: 30 }}>{order.id}</TableCell>
                                    <TableCell sx={{ height: 30 }}>{order.createduser}</TableCell>
                                   <TableCell sx={{ height: 30 }}>
                                    <FormControl fullWidth variant="outlined" size="small" sx={{ height: 20 }}>
                                        <Select
                                            value={order.status || ''} // Default to the current status
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={isUpdating} // Disable dropdown during update
                                          sx={{ height: 20, display: 'flex', alignItems: 'center', fontSize: '0.65rem' }}
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

        </Box>
    );
};

export default Orders;

