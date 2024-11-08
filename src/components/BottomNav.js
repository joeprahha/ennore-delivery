import React from 'react';
import { Box, Typography, BottomNavigation, IconButton, Grid } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';

const BottomNav = ({ isDarkMode }) => {
    const locations = [
        'Nettukuppam',
        'Ennore Kuppam',
        'Thazhankuppam',
        'Mugathuvara Kuppam',
        'Ulagnathapuram',
        'SVM Nagar',
        'Vallur Nagar',
        'Kamaraj Nagar',
        'High School Surroundings',
        'Kaathukuppam',
        'RS Road',
        'Ennore Bus Depot Surroundings',
    ];

    const categories = [
        {
            name: "Groceries",
            image: "https://res.cloudinary.com/dq6e1ggmv/image/upload/v1729623847/Groceries_jvl9so.jpg"
        },
        {
            name: "Fast Food",
            image: "https://res.cloudinary.com/dq6e1ggmv/image/upload/v1729623848/Fast_food_fu5jce.png"
        },
        {
            name: "Pizza",
            image: "https://res.cloudinary.com/dq6e1ggmv/image/upload/v1729623855/A_af62k7.png"
        },
        {
            name: "Burger",
            image: "https://res.cloudinary.com/dq6e1ggmv/image/upload/v1729623848/Butmrfe_zsvrq0.png"
        },
        {
            name: "Bakery",
            image: "https://res.cloudinary.com/dq6e1ggmv/image/upload/v1729623848/Bak_dboork.png"
        }
    ];

    return (
        <Box sx={{ backgroundColor: 'background.paper', padding: 3, position: 'relative', boxShadow: 2 }}>
            {/* Image Section */}
            <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
                <img src="/img2.png" alt="Delivery" style={{ height: '38px', marginLeft: '8px', filter: !isDarkMode && 'invert(1)' }} />
            </Box>

            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Welcome to Ennore Delivery
            </Typography>
            <Typography variant="body1" align="center" sx={{ marginBottom: 1 }}>
                Whatever you order in Ennore
            </Typography>
            <Typography variant="body1" align="center" gutterBottom sx={{ marginBottom: 1 }}>
                Wherever we will deliver in Ennore
            </Typography>
            <Typography variant="body1" align="center" gutterBottom sx={{ marginBottom: 2, color: 'primary.main' }}>
                Just order!
            </Typography>
            <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                We will deliver to:
            </Typography>

            {/* Locations in two rows */}
            <Grid container spacing={2} justifyContent="center">
                {locations.map((location, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                        <Typography variant="body2" align="center">
                            {location}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Shop by Category Section */}
            <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', marginTop: 4, marginBottom: 2 }}>
                Shop by Category:
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {categories.map((category, index) => (
                    <Grid item xs={4} sm={2} key={index}>
                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src={category.image}
                                alt={category.name}
                                style={{ width: '80%', height: 'auto', borderRadius: '5px' }}
                            />
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                {category.name}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                <Typography variant="caption" display="block" gutterBottom sx={{ marginBottom: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    Ennore Delivery - Since 2024
                </Typography>
                <IconButton href="https://wa.me/your_whatsapp_number" target="_blank">
                    <WhatsAppIcon />
                </IconButton>
                <IconButton href="https://instagram.com/your_instagram_handle" target="_blank">
                    <InstagramIcon />
                </IconButton>
            </Box>

            {/* Add 20px height empty space */}
            <Box sx={{ height: '80px' }} />
        </Box>
    );
};

export default BottomNav;

