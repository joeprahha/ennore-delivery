// src/components/Deliveries.js
import React, { useEffect, useState } from 'react';
import { AppBar, Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import axios from 'axios';

const Deliveries = () => {
    const [value, setValue] = useState(0);
    const [newOrders, setNewOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loadingNew, setLoadingNew] = useState(false);
    const [loadingCompleted, setLoadingCompleted] = useState(false);

    const fetchNewOrders = async () => {
        try {
            setLoadingNew(true);
            const response = await axios.get('/api/deliveries/new');
            setNewOrders(response.data);
        } catch (error) {
            console.error('Error fetching new orders:', error);
        } finally {
            setLoadingNew(false);
        }
    };

    const fetchCompletedOrders = async () => {
        try {
            setLoadingCompleted(true);
            const response = await axios.get('/api/deliveries/completed');
            setCompletedOrders(response.data);
        } catch (error) {
            console.error('Error fetching completed orders:', error);
        } finally {
            setLoadingCompleted(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            fetchNewOrders();
        } else {
            fetchCompletedOrders();
        }
    };

    return (
        <Box>
            <AppBar position="static">
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="New" />
                    <Tab label="Completed" />
                </Tabs>
            </AppBar>
            <Box p={2}>
                {value === 0 && (loadingNew ? <CircularProgress /> : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {newOrders.length > 0 ? newOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.createduser}</TableCell>
                                        <TableCell>{order.total}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No new orders available.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ))}
                {value === 1 && (loadingCompleted ? <CircularProgress /> : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {completedOrders.length > 0 ? completedOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.createduser}</TableCell>
                                        <TableCell>{order.total}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No completed orders available.</TableCell>

                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ))}
            </Box>
        </Box>
    );
};

export default Deliveries;

