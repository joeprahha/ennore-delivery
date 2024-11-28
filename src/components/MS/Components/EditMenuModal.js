import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import ReactJson from 'react-json-view';
import { api } from '../../../utils/api';

const EditMenuModal = ({ selectedStore, open, onClose }) => {
  const [menuItems, setMenuItems] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch the menu items when the modal opens
  useEffect(() => {
    if (open && selectedStore) {
      setLoading(true);
      api
        .get(`/menus/${selectedStore}`)
        .then((response) => {
          setMenuItems(response.data);
        })
        .catch((error) => console.error('Error fetching menu:', error))
        .finally(() => setLoading(false));
    }
  }, [open, selectedStore]);

  // Handle update button click
 const handleUpdateMenu = async () => {
    try {
      setLoading(true);
      const transformedData = Object.keys(menuItems).map(category => ({
        categoryName: category,
        items: menuItems[category].items.map(item => ({
          name: item.name,
          price: item.price,
          available: item.available,
          image: item.image
        }))
      }));

      let data = { menu: transformedData };
      const response = await api.put(`/menus/${selectedStore}`, data);
      console.log('Menu updated:', response.data);
      onClose(); // Close the modal after update
    } catch (error) {
      console.error('Error updating menu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing the menu (including keys and values)
  const handleEdit = (edit) => {
    if (edit.name) {
      // Handle key edit (if a category name is being changed)
      const updatedMenu = { ...menuItems };
      delete updatedMenu[edit.name]; // Remove the old key
      updatedMenu[edit.updated_name] = edit.updated_src; // Add the new key with updated value
      setMenuItems(updatedMenu);
    } else {
      // Handle value edit
      setMenuItems(edit.updated_src);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Menu</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          menuItems && (
            <ReactJson
              src={menuItems}
              onEdit={handleEdit}  // Handle the edit event for both key and value
              onAdd={(add) => setMenuItems(add.updated_src)}  // Handle adding new items
              onDelete={(del) => setMenuItems(del.updated_src)}  // Handle delete event
              displayDataTypes={false} // Hide data types to make the view cleaner
              collapseStringsAfterLength={30} // Collapse strings after a certain length
              theme="monokai" // You can change the theme for styling (optional)
              iconStyle="circle" // Show icons (you can use 'square' or 'circle')
              enableClipboard={false} // Disable clipboard (optional)
            />
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdateMenu} color="primary" disabled={loading}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMenuModal;

