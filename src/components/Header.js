import React from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import { logout, getToken } from '../utils/auth';
import { getCartFromLocalStorage } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick, isDarkMode }) => {
    const navigate = useNavigate();
    const cart = getCartFromLocalStorage();
    const totalItemsInCart = cart?.length || 0;

    const handleLogout = () => {
        logout(navigate);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {getToken() && (
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
                        <MenuIcon />
                    </IconButton>
                )}
                
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }} onClick={()=>navigate('/')}>
                    <img
                        src="/img2.png" // Replace with the correct path to your logo image
                        alt="Logo"
                        style={{ height: '38px',marginRight:'15px', filter: !isDarkMode && 'invert(1)' }} // Adjust height as needed
                    />
                </Box>

                {/* Other icons can be added here, e.g., shopping cart, profile, etc. */}
            </Toolbar>
        </AppBar>
    );
};

export default Header;

