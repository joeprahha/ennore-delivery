import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Paper,
    Stepper, Step, StepLabel, TextField, AccordionActions, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { baseUrl ,api} from '../utils/api';
import {decodeToken} from '../utils/auth'

// Status steps for order progress
const steps = ['Placed', 'Accepted', 'Driver Picked', 'Delivered'];

const OrderHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTime] = useState(new Date());

    useEffect(() => {
        // Fetch order history data from API
        const fetchOrders = async () => {
            try {
                const response = await api(`orderhistory/${decodeToken().id}`);
                const data = await response.json();
                setOrders(data);
                filterRecentOrders(data); // Filter orders within the last 10 days
            } catch (error) {
                console.error('Failed to fetch order history:', error);
            }
        };

        fetchOrders();
    }, [userId]);

    // Function to filter orders from the past 10 days
    const filterRecentOrders = (data) => {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(currentTime.getDate() - 10);

        const filtered = data.filter(order => new Date(order.created_at) >= tenDaysAgo);
        setFilteredOrders(filtered);
    };

    // Function to map order status to step index
    const getStatusIndex = (status) => {
        switch (status) {
            case 'new':
                return 0;
            case 'accepted':
                return 1;
            case 'ready':
                return 2;
            case 'delivered':
                return 3;
            default:
                return 0;
        }
    };

    // Function to handle reordering (can be implemented further as needed)
    const handleReorder = (orderId) => {
        console.log(`Reordering order: ${orderId}`);
        // Add your reorder logic here
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Page Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    position: 'sticky',
                    top: 64,
                    zIndex: 1000,
                    backgroundColor: '#fff',
                }}
            >
                <Typography variant="h5">Orders</Typography>
                <Typography variant="body2" color="textSecondary">
                    Showing orders from the past 10 days
                </Typography>
            </Box>

            {/* Search bar */}
            <TextField
                label="Search orders"
                variant="outlined"
                fullWidth
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* Order list */}
            <Grid container spacing={2}>
                {filteredOrders
                    .filter(order =>
                        order.storename.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((order) => (
                        <Grid item xs={12} key={order.id}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`order-content-${order.id}`}
                                    id={`order-header-${order.id}`}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="subtitle1">
                                            Order ID: {order.id} - {order.storename}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Total: ${order.total.toFixed(2)}
                                        </Typography>
                                        {/* Status Stepper */}
                                        <Stepper activeStep={getStatusIndex(order.status)} alternativeLabel>
                                            {steps.map((label) => (
                                                <Step key={label}>
                                                    <StepLabel>{label}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                </AccordionSummary>

                                <AccordionDetails>
                                    {/* Display order items */}
                                    {order.items.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">{item.name}</Typography>
                                            <Typography variant="body2">
                                                {item.count} x ${item.price.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    ))}

                                    {/* Display delivery fee and donation */}
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            Delivery Fee: ${order.delivery_fee.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2">
                                            Donation: ${order.donation.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </AccordionDetails>

                                <AccordionActions>
                                    <Button variant="contained" size="small" color="primary" onClick={() => handleReorder(order.id)}>
                                        Reorder
                                    </Button>
                                </AccordionActions>
                            </Accordion>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
};

export default OrderHistory;

