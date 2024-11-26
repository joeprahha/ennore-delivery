import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    TableContainer,
    TableRow,
    Table,
    TableCell,
    TableBody,
    CircularProgress,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { decodeToken,getToken } from '../../utils/auth';

import { api } from '../../utils/api';
import { getUserInfo } from '../../utils/localStorage';


const today = new Date().toISOString().split('T')[0];
const Reports = ({selectedStore}) => {
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [deliveryFees, setDeliveryFees] = useState(0);

    const [orders, setOrders] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stores, setStores] = useState([]); // To store the list of stores

    const [storeModalOpen, setStoreModalOpen] = useState(false); // For store modal




 
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                `mystore/${selectedStore}/orders?from=${startDate}&to=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );
            const orders = response.data;
            setOrders(orders);

            if (orders.length) {
                setTotalOrders(orders.length);
                setTotalAmount(
                    orders.reduce(
                        (sum, order) => sum + (order.total - order.donation - order.delivery_fee),
                        0
                    )
                );
                setDeliveryFees(orders.length * 7.5); 
                setChartData(getChartData(orders));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getChartData = (orders) => {
        const groupedData = {};
        orders.forEach((order) => {
            const date = new Date(order.created_at).toLocaleDateString();
            if (!groupedData[date]) {
                groupedData[date] = { orderCount: 0, totalAmount: 0 };
            }
            groupedData[date].orderCount += 1;
            groupedData[date].totalAmount += order.total - order.donation - order.delivery_fee;
        });

        return Object.keys(groupedData).map((date) => ({
            date,
            orderCount: groupedData[date].orderCount,
            totalAmount: groupedData[date].totalAmount
        }));
    };

    const sendReportToMail = async () => {
        setLoading(true);
        try {
            await api.post(`mystore/${selectedStore}/send-report`, {
                orders,
                startDate,
                endDate,
                email: getUserInfo().email
            });
        } catch (error) {
            console.error('Error sending report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={0}>
          
          
            <Grid container sx={{pl:2,pt:2}} alignItems="center" spacing={1} wrap="nowrap">
    {/* From Date */}
    <Grid item xs={"4.5"}>
        <TextField
            type="date"
            label="From"
            value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
        />
    </Grid>

    {/* To Date */}
    <Grid item xs={"4.5"}>
        <TextField
            type="date"
             label="To Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
        />
    </Grid>

    {/* Go Button */}
    <Grid item xs="auto">
        <Button
            variant="contained"
            color="primary"
            onClick={() => fetchOrders(selectedStore)}
            size="medium"
        >
            Go
        </Button>
    </Grid>

    {/*  
    <Grid item xs="auto">
       <OrderControls onRefresh={() => fetchOrders(selectedStore)} />
    </Grid>
    */}
</Grid>
         
            {orders.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Report Summary
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Total Orders</TableCell>
                                    <TableCell>{totalOrders}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>Rs. {totalAmount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Delivery Fees</TableCell>
                                    <TableCell>Rs. {deliveryFees}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="orderCount" fill="#8884d8" />
                            <Bar dataKey="totalAmount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                    <Button
                        sx={{ marginTop: 3 }}
                        variant="contained"
                        color="primary"
                        onClick={sendReportToMail}
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Report to Mail'}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Reports;

