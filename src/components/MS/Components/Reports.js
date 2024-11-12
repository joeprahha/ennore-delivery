import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api'; // Make sure the path to your API utility
import { Box, Paper, Typography, Button, CircularProgress, Grid, Collapse } from '@mui/material';

const Report = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedStore, setExpandedStore] = useState(null); // Track expanded store
    const [fromDate, setFromDate] = useState(''); // From date
    const [toDate, setToDate] = useState(''); // To date

    // Fetch orders from the API with date range filter
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders', {
                    params: { from: fromDate, to: toDate }, // Passing from and to date to filter
                });
                setOrders(response.data); // Assuming the response contains the orders
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders');
                setLoading(false);
            }
        };

        if (fromDate && toDate) {
            fetchOrders();
        }
    }, [fromDate, toDate]); // Fetch data whenever the date range changes

    // Group orders by storeId
    const groupedOrders = orders.reduce((acc, order) => {
        const storeId = order.storeId.$oid; // Extract storeId
        if (!acc[storeId]) {
            acc[storeId] = {
                storeName: order.storename,
                totalCost: 0,
                orderCount: 0,
                orders: [],
            };
        }
        acc[storeId].orders.push(order);
        acc[storeId].orderCount += 1;
        acc[storeId].totalCost += order.total.$numberDouble; // Add the subtotal for each order

        return acc;
    }, {});

    const handleExpandStore = (storeId) => {
        setExpandedStore((prev) => (prev === storeId ? null : storeId)); // Toggle the expanded store
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
            <Typography variant="h5" gutterBottom>
                Reports
            </Typography>

            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">Filter by Date</Typography>
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </Box>

            {/* Grouped orders by store */}
            {Object.keys(groupedOrders).map((storeId) => {
                const store = groupedOrders[storeId];
                return (
                    <Paper key={storeId} sx={{ marginBottom: 2, padding: 2 }}>
                        <Button
                            onClick={() => handleExpandStore(storeId)}
                            variant="outlined"
                            fullWidth
                            sx={{ textAlign: 'left' }}
                        >
                            <Typography variant="h6">{store.storeName}</Typography>
                        </Button>

                        <Collapse in={expandedStore === storeId}>
                            <Box sx={{ paddingTop: 2 }}>
                                <Typography variant="body1">
                                    Total Orders: {store.orderCount}
                                </Typography>
                                <Typography variant="body1">
                                    Total Cost: ${store.totalCost.toFixed(2)}
                                </Typography>

                                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                    {store.orders.map((order, index) => (
                                        <Grid item xs={12} md={6} key={order._id.$oid + index}>
                                            <Paper sx={{ padding: 2 }}>
                                                <Typography variant="body2">Order ID: {order._id.$oid}</Typography>
                                                <Typography variant="body2">
                                                    Created By: {order.createduser}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Status: {order.status}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Subtotal: ${order.total.$numberDouble}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Collapse>
                    </Paper>
                );
            })}
        </Box>
    );
};

export default Report;

