import React, { useState } from 'react';
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    TextField,
    Select,
    MenuItem,
    Button,
    Paper,
    Chip,
    ListItemText,
    OutlinedInput,
    Slide,Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '../../utils/api';
import { decodeToken } from '../../utils/auth';

const SlideTransition = React.forwardRef(function SlideTransition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
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
    'Groceries',
    'Fast Food',
    'Pizza',
    'Burger',
    'Snacks',
    'Bakery',
    'Restaurant'
];

const CreateStoreDialog = ({ storeDialogOpen, setStoreDialogOpen, fetchStores }) => {
    const [storeName, setStoreName] = useState('');
    const [storeCategories, setStoreCategories] = useState([]); // Update state to handle multiple categories
    const [storeOpenTime, setStoreOpenTime] = useState('');
    const [storeCloseTime, setStoreCloseTime] = useState('');
    const [storeAddress1, setStoreAddress1] = useState('');
    const [storeLocalArea, setStoreLocalArea] = useState('');
    const [storeImageUrl, setStoreImageUrl] = useState('');
    const [storeLogoUrl, setStoreLogoUrl] = useState('');

    const handleCreateStore = async () => {
        try {
            const { id } = decodeToken();
            const response = await api.post('/create-store', {
                name: storeName,
                category: storeCategories.join(','), // Send multiple categories
                open_time: storeOpenTime,
                close_time: storeCloseTime,
                address1: storeAddress1,
                local: storeLocalArea,
                ownerId: id,
                image: storeImageUrl,
                logo: storeLogoUrl,
            });
            setStoreDialogOpen(false);
            fetchStores();
        } catch (error) {
            console.error('Error creating store:', error);
        }
    };

    const handleCategoryChange = (event) => {
        const {
            target: { value },
        } = event;
        setStoreCategories(typeof value === 'string' ? value.split(',') : value);
    };

    const handleImageUpload = async (event, setUrl) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const imageUrl = response.data.url;
            setUrl(imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <Dialog
            fullScreen
            open={storeDialogOpen}
            onClose={() => setStoreDialogOpen(false)}
            TransitionComponent={SlideTransition}
        >
            <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => setStoreDialogOpen(false)} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">Create Store</Typography>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    padding: 2,
                }}
            >
                <TextField
                    label="Store Name"
                    fullWidth
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    margin="normal"
                />
                
                <Select
                    label="Categories"
                    fullWidth
                    multiple
                    value={storeCategories}
                    onChange={handleCategoryChange}
                    input={<OutlinedInput label="Categories" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} sx={{ margin: 0.5 }} />
                            ))}
                        </Box>
                    )}
                    margin="normal"
                >
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            <ListItemText primary={category} />
                        </MenuItem>
                    ))}
                </Select>
             <Box sx={{display:"flex"}}>
                <TextField
                    label="Open Time"
                    type="time"
                    fullWidth
                    required
                    value={storeOpenTime}
                    onChange={(e) => setStoreOpenTime(e.target.value)}
                    margin="normal"
                />

                <TextField
                    label="Close Time"
                    type="time"
                    fullWidth
                    required
                    value={storeCloseTime}
                    onChange={(e) => setStoreCloseTime(e.target.value)}
                    margin="normal"
                /> </Box>

                <TextField
                    label="Address Line"
                    fullWidth
                    required
                    value={storeAddress1}
                    onChange={(e) => setStoreAddress1(e.target.value)}
                    margin="normal"
                />

                 <Autocomplete
                    fullWidth
                    sx={{ mt: 1, mb: 2 }}
                    options={locations}
                    onChange={(e) => {
                        setStoreLocalArea(e.target.value)
                    }}

                    onInputChange={(event, newInputValue) => {
                       setStoreLocalArea(newInputValue)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="local"
                            label="Local Area"
                            
                            InputProps={{
                                ...params.InputProps,
                            }}
                        />
                    )}
                />

                {/* Image Upload for Store Image */}
                <Paper
                    sx={{
                        width: '100%',
                        height: 150,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed grey',
                        cursor: 'pointer',
                        mt: 2,
                    }}
                    onClick={() => document.getElementById('store-image-upload').click()}
                >
                    {storeImageUrl ? (
                        <img src={storeImageUrl} alt="Store Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Typography variant="body2">+ Add Image</Typography>
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
                    sx={{
                        width: '100%',
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed grey',
                        cursor: 'pointer',
                        mt: 2,
                    }}
                    onClick={() => document.getElementById('store-logo-upload').click()}
                >
                    {storeLogoUrl ? (
                        <img src={storeLogoUrl} alt="Store Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Typography variant="body2">+ Add Logo</Typography>
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
                    sx={{ mt: 2,mb:2, width: '100%' }}
                >
                    Create Store
                </Button>
            </Box>
        </Dialog>
    );
};

export default CreateStoreDialog;

