import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Paper,
    Stepper, Step, StepLabel, TextField, AccordionActions, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { baseUrl ,api} from '../utils/api';
import {decodeToken} from '../utils/auth'
import { useNavigate } from 'react-router-dom';
import BikeLoader from '../loader/BikeLoader';


// Status steps for order progress
const steps = ['Placed', 'Accepted','Ready','Driver Picked', 'Delivered'];
const collectionSteps= ['Placed', 'Accepted','Ready'];

const OrderHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTime] = useState(new Date());
    const [loading,setLoading]=useState(true)
    const navigate= useNavigate()
    
     const [expandedAccordion, setExpandedAccordion] = useState(0); // Track the currently expanded accordion

    const handleAccordionChange = (index) => {
        setExpandedAccordion(prev => (prev === index ? -1 : index)); // Toggle accordion state between open/closed
    };

   const fetchOrders = async () => {
            try {
                const response = await api.get(`orders/${decodeToken().id}`);
		
                setOrders(response.data);
                filterRecentOrders(response.data); // Filter orders within the last 10 days
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch order history:', error);
            }
        };
    useEffect(() => {
        // Fetch order history data from API
     

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

           
            {/* Order list */}
         
         <Grid container spacing={2}>
            {loading ? (
                <BikeLoader/>
            ) : filteredOrders.length === 0 ? (
                // Show "No orders" and "Click here to order" button when there are no orders
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Box textAlign="center">
                        <Typography variant="h6" gutterBottom>No orders</Typography>
                        <Button variant="contained" color="primary" onClick={() => navigate('/stores')}>
                            Click here to order
                        </Button>
                    </Box>
                </Grid>
            ) : (
                // Show orders when they exist
                filteredOrders
                    .filter(order =>
                        order.storename.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((order, index) => (
                        <Grid item xs={12} key={order.id}>
                            <Accordion expanded={expandedAccordion === index} onChange={() => handleAccordionChange(index)}>
                                <AccordionSummary
                                    aria-controls={`order-content-${order.id}`}
                                    id={`order-header-${order.id}`}
                                >
                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="subtitle1">
                                            Order #{order._id.slice(-4)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" style={{ paddingBottom: '5px', marginLeft: 'auto' }}>
                                            Rs. {order.total}
                                        </Typography>

                                        {/* Conditionally show the "Where is my order?" button or the expand arrow */}
                                        {expandedAccordion === index ? <></> :(
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                sx={{ marginLeft: 'auto' }} 
                                                onClick={() => {order.status!=='delivered' && fetchOrders()} }
                                            >
                                                more
                                            </Button>
                                        )}
                                    </Box>
                                </AccordionSummary>

                                <AccordionDetails>
                                    {/* Display order items */}
                                    <Typography variant="subtitle1" sx={{mb:2}}>
                                           Store : {order.storename}
                                        </Typography>
                                    {JSON.parse(order.items).map((item, itemIndex) => (
                                        <Box key={itemIndex} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">{item.name}</Typography>
                                            <Typography variant="body2">
                                                {item.count} x ${item.price}
                                            </Typography>
                                        </Box>
                                    ))}

                                    {/* Display delivery fee and donation */}
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            Delivery Fee: ${order.delivery_fee}
                                        </Typography>
                                        <Typography variant="body2">
                                            Donation: ${order.donation}
                                        </Typography>
                                    </Box>
                                </AccordionDetails>
				<Typography variant="body2" sx={{m:2}}>
				{order.orderType==='collection' ?'if status is ready , please collect from store':''}
				 </Typography>
                                {/* Order status stepper */}
                                <Stepper activeStep={getStatusIndex(order.status)} sx={{mb:3}} alternativeLabel>
                                    {(order.orderType === 'collection' ? collectionSteps:steps).map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Accordion>
                        </Grid>
                    ))
            )}
        </Grid>

        </Box>
    );
};

export default OrderHistory;

