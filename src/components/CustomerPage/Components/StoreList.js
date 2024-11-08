// StoreList.jsx
import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const StoreList = ({ stores, onStoreClick }) => {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {stores.map((store) => (
               <Paper
    key={store.id}
    onClick={store.status === 'open' ? () => onStoreClick(store._id) : null}
    sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 1,
        cursor: store.status === 'open' ? 'pointer' : 'default',
        backgroundColor: 'white', // White background
    }}
>
    {/* Store Image on the left */}
    <img
        src={store.image}
        alt={store.name}
        style={{
            width: '50px', // Adjust the width as needed
            height: '50px', // Adjust the height as needed
            borderRadius: '4px', // Optional: rounded corners
            marginRight: '16px', // Spacing to the right of the image

        }}
    />

    {/* Store Info on the right */}
    <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1">{store.name}</Typography>
        <Typography variant="body2" color="text.secondary">
            {store?.address1 ? store?.address1 : `Rs. ${store.price}`}
        </Typography>
    </Box>
</Paper>

            ))}
        </Box>
    );
};

export default StoreList;

