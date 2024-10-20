import React, { useState,useEffect } from 'react';
import { Box, Button, TextField, Typography,Grid,TableContainer,TableRow,Table,TableCell,TableBody ,CircularProgress} from '@mui/material';

import { decodeToken, getToken } from '../../utils/auth';
import { useParams, useNavigate } from 'react-router-dom';
import {api} from '../../utils/api';
import{getUserInfo} from '../../utils/localStorage'
export const generateReport = async (storeId,startDate, endDate) => {

    try {
    
        const response = await api.get(`mystore/${storeId}/orders?startDate=${startDate}&endDate=${endDate}`);
        const orders = response.data;
	console.log("r",orders)
      
        return orders
    } catch (error) {
        console.error('Error fetching orders:', error);
        return null;
    }
};






const Reports = () => {
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [deliveryFees, setDeliveryFees] = useState(0);
        const [storeId, setStoreId] = useState('');
       const [orders, setOrders] = useState([]);
   const navigate=useNavigate()
useEffect(() => {
    const fetchStoreId = async () => {
        if (decodeToken().scope === 'owner') {
            const { data } = await api.get('mystore');
            setStoreId(data[0]._id);
        } else {
            navigate('/');
        }
    };
    fetchStoreId();
}, []);

 const [loading, setLoading] = useState(false);

    const sendReportTomail = async (storeId, orders, startDate, endDate) => {
        console.log("re");
        setLoading(true); // Start loader
        try {
            const response = await api.post(`mystore/${storeId}/send-report`, {
                orders,
                startDate,
                endDate,
                email: getUserInfo().email,
            });
            const re = response.data;
            console.log("r", re);
        } catch (error) {
            console.error('Error sending report:', error);
        } finally {
            setLoading(false); // Stop loader
        }
    };
    const handleGenerateReport = async () => {
    
        const orders= await generateReport(storeId,startDate, endDate);
        setOrders(orders)
          // Calculate totals
        const totalOrders = orders.length;
        const totalAmount = orders.reduce((sum, order) => sum + (order.total-order.donation-order.delivery_fee), 0);
        const deliveryFees = orders.length*3;

        // Implement logic to create PDF and send to user email
        setTotalOrders(totalOrders)
        setTotalAmount(totalAmount)
        setDeliveryFees(deliveryFees)
      ;
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Generate Report
            </Typography>
            <Grid container spacing={2} alignItems="center" mb={2}>
    <Grid item xs={5}>
        <TextField
            type="date"
            label="From Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            margin="normal"
        />
    </Grid>
    <Grid item xs={5}>
        <TextField
            type="date"
            label="To Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            margin="normal"
        />
    </Grid>
    <Grid item xs={2}>
      
      {(startDate && endDate) ?  (<Button
            variant="contained"
            color="primary"
            onClick={handleGenerateReport}
            fullWidth
        >
            >
        </Button> ):<></>
        }
    </Grid>
</Grid>
       { orders.length  ?      
           <Box mt={4}>
     <Typography variant="h6" gutterBottom>
        Report Summary
    </Typography>
    <TableContainer>
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell><Typography>Total Orders</Typography></TableCell>
                    <TableCell><Typography>{totalOrders}</Typography></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><Typography>Total Amount</Typography></TableCell>
                    <TableCell><Typography>Rs. {totalAmount}</Typography></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><Typography>Delivery Fees</Typography></TableCell>
                    <TableCell><Typography>Rs. {deliveryFees}</Typography></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer> 
    
<Box>
            <Button
                sx={{ marginTop: 3 }}
                variant="contained"
                color="primary"
                onClick={() => sendReportTomail(storeId, orders, startDate, endDate)}
                fullWidth
                disabled={loading} // Disable button while loading
            >
                {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                    'Send Report to Mail'
                )}
            </Button>
        </Box>
</Box>:<></>}

        </Box>
    );
};

export default Reports;

