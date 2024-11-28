import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Settings from '../../OwnerPage/Settings'


// Styles for the Modal content
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh', // Ensures the modal doesn't overflow the viewport
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflowY: 'auto', // Makes the modal scrollable
};

const SettingsModal = ({ selectedStore, open, onClose }) => {
console.log("modal",selectedStore)
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="settings-modal-title"
      aria-describedby="settings-modal-description"
    >
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography id="settings-modal-title" variant="h6">
            Store Settings
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box mt={2}>
          <Settings selectedStore={selectedStore} />
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;

