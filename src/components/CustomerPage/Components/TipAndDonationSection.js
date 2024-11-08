import React from 'react';
import { Box, Paper, Typography, Divider, Chip } from '@mui/material';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';

const TipAndDonationSection = ({ title, subtitle,  amounts,selectedAmount, setSelectedAmount, icon }) => {

    return (
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {icon}
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '0.8rem' }}>
                        {subtitle}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1, width: '100%' }}>
                {amounts.map((amount) => (
                    <Chip
                        key={amount}
                        label={`₹${amount}`}
                        color="primary" 
                        onClick={() => setSelectedAmount(amount)}
                        variant={selectedAmount === amount ? 'filled' : 'outlined'}
                        sx={{ marginRight: 1, width: "20%" }}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default TipAndDonationSection;

