// src/components/Sidebar.js
import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Box,
    Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { getToken, getUserFromToken, logout, decodeToken } from '../utils/auth';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Sidebar = ({ open, onClose,toggleTheme,isDarkMode }) => {
    const navigate = useNavigate();
    const user = getUserFromToken(getToken());
    const { scope } = decodeToken();

    const handleLinkClick = () => {
        onClose();
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '250px',

                    padding: '16px',
		             borderRight: '1px solid #B2DFDB', // Light border for separation
		        },
            }}
        >
            {/* Close button section */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
             <IconButton onClick={onClose} > {/* Soft red close button */}
                    <CloseIcon />
                </IconButton>
                <Box style={{ flexGrow: 1 }}>
		    <img
		            src="/img2.png" // Replace with the correct path to your logo image
		            alt="Logo"
		            style={{ height: '38px', marginLeft: '8px',filter:!isDarkMode && 'invert(1)'}} // Adjust height and margin as needed
		        />
            </Box>

               <IconButton onClick={toggleTheme} > 
                    {isDarkMode ? <LightModeIcon/> : <DarkModeIcon/> }
                </IconButton>
            </Box>

            {/* User info section */}
            <Box display="flex" alignItems="center" mt={2} mb={2}>
                <PersonIcon sx={{ fontSize: 40, marginRight: 1, color: '#42A5F5' }} /> {/* Light blue icon */}
                <Typography variant="body1" sx={{ fontWeight: '500' }}>
                    {user?.name}
                </Typography>
            </Box>

            {/* Divider below user info */}
            <Divider sx={{ backgroundColor: '#A0AEC0', marginBottom: 2 }} />

            {/* Navigation links */}
            <List>
                {/* Conditional rendering based on user scope */}
                {scope === 'owner' && (
                    <>
                     <ListItem button component={Link} to={`/mystore/${user?.id}`} onClick={handleLinkClick}>
                            <ListItemText primary="Home" sx={{ color: '#2D3748' }} />
                        </ListItem>
                        <ListItem button component={Link} to={`/reports`} onClick={handleLinkClick}>
                            <ListItemText primary="Report" sx={{ color: '#2D3748' }} />
                        </ListItem>
                       
                    </>
                )}

                {scope === 'customer' && (
                    <>
                        <ListItem button component={Link} to="/stores" onClick={handleLinkClick}>
                            <ListItemText primary="Home" sx={{ color: '#2D3748' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/orders" onClick={handleLinkClick}>
                            <ListItemText primary="My Orders" sx={{ color: '#2D3748' }} />
                        </ListItem>
                    </>
                )}

                {scope === 'delivery_partner' && (
                    <ListItem button component={Link} to="/deliveries" onClick={handleLinkClick}>
                        <ListItemText primary="Deliveries" sx={{ color: '#2D3748' }} />
                    </ListItem>
                )}

                {/* Common links */}
                <ListItem button component={Link} to="/about" onClick={handleLinkClick}>
                    <ListItemText primary="About" sx={{ color: '#2D3748' }} />
                </ListItem>

                {/* Sign Out List Item */}
                <ListItem button onClick={() => { logout(navigate); onClose(); }}>
                    <LogoutIcon sx={{ marginRight: 1, color: '#F44336' }} /> {/* Soft red sign-out icon */}
                    <ListItemText primary="Sign Out" sx={{ color: '#2D3748' }} />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;

