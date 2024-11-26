import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../../utils/api';

const PaymentForm = () => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    firstname: '',
    email: '',
    phone: '',
    productinfo: 'Sample Product',
    txnid:"23"
  });

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('payment', paymentData);
      const { payuURL } = response.data;

      // Redirect user to PayU
      window.location.href = payuURL;
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="amount" placeholder="Amount" onChange={handleChange} required />
      <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
      <button type="submit">Pay Now</button>
    </form>
  );
};

export default PaymentForm;

