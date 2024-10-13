// Payment.js

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Grid,
    Card,
    CardContent,
    Modal,
    TextField
} from '@mui/material';
import { baseUrl } from '../utils/api';


const Payment = () => {
    const location = useLocation();
    const { amount, orderId } = location.state || {}; // Access amount and orderId from state
    let hasFetched = false;
    const handlePayment = async () => {
        try {
            const response = !hasFetched && await axios.post(`${baseUrl}/payment/initiate`, {
                orderId,
                amount,
            });
            hasFetched=true;

            if (response.data && response.data.response && response.data.response.paymentUrl) {
                // Redirect to PhonePe payment page
                window.location.href = response.data.response.paymentUrl;
            } else {
                console.error('Error fetching payment URL');
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
        }
    };

   
  useEffect(() => {
    // Ensure both amount and orderId are available before calling the API
    if (!amount || !orderId) {
        console.error('Missing payment details');
        return;
    }

    

}, []); // Empty dependency array ensures this runs only once on mount


    return (
        <div>
            <h2>Processing Payment for ₹{amount}</h2>
            <p>Order ID: {orderId}</p>
            <p>Redirecting to PhonePe for payment...</p>
            <Button onClick={handlePayment}> PAY </Button>
        </div>
    );
};

export default Payment;

