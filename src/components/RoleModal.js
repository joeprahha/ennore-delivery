// src/components/RoleModal.js
import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

const RoleModal = ({ open, onClose, onRoleSelection }) => {
    const handleRoleSelection = (role) => {
        onRoleSelection(role); // Call the parent method to set the role
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box 
                sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: 300, 
                    bgcolor: 'background.paper', 
                    borderRadius: 2, 
                    boxShadow: 24, 
                    p: 4 
                }}
            >
                <Typography variant="h6" component="h2">
                    Select Role
                </Typography>
                <Button onClick={() => handleRoleSelection('user')} fullWidth>
                    Login as User
                </Button>
                <Button onClick={() => handleRoleSelection('storeOwner')} fullWidth>
                    Login as Store Owner
                </Button>
                <Button onClick={() => handleRoleSelection('deliveryPartner')} fullWidth>
                    Login as Delivery Partner
                </Button>
            </Box>
        </Modal>
    );
};

export default RoleModal;
