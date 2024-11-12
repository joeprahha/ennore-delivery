import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importing back arrow icon
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for navigation

const TC = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    return (
    
    <>
     <IconButton 
                onClick={() => navigate(-1)} // Navigate one step back when clicked
                sx={{ left: 16, zIndex: 1 ,p:0,mt:2}}
            >
                <ArrowBackIcon />
            </IconButton>
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            {/* Back Icon at the top */}
           

            {/* Main content of Terms and Conditions */}
            <Typography variant="h4" gutterBottom align="center">
                Terms & Conditions for Ennore Delivery
            </Typography>

            <Typography variant="body1" paragraph sx={{ paddingBottom: 2 }}>
                Welcome to <strong>Ennore Delivery</strong>! By using our services, you agree to the following terms and conditions. Please read them carefully.
            </Typography>

            {/* Delivery Time */}
            <Typography variant="h6" gutterBottom>
                1. Delivery Time
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="We strive to deliver your order within 45 minutes to 1 hour from the time of order placement." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Delays may occur depending on factors like location, weather, and store availability." />
                </ListItem>
            </List>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Order Cancellation & Refunds */}
            <Typography variant="h6" gutterBottom>
                2. Order Cancellation & Refunds
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="No cancellations or refunds are accepted once an order is placed via Ennore Delivery." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="For any concerns regarding cancellations or refunds, please reach out directly to the specific store from which the order was placed." />
                </ListItem>
            </List>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Pricing */}
            <Typography variant="h6" gutterBottom>
                3. Pricing
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Prices on Ennore Delivery may differ from in-store prices due to delivery-related charges or platform fees." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="COD (Cash on Delivery) is available only in specific cases." />
                </ListItem>
            </List>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Refunds & Returns */}
            <Typography variant="h6" gutterBottom>
                4. Refunds & Returns
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Refunds and returns are not supported through Ennore Delivery. However, you may contact the respective store to inquire if they can assist with returns or exchanges in individual cases." />
                </ListItem>
            </List>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Platform Fee */}
            <Typography variant="h6" gutterBottom>
                5. Platform Fee
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="A minimum platform fee of ₹2 is charged on each order placed through the Ennore Delivery platform." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="We charge a ₹0.5 platform fee from partnering stores per order for delivery services." />
                </ListItem>
            </List>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Delivery Charges */}
            <Typography variant="h6" gutterBottom>
                6. Delivery Charges
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="We deliver orders starting at ₹4.5 for deliveries within the specified areas." />
                </ListItem>
            </List>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Donations & Tips */}
            <Typography variant="h6" gutterBottom>
                7. Donations & Tips
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="You have the option to donate or tip the driver based on your satisfaction with the delivery service. These contributions are completely voluntary." />
                </ListItem>
            </List>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Partner With Us */}
            <Typography variant="h5" gutterBottom>
                Partner With Us!
            </Typography>
            <Typography variant="body1" paragraph sx={{ paddingBottom: 2 }}>
                We invite grocery stores and restaurants to partner with Ennore Delivery to grow your business. Join us for just ₹0.5 per order as a platform fee, and expand your customer base through our delivery network.
            </Typography>

            <Typography variant="h6" gutterBottom>
                Additional Terms:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="User Responsibility: You must provide accurate delivery information and ensure someone is available to receive the order." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Force Majeure: Ennore Delivery is not liable for delays or non-performance due to circumstances beyond our control (e.g., natural disasters, strikes, etc.)." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Modification of Terms: Ennore Delivery reserves the right to update or change these terms at any time. Customers will be notified of significant changes via the app." />
                </ListItem>
            </List>

            {/* Footer */}
            <Box textAlign="center" mt={4}>
                <Typography variant="body2" color="textSecondary">
                    By using the Ennore Delivery app, you acknowledge and agree to these terms. We are committed to providing quality delivery services to meet your needs and expectations.
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                    Thank you for choosing Ennore Delivery!
                </Typography>
            </Box>
        </Container></>
    );
};

export default TC;

