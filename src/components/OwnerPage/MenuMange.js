import React, { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Tabs,
    Tab,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../../utils/api';

const MenuManagement = ({
	menu,
	setMenu,
    loadingMenu,
    userId
}) => {


    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(Object.keys(menu)[0]);
    const [newItem, setNewItem] = useState({ name: '', price: '' });
    const [editedItem, setEditedItem] = useState({ name: '', price: '' });
    const [editIndex, setEditIndex] = useState(null);

	 
    // Add a new category
    const handleAddCategory = () => {
        if (newCategory) {
            setMenu((prevMenu) => ({ ...prevMenu, [newCategory]: [] }));
            setNewCategory('');

        }
    };

    // Add a new item to a category
   const handleAddItem = (category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category].push(newItem); // Add the new item
        setMenu(updatedMenu);
        setNewItem({ name: '', price: '' }); // Clear the input
    };

    const handleSaveMenu = async () => {
        const formattedMenu = Object.entries(menu).map(([categoryName, items]) => ({
            categoryName,
            items,
        }));

        try {
            await api.put(`menus/${userId}`, { menu: formattedMenu });
            alert('Menu saved successfully');
        } catch (error) {
            console.error('Error saving menu:', error);
            alert('Error saving menu');
        }
    };
    
      const handleUpdateItem = (index,category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category][index] = editedItem; // Update the item
        setMenu(updatedMenu); // Update the state
        setEditedItem({ name: '', price: '' }); // Clear the input
        setEditIndex(null); // Reset the edit index
    };

    const handleDeleteItem = (index,category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category].splice(index, 1); // Remove the item
        setMenu(updatedMenu); // Update the state
    };


    return (
        <Box p={3}>
            <Box display="flex" mb={2} sx={{ alignItems: 'center' }}>
                <TextField
                    label="Add New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ height: '40px', mb: 2, mt: 0 }}
                />
                {newCategory && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleAddCategory(newCategory)}
                        sx={{ ml: 2, height: '40px', alignSelf: 'stretch' }}
                    >
                        Add
                    </Button>
                )}
            </Box>

            {loadingMenu ? (
                <CircularProgress />
            ) : (
                <Box sx={{ mt: 2 }}>
                    <Tabs
                        value={selectedCategory}
                        onChange={(event, newValue) => setSelectedCategory(newValue)}
                    >
                        {Object.keys(menu).map((category) => (
                            <Tab key={category} label={category} value={category} />
                        ))}
                    </Tabs>

                    <Box sx={{ mt: 2 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {menu[selectedCategory]?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <TextField
                                                    value={
                                                        editIndex === index ? editedItem.name : item.name
                                                    }
                                                    onChange={(e) => {
                                                        const newName = e.target.value;
                                                        if (editIndex === index) {
                                                            setEditedItem({
                                                                ...editedItem,
                                                                name: newName,
                                                            });
                                                        }
                                                    }}
                                                    disabled={editIndex !== index}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    value={
                                                        editIndex === index ? editedItem.price : item.price
                                                    }
                                                    type="number"
                                                    onChange={(e) => {
                                                        const newPrice = parseFloat(e.target.value);
                                                        if (editIndex === index && !isNaN(newPrice)) {
                                                            setEditedItem({
                                                                ...editedItem,
                                                                price: newPrice,
                                                            });
                                                        }
                                                    }}
                                                    disabled={editIndex !== index}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {editIndex === index ? (
                                                    <>
                                                        <Button
                                                            onClick={() =>
                                                                handleUpdateItem(index, selectedCategory)
                                                            }
                                                            color="primary"
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            onClick={() => setEditIndex(null)}
                                                            color="secondary"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            onClick={() => {
                                                                setEditedItem(item);
                                                                setEditIndex(index);
                                                            }}
                                                            color="primary"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                handleDeleteItem(index, selectedCategory)
                                                            }
                                                            color="secondary"
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell>
                                            <TextField
                                                label="Name"
                                                value={newItem.name}
                                                onChange={(e) =>
                                                    setNewItem({
                                                        ...newItem,
                                                        name: e.target.value,
                                                    })
                                                }
                                                InputProps={{
                                                    style: { height: '30px' },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                label="Price"
                                                value={newItem.price}
                                                type="number"
                                                onChange={(e) =>
                                                    setNewItem({
                                                        ...newItem,
                                                        price: parseFloat(e.target.value),
                                                    })
                                                }
                                                InputProps={{
                                                    style: { height: '30px' },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleAddItem(selectedCategory)}
                                            >
                                                Add
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSaveMenu}
                        sx={{ mt: 2 }}
                    >
                        Save Menu
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default MenuManagement;

