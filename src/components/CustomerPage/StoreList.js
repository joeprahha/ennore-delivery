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
                    onClick={store.status === 'open' ? () => onStoreClick(store.id) : null}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 1,
                        cursor: store.status === 'open' ? 'pointer' : 'default',
                        backgroundColor: 'white', // White background
                    }}
                >
                    {/* Icon on the left */}
                    <LocationOnIcon sx={{ marginRight: 2, color: store.status === 'open' ? 'green' : 'red' }} />

                    {/* Store Info on the right */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">{store.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            456 Elm Street, City
                        </Typography>
                    </Box>

                    {/* Conditional Button for Store Status */}
                    {store.status === 'open' ? (
                        <Button variant="contained" color="primary" sx={{ fontSize: '0.75rem' }}>
                            Shop Now
                        </Button>
                    ) : (
                        <Typography variant="body2" color="error">
                            Closed
                        </Typography>
                    )}
                </Paper>
            ))}
        </Box>
    );
};

export default StoreList;

