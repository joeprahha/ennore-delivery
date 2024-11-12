import React from 'react';
import { Box, Typography, BottomNavigation, IconButton, Grid, Link } from '@mui/material';
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

            <Typography variant="h4" align="left" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '0.7rem', marginBottom: 2 }}>
                Welcome to Ennore Delivery
            </Typography>
            <Typography variant="body1" align="left" sx={{ marginBottom: 1, fontSize: '0.7rem' }}>
                Whatever you order in Ennore
            </Typography>
            <Typography variant="body1" align="left" gutterBottom sx={{ marginBottom: 1, fontSize: '0.7rem' }}>
                Wherever we will deliver in Ennore
            </Typography>
            <Typography variant="body1" align="left" gutterBottom sx={{ marginBottom: 2, color: 'primary.main', fontSize: '0.7rem' }}>
                Just order!
            </Typography>
            <Typography variant="h6" align="left" sx={{ fontWeight: 'bold', marginBottom: 2, fontSize: '0.7rem' }}>
                We will deliver to:
            </Typography>

            {/* Locations in two rows */}
            <Grid container spacing={2} justifyContent="flex-start">
                {locations.map((location, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                        <Typography variant="body2" align="left" sx={{ fontSize: '0.7rem' }}>
                            {location}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Shop by Category Section */}
            <Typography variant="h6" align="left" sx={{ fontWeight: 'bold', marginTop: 4, marginBottom: 2, fontSize: '0.7rem' }}>
                Shop by Category:
            </Typography>
            <Grid container spacing={2} justifyContent="flex-start">
                {categories.map((category, index) => (
                    <Grid item xs={4} sm={2} key={index}>
                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src={category.image}
                                alt={category.name}
                                style={{ width: '80%', height: 'auto', borderRadius: '5px' }}
                            />
                            <Typography variant="body2" sx={{ marginTop: 1, fontSize: '0.7rem' }}>
                                {category.name}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                <Typography variant="caption" display="block" gutterBottom sx={{ marginBottom: 1, color: 'primary.main', fontWeight: 'bold', fontSize: '0.7rem' }}>
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

            {/* Terms and Conditions, About Section */}
            <Box sx={{ marginTop: 3, textAlign: 'left', fontSize: '0.7rem' }}>
                <Link href="/terms" sx={{ marginRight: 2, textDecoration: 'none', color: 'primary.main' }}>
                    Terms and Conditions
                </Link>
                <Link href="/about" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                    About
                </Link>
            </Box>
        </Box>
    );
};

export default BottomNav;

