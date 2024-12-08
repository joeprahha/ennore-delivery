import React from 'react';
import { AppBar, Toolbar, IconButton, Box,Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import { logout, getToken } from '../utils/auth';
import { getCartFromLocalStorage } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';

  
  const autoSubscribeUser = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

  // Request permission automatically
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "BLnfXuZSh8hEocFxQ_ALGHpdN3nYS3mhy5kRp0ACebDsRA-qGHS9zwoBDKA9prktGdH_B6wiYLImAEbkc4jhS1c", // Replace with your VAPID public key
  });

  // Send subscription to your backend


  console.log("User subscribed automatically!",subscription);
};
const Header = ({ onMenuClick, isDarkMode }) => {
    const navigate = useNavigate();
    const cart = getCartFromLocalStorage();
    const totalItemsInCart = cart?.length || 0;

    const handleLogout = () => {
        logout(navigate);
    };
    autoSubscribeUser()

    return (
       <AppBar position="static" sx={{ backgroundColor: 'inherit', color: 'primary.main' }} elevation={0}>
    <Toolbar>
        {getToken() && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
                <MenuIcon />
            </IconButton>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
           <img
    onClick={() => navigate('/')}
    src="/img2.png" // Replace with the correct path to your logo image
    alt="Logo"
    style={{
        height: '38px',
        marginRight: '15px',
        filter: !isDarkMode && 'invert(1) ', // Combine filters conditionally
    }}
/>

        </Box>



        {/* Other icons can be added here, e.g., shopping cart, profile, etc. */}
    </Toolbar>
</AppBar>
    );
};

export default Header;

