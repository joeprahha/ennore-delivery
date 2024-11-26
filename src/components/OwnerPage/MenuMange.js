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
    const [selectedCategory, setSelectedCategory] = useState(
        Object.keys(menu)[0] || ''
    );
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        available: true,
        image: '',
    });
    const [save, setSave] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const handleAddCategory = () => {
        if (newCategory) {
            setMenu((prevMenu) => ({
                ...prevMenu,
                [newCategory]: { items: [], available: true },
            }));
            setNewCategory('');
        }
    };

    const handleAddItem = (category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category].items.push({ ...newItem, id: Date.now() }); // Generate a unique ID
        setMenu(updatedMenu);
        setNewItem({ name: '', price: '', available: true, image: '' });
    };

    const handleUpdateItem = (id, category, field, value) => {
        const updatedMenu = { ...menu };
        const itemIndex = updatedMenu[category].items.findIndex(
            (item) => item.id === id
        );
        if (itemIndex !== -1) {
            updatedMenu[category].items[itemIndex] = {
                ...updatedMenu[category].items[itemIndex],
                [field]: value,
            };
            setMenu(updatedMenu);
        }
    };

    const handleUpdateCategory = (categoryName, field, value) => {
        const updatedMenu = { ...menu };
        console.log("df",menu)
        if (updatedMenu[categoryName]) {
            updatedMenu[categoryName][field] = value;
                    console.log("df",updatedMenu)
            setMenu(updatedMenu);
        }
    };

    const handleDeleteItem = (id, category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category].items = updatedMenu[category].items.filter(
            (item) => item.id !== id
        );
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
        const formattedMenu = Object.entries(menu).map(
            ([categoryName, { items, available }]) => ({
                categoryName,
                available,
                items,
            })
        );
        setSave(true);
        try {
            await api.put(`menus/${selectedStore}`, { menu: formattedMenu });
        } catch (error) {
            console.error('Error saving menu:', error);
            alert('Error saving menu');
        } finally {
            setSave(false);
        }
    };
    
    console.log('menu[selectedCategory]0',menu[selectedCategory],selectedCategory,menu)

    return (
        <Box p={1}>
            <Box
                display="flex"
                mb={1}
                sx={{ alignItems: 'center', justifyContent: 'center' }}
            >
                <TextField
                    label="Add New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    sx={{
                        flexGrow: 1,
                        marginRight: 1,
                        mt: 1,
                        '& .MuiInputBase-root': { height: '40px' },
                    }}
                    InputProps={{
                        style: { fontSize: '0.75rem' },
                    }}
                />
                {newCategory && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleAddCategory}
                        sx={{ ml: 1, mt: 1, height: '38px', alignSelf: 'stretch' }}
                    >
                        Add
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSaveMenu}
                    sx={{ m: 1, width: '150px' }}
                >
                    {save ? <CircularProgress size="24px" /> : 'Save Menu'}
                </Button>
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
    {Object.entries(menu).map(([category, { available }]) => (
        <Tab
            key={category}
            value={category}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        sx={{
                            textDecoration: available ? 'none' : 'line-through', // Strike through if unavailable
                        }}
                    >
                        {category}
                    </Typography>
                    <Switch
                        checked={available}
                        size="small"
                        onChange={(e) =>
                            handleUpdateCategory(category, 'available', e.target.checked)
                        }
                        sx={{ marginLeft: 1 }}
                    />
                </Box>
            }
        />
    ))}
</Tabs>


                    <Box sx={{ mt: 2 }}>
                     
                        <Grid container spacing={0.5}>
                            {menu[selectedCategory]?.items?.map((item) => (
                                <Grid item key={item.id} xs={12}>
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 1,
                                            height: '30px',
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
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid lightgrey',
                                                borderRadius: '4px',
                                            }}
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        `image-upload-${item.id}`
                                                    )
                                                    .click()
                                            }
                                        >
                                            {imageUploading ? (
                                                <CircularProgress size="40px" />
                                            ) : (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <TextField
                                            value={item.name}
                                            onChange={(e) =>
                                                handleUpdateItem(
                                                    item.id,
                                                    selectedCategory,
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            sx={{
                                                flexGrow: 1,
                                                marginRight: 1,
                                                '& .MuiInputBase-root': {
                                                    height: '30px',
                                                },
                                            }}
                                            InputProps={{
                                                style: { fontSize: '0.75rem' },
                                            }}
                                        />
                                        <TextField
                                            value={item.price}
                                            type="number"
                                            onChange={(e) =>
                                                handleUpdateItem(
                                                    item.id,
                                                    selectedCategory,
                                                    'price',
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            sx={{
                                                width: '70px',
                                                marginRight: 1,
                                                '& .MuiInputBase-root': {
                                                    height: '30px',
                                                },
                                            }}
                                            InputProps={{
                                                style: { fontSize: '0.75rem' },
                                            }}
                                        />
                                        <Switch
                                            checked={item.available}
                                            size="small"
                                            onChange={(e) =>
                                                handleUpdateItem(
                                                    item.id,
                                                    selectedCategory,
                                                    'available',
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <IconButton
                                            onClick={() =>
                                                handleDeleteItem(
                                                    item.id,
                                                    selectedCategory
                                                )
                                            }
                                            color="secondary"
                                            size="small"
                                        >
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
                </Box>
            )}
        </Box>
    );
};

export default MenuManagement;

