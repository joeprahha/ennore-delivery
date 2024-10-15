import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../context/AuthContext';
import { logout, getToken } from '../utils/auth';
import { getCartFromLocalStorage } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';

const Header = ({ onMenuClick }) => {
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
            {getToken() && (
                <>
                    {/* Menu Icon */}
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
                        <MenuIcon />
                    </IconButton>

                    {/* Title */}
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Store App
                    </Typography>

                    {/* Home Icon */}
                    <IconButton color="inherit" onClick={() => navigate('/')}>
                        <HomeIcon />
                    </IconButton>

                    {/* Order History Icon */}
                    <IconButton color="inherit" onClick={() => navigate('/orders')}>
                        <HistoryIcon />
                    </IconButton>

                    {/* Cart Icon */}
                    <IconButton color="inherit" onClick={() => navigate('/cart')}>
                        <Badge badgeContent={totalItemsInCart} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </>
            )}
        </Toolbar>
    </AppBar>

    {/* This div adds top padding equal to the height of the AppBar (usually 64px) */}
    <div style={{ paddingTop: '64px' }} />
</>

    );
};

export default Header;

