// src/components/Deliveries.js
import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Tabs,
    Tab,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Typography,
    SwipeableDrawer,
    IconButton,Paper,Divider,ButtonStepper,Step,StepLabel,Stepper,Button
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import axios from 'axios';
import { api } from '../../utils/api';
import { getUserInfo,setUserInfo } from '../../utils/localStorage';

const steps = ['Placed', 'Accepted', 'Ready', 'Driver Picked', 'Delivered'];
const collectionSteps = ['Placed', 'Accepted', 'Ready'];
 const getStatusIndex = (status) => {
        switch (status) {
            case 'new': return 0;
            case 'accepted': return 1;
            case 'ready': return 2;
             case 'picked': return 3;
            
            case 'delivered': return 4;
            default: return 0;
        }
    };
   const DriverStatus={ready:"Picked",picked:"Delivered",}
    
const Deliveries = () => {
    const [value, setValue] = useState(0); // Track the active tab
    const [newOrders, setNewOrders] = useState([]);
    const [assignedOrders, setAssignedOrders] = useState([]); // Added state for assigned orders
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loadingNew, setLoadingNew] = useState(false);
    const [loadingAssigned, setLoadingAssigned] = useState(false); // Loading state for assigned orders
    const [loadingCompleted, setLoadingCompleted] = useState(false);
    const [error, setError] = useState(null); // For error handling
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
let a=selectedOrder?.deliver_by ? (DriverStatus[selectedOrder?.status] ||  selectedOrder?.deliver_by) : "Assign to Me"
console.log("a",selectedOrder )
    // Fetch new orders
    const fetchNewOrders = async () => {
        try {
            setLoadingNew(true);
            const response = await api.get('/orders');
            setNewOrders(response.data);
            setError(null); // Clear any previous error on success
        } catch (error) {
            setError('Error fetching new orders');
            console.error('Error fetching new orders:', error);
        } finally {
            setLoadingNew(false);
        }
    };

   

    // Fetch completed orders
    const fetchCompletedOrders = async () => {
        try {
            setLoadingCompleted(true);
            const response = await api.get(`/delivery-partner/${getUserInfo()._id}/orders`);
            setCompletedOrders(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching completed orders');
            console.error('Error fetching completed orders:', error);
        } finally {
            setLoadingCompleted(false);
        }
    };


const assignToMe = async () => {
    try {
        const deliveryPartnerId = getUserInfo()._id;
        const name = getUserInfo().name;

        if (!selectedOrder?.deliver_by && DriverStatus[selectedOrder.status]) {
            // Update the delivery partner
            const response = await api.put(`/orders/${selectedOrder._id}/delivery-partner`, {
                deliveryPartnerId,
                name
            });
            setNewOrders(response.data);

        } else {
            // Update the order status
            const newStatus = DriverStatus[selectedOrder.status].toLowerCase();
            await api.put(`/orders/${selectedOrder._id}/status`, { status: newStatus });
                        fetchNewOrders();
        }
                    setDrawerOpen(false);
    } catch (error) {
        setError('Assign failed');
        console.error('Error assigning order:', error);
    }
};


    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            fetchNewOrders();
        } else if (newValue === 1) {
            fetchNewOrders();
        } else {
            fetchCompletedOrders();
        }
    };

    const handleRowClick = (order) => {

        setSelectedOrder(order);
        setDrawerOpen(true);
    };

    useEffect(() => {
        // Fetch new orders by default when the component mounts
        fetchNewOrders();
    }, []);

    return (
        <Box>
            <Tabs sx={{ mt: 2 }} value={value} onChange={handleTabChange} indicatorColor="primary" textColor="inherit" centered>
                <Tab label="New" />
                <Tab label="Assigned to Me" />
                <Tab label="Completed" />
            </Tabs>

            <Box sx={{ padding: 2 }}>
                {/* Error message */}
                {error && (
                    <Typography variant="body1" color="error" align="center">
                        {error}
                    </Typography>
                )}

                {/* New Orders Tab */}
                {value === 0 && (
                    loadingNew ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer sx={{ maxHeight: 400, overflowX: 'auto' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>

                                        <TableCell>Customer Name</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {newOrders.length > 0 ? (
                                         newOrders.filter(order => !order?.deliver_by).map((order) => (
                                            <TableRow key={order._id} onClick={() => handleRowClick(order)}>

                                                <TableCell>{order.createduser}</TableCell>
                                                <TableCell>{order.total}</TableCell>
                                                <TableCell>{order.status}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No new orders available.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
                )}

                {/* Assigned Orders Tab */}
                {value === 1 && (
                    loadingAssigned ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer sx={{ maxHeight: 400, overflowX: 'auto' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>

                                        <TableCell>Customer Name</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {newOrders.length > 0 ? (
                                        newOrders.filter(order => order?.deliver_by===getUserInfo().name && order.status!=="delivered").map((order) => (
                                            <TableRow key={order.id} onClick={() => handleRowClick(order)}>

                                                <TableCell>{order.createduser}</TableCell>
                                                <TableCell>{order.total}</TableCell>
                                                <TableCell>{order.status}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No orders assigned to you.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
                )}

                {/* Completed Orders Tab */}
                {value === 2 && (
                    loadingCompleted ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer sx={{ maxHeight: 400, overflowX: 'auto' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>

                                        <TableCell>Customer Name</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {completedOrders.length > 0 ? (
                                        completedOrders.filter(co=>co.status==="delivered").map((order) => (
                                            <TableRow key={order.id} onClick={() => handleRowClick(order)}>

                                                <TableCell>{order.createduser}</TableCell>
                                                <TableCell>{order.total}</TableCell>
                                                <TableCell>{order.status}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No completed orders available.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
                )}
            </Box>

            {/* Swipeable Drawer for Order Details */}
          <SwipeableDrawer
    anchor="bottom"
    open={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    onOpen={() => setDrawerOpen(true)}
    sx={{
        '& .MuiDrawer-paper': {
            height: '90%',
            bottom: 0,
            borderRadius: '16px 16px 0 0',
            overflowY: 'auto',
        },
    }}
>
  <Box
    sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    }}
>
<IconButton onClick={() => setDrawerOpen(false)}>
        <KeyboardArrowDownOutlinedIcon />
    </IconButton>
    <Typography variant="h6" sx={{ fontSize: '1rem' }}>Order Details</Typography>

{ selectedOrder?.status!=='delivered'? 
<Button
                onClick={assignToMe}
                sx={{
                    backgroundColor: DriverStatus[selectedOrder?.status] ? 'red' :  selectedOrder?.deliver_by ? 'inherit' : 'red',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#c62828',
                    },
                }}
                disabled={!DriverStatus[selectedOrder?.status]}
            >
                { selectedOrder?.deliver_by ? (DriverStatus[selectedOrder?.status] ||  selectedOrder?.deliver_by) : "Assign to Me"}
            </Button>
 :  <Button sx={{backgroundColor:'green'}}>Delivered</Button> }
    
</Box>

{selectedOrder && (
    <Box sx={{ padding: 2 }}>
    
    	<Stepper activeStep={getStatusIndex(selectedOrder?.status)} sx={{ mb: 2 }} alternativeLabel>
                                        {(selectedOrder?.orderType === 'collection' ? collectionSteps : steps).map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
        {/* Order Summary */}
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <Typography variant="body1" sx={{ fontSize: '0.75rem' }}>
                    <strong>Order ID:</strong> {selectedOrder._id}
                </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <Typography variant="body1" sx={{ fontSize: '0.75rem' }}>
                    <strong>Placed Time:</strong> {new Date(selectedOrder.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                    <strong>Total:</strong> ₹{selectedOrder.total}
                </Typography>
            </Box>
        </Paper>

        {/* Customer Details */}
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '0.75rem' }}>Customer Details</Typography>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <Typography variant="body1" sx={{ fontSize: '0.75rem' }}>
                    <strong>Name:</strong> {selectedOrder.customer_details.name}
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <Typography variant="body1" sx={{ fontSize: '0.75rem' }}>
                    <strong>Phone:</strong> {selectedOrder.customer_details.phone}
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <Typography variant="body1" sx={{ fontSize: '0.75rem' }}>
                    <strong>Address:</strong> {selectedOrder.customer_details.address?.address1}, {selectedOrder.customer_details.address?.local}
                </Typography>
            </Box>
        </Paper>

        {/* Store Details */}
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '0.75rem' }}>Store Details</Typography>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <Typography variant="body1" sx={{ fontSize: '0.75rem' }}>
                    <strong>Store Name:</strong> {selectedOrder.storename}
                </Typography>
            </Box>
            <Divider />
            

        </Paper>

        {/* Items */}
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '0.75rem' }}>Items</Typography>
            {JSON.parse(selectedOrder.items).map((item) => (
                <>
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
                        <img src={item.image} alt={item.name} style={{ width: 50, height: 50, marginRight: 10 }} />
                        <Box>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                <strong>{item.name}</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                Price: ₹{item.price}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }} color={item.available ? 'green' : 'red'}>
                                {item.available ? 'Available' : 'Not Available'}
                            </Typography>
                        </Box>
                    </Box>
                    <Divider />
                </>
            ))}
        </Paper>
    </Box>
    )}
</SwipeableDrawer>

        </Box>
    );
};

export default Deliveries;

