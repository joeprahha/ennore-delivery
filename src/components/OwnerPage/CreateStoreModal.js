import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, Button, Paper } from '@mui/material';
import { api } from '../../utils/api';
import { decodeToken, getToken } from '../../utils/auth';

const CreateStoreModal = ({ storeModalOpen, setStoreModalOpen, fetchStores }) => {
    const [storeName, setStoreName] = useState('');
    const [storeCategory, setStoreCategory] = useState('');
    const [storeOpenTime, setStoreOpenTime] = useState('');
    const [storeCloseTime, setStoreCloseTime] = useState('');
    const [storeAddress1, setStoreAddress1] = useState('');
    const [storeLocalArea, setStoreLocalArea] = useState('');
    const [storeImageUrl, setStoreImageUrl] = useState('');
const [storeLogoUrl, setStoreLogoUrl] = useState('https://drive.google.com/uc?export=view&id=d6d189a515121d8c85fd8273fd8cb0dc');


    const handleCreateStore = async () => {
        try {
            const { id } = decodeToken(); // Assuming the token has owner id
            const response = await api.post('/create-store', {
                name: storeName,
                category: storeCategory,
                open_time: storeOpenTime,
                close_time: storeCloseTime,
                address1: storeAddress1,
                local: storeLocalArea,
                ownerId: id,
                image: storeImageUrl,
                logo: storeLogoUrl,
            });
            setStoreModalOpen(false); // Close the modal after creating the store
            fetchStores(); // Fetch updated stores list
        } catch (error) {
            console.error('Error creating store:', error);
        }
    };

    const handleImageUpload = async (event, setUrl) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const imageUrl = response.data.url; // Ensure your backend returns the correct URL
            console.log(imageUrl)
            setUrl(imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <Modal
            open={storeModalOpen}
            onClose={() => setStoreModalOpen(false)}
            aria-labelledby="create-store-modal-title"
            aria-describedby="create-store-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto',
                }}
            >
                <Typography id="create-store-modal-title" variant="h4" component="h2" gutterBottom>
                    Create Store
                </Typography>

                <TextField
                    label="Store Name"
                    fullWidth
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    margin="normal"
                />
                
                {/* Store Category */}
                <Select
                    label="Category"
                    fullWidth
                    required
                    value={storeCategory}
                    onChange={(e) => setStoreCategory(e.target.value)}
                    displayEmpty
                    margin="normal"
                >
                    <MenuItem value="">
                        <em>Select a category</em>
                    </MenuItem>
                    <MenuItem value="groceries">Groceries</MenuItem>
                    <MenuItem value="restaurant">Restaurant</MenuItem>
                </Select>

                {/* Image Upload for Store Image */}
                <Paper
                    sx={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', cursor: 'pointer' }}
                    onClick={() => document.getElementById('store-image-upload').click()}
                >
                    {storeImageUrl ? (
                        <img src={storeImageUrl} alt="Store Image" style={{ width: '100%', height: '100%' }} />
                    ) : (
                        '+ Add Image'
                    )}
                </Paper>
                <input
                    id="store-image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, setStoreImageUrl)}
                />

                {/* Image Upload for Store Logo */}
                <Paper
                    sx={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', cursor: 'pointer', mt: 2 }}
                    onClick={() => document.getElementById('store-logo-upload').click()}
                >
                    {storeLogoUrl ? (
                        <img src={storeLogoUrl} alt="Store Logo" />
                    ) : (
                        '+ Add Logo'
                    )}
                </Paper>
                <input
                    id="store-logo-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, setStoreLogoUrl)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateStore}
                    sx={{ mt: 2 }}
                >
                    Create Store
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateStoreModal;

