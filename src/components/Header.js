import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge,Tooltip,Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../context/AuthContext';
import { logout, getToken } from '../utils/auth';
import { getCartFromLocalStorage } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';

const Header = ({ onMenuClick,isDarkMode }) => {
    const navigate = useNavigate();
    const cart = getCartFromLocalStorage();
    const totalItemsInCart = cart?.length || 0;

    const handleLogout = () => {
        logout(navigate);
    };

    return (
       <>
    {/* Changed position to "fixed" */}
    <AppBar position="fixed">
        <Toolbar>
          
            {getToken() ? (
                        <>
            {/* Menu Icon */}
            <Tooltip title="Menu">
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>
            </Tooltip>

            {/* Title */}
            <Box style={{ flexGrow: 1 }}>
            <img
           	   
                    src="/img2.png" // Replace with the correct path to your logo image
                    alt="Logo"
                    style={{ height: '38px', marginLeft: '8px',filter: !isDarkMode && 'invert(1)' }} // Adjust height and margin as needed
                />
            </Box>
           

            {/* Home Icon */}
            <Tooltip title="Home">
                <IconButton color="inherit" sx={{mr:1}} onClick={() => navigate('/')}>
                    <HomeIcon />
                </IconButton>
            </Tooltip>

            {/* Order History Icon */}
            <Tooltip title="Order History">
                <IconButton color="inherit" sx={{mr:1}} onClick={() => navigate('/orders')}>
                    <HistoryIcon />
                </IconButton>
            </Tooltip>

            {/* Cart Icon */}
            <Tooltip title="Cart">
                <IconButton color="inherit"  onClick={() => navigate('/cart')}>
                    <Badge badgeContent={totalItemsInCart} color="secondary">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
        </>

            ): <Box style={{ flexGrow: 1 }}>
            <img
           	   
                    src="/img2.png" // Replace with the correct path to your logo image
                    alt="Logo"
                    style={{ height: '38px', marginLeft: '8px',filter: !isDarkMode && 'invert(1)' }} // Adjust height and margin as needed
                />
            </Box>
           }
        </Toolbar>
    </AppBar>

    {/* This div adds top padding equal to the height of the AppBar (usually 64px) */}
    <div style={{ paddingTop: '64px' }} />
</>

    );
};

export default Header;

