import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { api } from "../../utils/api";

const OrderSuccess = () => {
  const { orderid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failed'
  const [attempts, setAttempts] = useState(0);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  // Poll the payment status
  useEffect(() => {
    if (status === "success") {
      setPaymentStatus("success");
      setLoading(false);
    }
    if (status === "failed") {
      setPaymentStatus("failed");
      setLoading(false);
    }
  }, []);

  const handleGoToOrders = () => {
    navigate("/orders");
  };

  const renderStatusIcon = () => {
    if (status === "success") {
      return <CheckCircleIcon color="success" style={{ fontSize: 100 }} />;
    } else if (loading) {
      return <CircularProgress size={50} color="primary" />;
    } else if (paymentStatus === "success") {
      return <CheckCircleIcon color="success" style={{ fontSize: 100 }} />;
    } else if (paymentStatus === "failed") {
      return <CancelIcon color="error" style={{ fontSize: 100 }} />;
    }
    return null;
  };

  const renderMessage = () => {
    if (status === "success") {
      return (
        <Typography variant="h4" gutterBottom>
          Your order has been placed successfully!
        </Typography>
      );
    }
    if (loading) {
      return <Typography variant="h6">Fetching payment status...</Typography>;
    } else if (paymentStatus === "success") {
      return (
        <Typography variant="h4" gutterBottom>
          Your order has been placed successfully!
        </Typography>
      );
    } else if (paymentStatus === "failed") {
      return (
        <Typography variant="h4" color="error" gutterBottom>
          Payment failed. Please try again.
        </Typography>
      );
    }
    return null;
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        position: "relative"
      }}
    >
      <Box sx={{ mb: 2 }}>{renderStatusIcon()}</Box>
      {renderMessage()}
      <Typography variant="h6">
        Your Order ID: <strong>{orderid}</strong>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoToOrders}
        sx={{ mt: 3 }}
        disabled={loading} // Disable button while loading
      >
        Go to Orders
      </Button>
    </Container>
  );
};

export default OrderSuccess;
