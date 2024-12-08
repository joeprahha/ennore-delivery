import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Button, Paper, Typography, IconButton, TextField } from '@mui/material';
import { CopyAll as CopyIcon } from '@mui/icons-material';
import { api } from '../../../utils/api';
import { Snackbar, Alert } from '@mui/material';

const BulkMenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Fetch categories
    api.get('/bulk-menu')
      .then((response) => setCategories(response.data.data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    // Fetch items for selected category
    api.get(`/bulk-menu/${id}`)
      .then((response) => setItems(response.data.data.items))
      .catch((error) => console.error('Error fetching items:', error));
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setOpenSnackbar(true); // Show Snackbar when text is copied
    }).catch((error) => {
      console.error('Failed to copy: ', error);
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return; // Ignore clickaway
    }
    setOpenSnackbar(false); // Close Snackbar
  };

  // Filter items based on the search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      {/* Snackbar component */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Auto-hide after 6 seconds
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" onClose={handleSnackbarClose}>
          {'Copied to clipboard!'}
        </Alert>
      </Snackbar>

      {/* Categories Section */}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {categories.map((category) => (
          <Grid item xs={2} key={category.id}>
            <Button
              variant="outlined"
              sx={{ height: '30px' }}
              fullWidth
              onClick={() => handleCategorySelect(category._id)}
            >
              {category.category}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Show search bar only if a category is selected */}
      {selectedCategory && (
        <>
          <TextField
            fullWidth
            label="Search Items"
            variant="outlined"
            sx={{ marginTop: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />

          {/* Items Section - Only display filtered items */}
          <Grid container spacing={2} sx={{ marginTop: 4 }}>
            {filteredItems.map((item, index) => (
              <Grid item xs={4} key={index}>
                <Paper
                  sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    p: 1,
                    height: 'auto',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&:active': {
                      backgroundColor: 'transparent',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                  }}
                  tabIndex={0}
                  onClick={() => copyToClipboard(item.image)} // Trigger copy action
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '110px',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      backgroundColor: item.image ? 'transparent' : '#f0f0f0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      loading="lazy"
                    />
                  </Box>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '0.50rem',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      height: '2rem',
                      width: '100%',
                      mt: 0.5,
                      mb: 1,
                    }}
                  >
                    {item.name}
                    <IconButton sx={{ p: 0, fontSize: '0.20rem' }}>
                      <CopyIcon />
                    </IconButton>
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default BulkMenuPage;

