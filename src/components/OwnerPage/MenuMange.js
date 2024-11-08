import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    Switch,
    IconButton,
    CircularProgress,
    Tabs,
    Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../../utils/api';

const MenuManagement = ({ menu, setMenu, loadingMenu, selectedStore }) => {
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(Object.keys(menu)[0]);
    const [newItem, setNewItem] = useState({ name: '', price: '', available: true, image: '' });
    const [editedItem, setEditedItem] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [save, setSave] = useState(false);
    
    const handleAddCategory = () => {
        if (newCategory) {
            setMenu((prevMenu) => ({ ...prevMenu, [newCategory]: [] }));
            setNewCategory('');
        }
    };

    const handleAddItem = (category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category].push({ ...newItem, id: Date.now() }); // Generate a unique ID
        setMenu(updatedMenu);
        setNewItem({ name: '', price: '', available: true, image: '' });
    };

    const handleUpdateItem = (id, category, field, value) => {
        const updatedMenu = { ...menu };
        const itemIndex = updatedMenu[category].findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            updatedMenu[category][itemIndex] = { ...updatedMenu[category][itemIndex], [field]: value };
            setMenu(updatedMenu);
        }
    };

    const handleDeleteItem = (id, category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category] = updatedMenu[category].filter(item => item.id !== id);
        setMenu(updatedMenu);
    };

    const handleImageUpload = async (event, item) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setImageUploading(true);
        try {
            const response = await api.post('/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const imageUrl = response.data.url;
            handleUpdateItem(item.id, selectedCategory, 'image', imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setImageUploading(false);
        }
    };

    const handleSaveMenu = async () => {
        const formattedMenu = Object.entries(menu).map(([categoryName, items]) => ({
            categoryName,
            items,
        }));
        setSave(true);
        try {
            await api.put(`menus/${selectedStore}`, { menu: formattedMenu });
            alert('Menu saved successfully');
        } catch (error) {
            console.error('Error saving menu:', error);
            alert('Error saving menu');
        } finally {
            setSave(false);
        }
    };

    return (
        <Box p={1}>
            <Box display="flex" mb={2} sx={{ alignItems: 'center' }}>
                <TextField
                    label="Add New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ height: '40px', m: 0 }}
                />
                {newCategory && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleAddCategory}
                        sx={{ ml: 2, height: '40px', alignSelf: 'stretch' }}
                    >
                        Add
                    </Button>
                )}
            </Box>

            {loadingMenu ? (
                <CircularProgress />
            ) : (
                <Box>
                    <Tabs
                        value={selectedCategory}
                        onChange={(event, newValue) => setSelectedCategory(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                    >
                        {Object.keys(menu).map((category) => (
                            <Tab key={category} label={category} value={category} />
                        ))}
                    </Tabs>

                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={0.5}>
                            {menu[selectedCategory]?.map((item) => (
                                <Grid item key={item.id} xs={12}>
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 1,
                                            height:'30px'
                                        }}
                                        elevation={0}
                                    >
                                        <input
                                            type="file"
                                            id={`image-upload-${item.id}`}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleImageUpload(e, item)}
                                        />
                                       <Box
					    sx={{
						cursor: 'pointer',
						mr: 2,
						width: '30px',
						height: '30px',
						overflow: 'hidden',
						display: 'flex', // Add display flex to center the image
						alignItems: 'center',
						justifyContent: 'center',
						border: '1px solid lightgrey', // Optional: add a border for better visibility
						borderRadius: '4px', // Optional: round corners
					    }}
					    onClick={() => document.getElementById(`image-upload-${item.id}`).click()}
					>
					    {imageUploading ? (
						<CircularProgress size="40px" />
					    ) : (
						<img
						    src={item.image}
						    alt={item.name}
						    style={{
							width: '100%', // Ensure the image takes full width
							height: 'auto', // Maintain aspect ratio
							objectFit: 'cover', // Crop image to fit
						    }}
						/>
					    )}
					</Box>
					<TextField
					    value={item.name}
					    onChange={(e) => handleUpdateItem(item.id, selectedCategory, 'name', e.target.value)}
					    sx={{ flexGrow: 1, marginRight: 1, '& .MuiInputBase-root': { height: '30px' } }} // Adjust height
					    InputProps={{
						style: { fontSize: '0.75rem' }, // Set font size
					    }}
					/>
					<TextField
					    value={item.price}
					    sx={{p:0}}
					    type="number"
					    onChange={(e) => handleUpdateItem(item.id, selectedCategory, 'price', parseFloat(e.target.value))}
					    sx={{ width: '70px', marginRight: 1, '& .MuiInputBase-root': { height: '30px' } }} // Adjust height
					    InputProps={{
						style: { fontSize: '0.75rem',p:0 }, // Set font size
					    }}
					/>

                                        <Switch
                                            checked={item.available}
                                            size="small" 
                                            onChange={(e) => handleUpdateItem(item.id, selectedCategory, 'available', e.target.checked)}
                                        />
                                        <IconButton onClick={() => handleDeleteItem(item.id, selectedCategory)} color="secondary" size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Paper>
                                </Grid>
                            ))}

                            <Grid item>
                                <Paper
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        width: '100%',
                                        height: 50,
                                    }}
                                    elevation={3}
                                    onClick={() => handleAddItem(selectedCategory)}
                                >
                                    <AddIcon fontSize="large" />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSaveMenu}
                        sx={{ mt: 2, width: "180px" }}
                    >
                        {save ? <CircularProgress size='24px' /> : "Save Menu"}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default MenuManagement;

