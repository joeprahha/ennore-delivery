import React, { useState,useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Typography,
  Paper,
  Button,
  Autocomplete,
} from '@mui/material';
import { api } from '../../utils/api';

const Settings = ({selectedStore}) => {
  // State variables
  const [storeName, setStoreName] = useState('');
  const [storeCategories, setStoreCategories] = useState([]);
  const [storeOpenTime, setStoreOpenTime] = useState('');
  const [storeCloseTime, setStoreCloseTime] = useState('');
  const [storeAddress1, setStoreAddress1] = useState('');
  const [storeLocalArea, setStoreLocalArea] = useState('');
  const [storeImageUrl, setStoreImageUrl] = useState('');
  const [storeLogoUrl, setStoreLogoUrl] = useState('');
  const [fssai, setFssai] = useState('');
  const [phone, setPhone] = useState('');

  const categories = ['Grocery', 'Fast Food', 'Electronics', 'Clothing']; // Example categories
  const locations = ['Location 1', 'Location 2', 'Location 3']; // Example locations

  const handleCategoryChange = (event) => {
    setStoreCategories(event.target.value);
  };




  useEffect(() => {
    if (selectedStore) {
      api
        .get(`stores/${selectedStore}`)
        .then((response) => {
          const data = response.data;
          setStoreName(data.name || '');
          setStoreCategories(data.category ? data.category.split(',') : []);
          setStoreOpenTime(data.open_time || '');
          setStoreCloseTime(data.close_time || '');
          setStoreAddress1(data.address1 || '');
          setStoreLocalArea(data.local || '');
          setStoreImageUrl(data.image || '');
          setStoreLogoUrl(data.logo || '');
          setFssai(data.fssai || '');
          setPhone(data.phone || '');
        })
        .catch((error) => {
          console.error('Error fetching store details:', error);
        });
    }
  }, [selectedStore]);


const handleUpdateStore = async () => {
  try {
    const response = await api.put(`stores/${selectedStore}`, {
      name: storeName,
      category: storeCategories.join(','),
      open_time: storeOpenTime,
      close_time: storeCloseTime,
      address1: storeAddress1,
      local: storeLocalArea,
      fssai,
      phone,
    });

    console.log('Store updated successfully:', response.data);

  } catch (error) {
    console.error('Error updating store:', error);

  }
};

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        maxWidth: 600,
        margin: '0 auto',
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
            {category}
          </MenuItem>
        ))}
      </Select>

      <Box sx={{ display: 'flex', gap: 2 }}>
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
        />
      </Box>

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
        options={locations}
        value={storeLocalArea}
        onChange={(e, newValue) => setStoreLocalArea(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Local Area" margin="normal" />
        )}
      />

      <TextField
        label="FSSAI"
        fullWidth
        value={fssai}
        onChange={(e) => setFssai(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Phone"
        type="number"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        margin="normal"
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
          <img
            src={storeImageUrl}
            alt="Store Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Typography variant="body2">+ Add Image</Typography>
        )}
      </Paper>
      <input
        id="store-image-upload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}

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

      >
        {storeLogoUrl ? (
          <img
            src={storeLogoUrl}
            alt="Store Logo"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Typography variant="body2">+ Add Logo</Typography>
        )}
      </Paper>
      <input
        id="store-logo-upload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}

      />

      <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleUpdateStore}>
        Update Store
      </Button>
    </Box>
  );
};

export default Settings;

