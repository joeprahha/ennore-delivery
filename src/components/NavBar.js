import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const showBottomNav = true; //['/', '/stores', '/cart', '/account'].includes(location.pathname);
    const [value, setValue] = useState(location.pathname);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
        //    setVisible(false); // Scrolling down
        } else {
         //   setVisible(true); // Scrolling up
        }
      //  setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const handleNavigation = (path) => {
        setValue(path);
        navigate(path);
    };

    if (!showBottomNav) return null; // Don't render if not in the allowed routes

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => handleNavigation(newValue)}
            showLabels
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '46px', // Adjust the height of the navbar
                transition: 'transform 0.3s ease',
                transform: visible ? 'translateY(0)' : 'translateY(100%)',
                boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)', // Box shadow on top
                zIndex:'99999'
            }}
        >
            <BottomNavigationAction
                label="Home"
                icon={<HomeIcon  sx={{ fontSize: '1.2rem' }} />}
                value="/stores"
                sx={{
                    color: value === '/stores' ? 'primary.main' : 'text.secondary',

                    typography: 'caption', // Use typography for consistency
                    fontSize: '0.55rem', // Label font size
                  
                }}
            />
             <BottomNavigationAction
                label="Orders"
                icon={<HistoryOutlinedIcon sx={{ fontSize: '1.2rem' }}/>}
                value="/orders"
                sx={{
                    color: value === '/orders' ? 'primary.main' : 'text.secondary',
                    typography: 'caption',
                    fontSize: '0.55rem',
                   
                }}
            />
            <BottomNavigationAction
                label="Cart"
                icon={<ShoppingCartIcon sx={{ fontSize: '1.2rem' }}/>}
                value="/cart"
                sx={{
                    color: value === '/cart' ? 'primary.main' : 'text.secondary',
                    typography: 'caption',
                    fontSize: '0.55rem',
                    
                }}
            />
            <BottomNavigationAction
                label="Profile"
                icon={<PersonIcon sx={{ fontSize: '1.2rem' }}/>}
                value="/account"
                sx={{
                    color: value === '/account' ? 'primary.main' : 'text.secondary',
                    typography: 'caption',
                    fontSize: '0.55rem',
                   
                }}
            />
        </BottomNavigation>
    );
};

export default NavBar;

