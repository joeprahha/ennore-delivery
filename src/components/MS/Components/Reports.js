import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography,Box,Grid,TextField,Button, } from '@mui/material';
import { api } from '../../../utils/api'; // Ensure correct path to your API utility


// Function to format the data for each store's bar chart
const getChartDataForStore = (orders, storeName) => {
  const groupedOrders = {};
  orders.forEach(order => {
    if (order.storename === storeName) {
      const date = new Date(order.created_at).toLocaleDateString();
      if (!groupedOrders[date]) {
        groupedOrders[date] = { orderCount: 0, totalAmount: 0,donation:0,deliveryFee:0,platformFee:0 };
      }
      groupedOrders[date].orderCount++;
    groupedOrders[date].donation+=order.donation;
     groupedOrders[date].deliveryFee+=order.deliveryFee;
      groupedOrders[date].platformFee+=order.platformFee;
      groupedOrders[date].totalAmount += order.subTotal;
    }
  });

  const labels = Object.keys(groupedOrders).sort();
  const data = labels.map(date => ({
    date,
    orderCount: groupedOrders[date].orderCount || 0,
    totalAmount: groupedOrders[date].totalAmount || 0,
    donation: groupedOrders[date].donation || 0,
    deliveryFee: groupedOrders[date].deliveryFee || 0,
    platformFee: groupedOrders[date].platformFee || 0,
  }));

  return data;
};

 const today = new Date().toISOString().split('T')[0];
const OrderGraphs = () => {
    const [orders, setOrders] = useState([]); // State to store orders
 const [from, setFrom] = useState(today); // Default to today
    const [to, setTo] = useState(today); // Default to today
const fetchOrders = async () => {
            try {
                const response = await api.get(`/orders?from=${from}&to=${to}`); // Adjust to your actual orders endpoint
                setOrders(response.data); // Assuming the response contains the orders

            } catch (err) {
		

            }
        };



  const storeNames = Array.from(new Set(orders.map(order => order.storename)));

 const CustomTooltip = ({ payload, label }) => {
 console.log(payload)
  if (payload && payload.length > 0) {
    const { orderCount, totalAmount,donation,platformFee } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
          <strong>Date:</strong> {label}
        </Typography>
        <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
          <strong>Order Count:</strong> {orderCount}
        </Typography>
        <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
          <strong>Total Price:</strong> {totalAmount.toFixed(2)}
        </Typography>
        <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
         dnation: {donation} ,platform:{platformFee}
        </Typography>
      </div>
    );
  }
  return null;
};

  return (
  <Box sx={{ width: '100%', overflow: 'hidden' ,p:0}}>
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
  {storeNames.map(storeName => {
    const chartData = getChartDataForStore(orders, storeName);
    return (
      <Box key={storeName} sx={{ width: '100%', mb: 2 ,p:0}}>
        <Typography variant="h6" sx={{ mb: 2 }}>{storeName}</Typography>
        <ResponsiveContainer width="90%" height={150}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 'auto']} /> {/* Start Y-Axis from 1 */}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="orderCount" 
              fill={storeName === 'test' ? '#8884d8' : '#82ca9d'}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  })}
</Box>

  );
};

export default OrderGraphs;

