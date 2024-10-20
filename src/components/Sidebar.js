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
    ListItemIcon,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNavigate } from 'react-router-dom';
import { getToken, getUserFromToken, logout, decodeToken } from '../utils/auth';

const Sidebar = ({ open, onClose, toggleTheme, isDarkMode }) => {
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
                    width: '100%',
                    padding: '16px',
                },
            }}
        >
            {/* Close button at top left */}
            <Box display="flex" justifyContent="flex-start">
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ backgroundColor: '#A0AEC0', marginBottom: 2 }} />

            {/* Navigation List */}
            <List>
                {/* Profile item */}
                <ListItem>
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={user?.name} sx={{ color: '#2D3748' }} />
                </ListItem>

              

                {scope === 'owner' && (
                    <>
                        <ListItem button component={Link} to={`/mystore/${user?.id}`} onClick={handleLinkClick}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" sx={{ color: '#2D3748' }} />
                        </ListItem>
                        <ListItem button component={Link} to={`/reports`} onClick={handleLinkClick}>
                            <ListItemIcon>
                                <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="Report" sx={{ color: '#2D3748' }} />
                        </ListItem>
                    </>
                )}

                {scope === 'customer' && (
                    <>
                        <ListItem button component={Link} to="/stores" onClick={handleLinkClick}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" sx={{ color: '#2D3748' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/orders" onClick={handleLinkClick}>
                            <ListItemIcon>
                                <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="My Orders" sx={{ color: '#2D3748' }} />
                        </ListItem>
                    </>
                )}

                {scope === 'delivery_partner' && (
                    <ListItem button component={Link} to="/deliveries" onClick={handleLinkClick}>
                        <ListItemIcon>
                            <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Deliveries" sx={{ color: '#2D3748' }} />
                    </ListItem>
                )}

                {/* About link */}
                <ListItem button component={Link} to="/about" onClick={handleLinkClick}>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="About" sx={{ color: '#2D3748' }} />
                </ListItem>

                {/* Dark Mode/Light Mode Toggle */}
                <ListItem button onClick={toggleTheme}>
                    <ListItemIcon>
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </ListItemIcon>
                    <ListItemText
                        primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        sx={{ color: '#2D3748' }}
                    />
                </ListItem>

                {/* Sign Out */}
                <ListItem button onClick={() => { logout(navigate); onClose(); }}>
                    <ListItemIcon>
                        <LogoutIcon sx={{ color: '#F44336' }} />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" sx={{ color: '#2D3748' }} />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;

