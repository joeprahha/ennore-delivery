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
    CircularProgress,Tab,  Accordion,
  AccordionSummary,
  AccordionDetails,Fab,
    Tabs, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../../utils/api';
import { ContentPaste as PasteIcon } from '@mui/icons-material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputAdornment from '@mui/material/InputAdornment';


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
 const [open, setOpen] = useState(false);  // State to control modal visibility

  const handleOpen = () => {
    setOpen(true); // Open modal
  };

  const handleClose = () => {
    setOpen(false); // Close modal
  };
    const handleAddCategory = () => {
        if (newCategory) {
            setMenu((prevMenu) => ({
                ...prevMenu,
                [newCategory]: { items: [], available: true },
            }));
            setNewCategory('');
        }
        handleClose()
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
    
    

    return (
        <Box p={1}>
         <Fab
  color="success"
  onClick={handleSaveMenu}
  sx={{
    position: 'fixed',
    bottom: 16,
    right: 16,
    m: 1,
    boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
  }}
>
  {save ? <CircularProgress size="24px" color="inherit" /> : 'Save'}
</Fab>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
        
        <TextField
                    label="Add New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    sx={{
                        flexGrow: 1,
                        marginRight: 1,
                        mt: 1,

                    }}
                    InputProps={{
                        style: { fontSize: '0.75rem' },
                    }}
                />
                
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
           <Button
                color="primary"
                size="small"
                onClick={handleAddCategory}
                    >
                        Add
                    </Button>
        </DialogActions>
      </Dialog>
        
            {loadingMenu ? (
                <CircularProgress />
            ) : (
                <Box >
                      <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'sticky',
                top: 128,
                zIndex: 10,
 backgroundColor: '#fff', 
                pt: 1,
            }}
               >  
               <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                width: '100%', 
                                overflow: 'hidden', 
                            }}
                        >
                  <Tabs
		value={selectedCategory}
		onChange={(event, newValue) => setSelectedCategory(newValue)}
		variant="scrollable"
		scrollButtons="auto"
		sx={{ 
		overflowX: 'auto', 
		flexGrow: 1, 
		flexShrink: 1, 
		minHeight: '48px', 
		}} 
>
<Tab
        value={'+New Category'}
        onClick={handleOpen}
        label={
          <Typography sx={{ fontWeight: 'bold' }}>
            +New Category
          </Typography>
        }
      />
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
                        color="secondary"
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
</Tabs> </Box>
                </Box>

                    <Box sx={{ mt: 2 ,backgroundColor: 'rgba(95, 37, 159, 0.05)'}}>
                     
                        <Grid container spacing={1}>
                            {menu[selectedCategory]?.items?.map((item) => (
  <Grid item xs={12} key={item.id}>
    <Accordion  key={item.id} defaultExpanded>
      {/* Accordion Summary */}
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${item.id}-content`}
        id={`panel-${item.id}-header`}
      >
        <Typography>{item.name}</Typography>
      </AccordionSummary>

      {/* Accordion Details */}
      <AccordionDetails>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
		
            height: "auto",

          }}
          elevation={0}
        >
          {/* Image Upload */}
          <input
            type="file"
            id={`image-upload-${item.id}`}
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, item)}
          />
          <Box
            sx={{
              cursor: "pointer",
              mr: 1,
              width: "70px",
              height: "70px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid lightgrey",
              borderRadius: "4px",
            }}
            onClick={() =>
              document.getElementById(`image-upload-${item.id}`).click()
            }
          >
            {imageUploading ? (
              <CircularProgress size="40px" />
            ) : (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            )}
          </Box>

          {/* Item Details */}
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              {/* Item Name */}
              <TextField
                variant="standard"
                value={item.name}
                onChange={(e) =>
                  handleUpdateItem(item.id, selectedCategory, "name", e.target.value)
                }
                sx={{
                  flexGrow: 1,
                  marginRight: 1,
                  "& .MuiInputBase-root": {
                    height: "30px",
                  },
                }}
                InputProps={{
                  style: { fontSize: "0.75rem" },
                }}
              />

              {/* Item Price */}
              <TextField
                value={item.price}
                type="number"
                onChange={(e) =>
                  handleUpdateItem(
                    item.id,
                    selectedCategory,
                    "price",
                    parseFloat(e.target.value)
                  )
                }
                sx={{
                  width: "70px",
                  marginRight: 1,
                  "& .MuiInputBase-root": {
                    height: "30px",
                  },
                }}
                InputProps={{
                  style: { fontSize: "0.75rem" },
                }}
              />

              {/* Availability Toggle */}
              <Switch
                checked={item.available}
                size="small"
                onChange={(e) =>
                  handleUpdateItem(
                    item.id,
                    selectedCategory,
                    "available",
                    e.target.checked
                  )
                }
              />
            </Box>

            {/* Item Image URL */}
            <TextField
              variant="standard"
              fullWidth
              value={item.image}
              onChange={(e) =>
                handleUpdateItem(item.id, selectedCategory, "image", e.target.value)
              }
              sx={{
                "& .MuiInputBase-root": {
                  height: "30px",
                },
              }}
              InputProps={{
                style: { fontSize: "0.75rem" },
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      navigator.clipboard
                        .readText()
                        .then((text) => {
                          handleUpdateItem(item.id, selectedCategory, "image", text);
                        })
                        .catch((err) => {
                          console.error("Failed to read clipboard contents: ", err);
                        });
                    }}
                    sx={{ padding: 0, marginLeft: 1 }}
                  >
                    <PasteIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
      </AccordionDetails>
    </Accordion>
  </Grid>
))}
		                    <Grid item>
		                       <Grid item>
  <Button
    variant="outlined" // Use Material UI's contained button style
    color="secondary" // Set the button color to secondary
		                            onClick={() => handleAddItem(selectedCategory)}
    sx={{ m: 1 }} // Adds margin around the button
  >
    + New Item
  </Button>
</Grid>

		                    </Grid>
                        </Grid>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default MenuManagement;

