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
    ListItemIcon,AppBar,Toolbar
} from '@mui/material';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNavigate } from 'react-router-dom';
import { getToken, getUserFromToken, logout, decodeToken } from '../utils/auth';

    const user = getUserFromToken(getToken());

const obj = {
  customer: [
    { label: "Home", link: "/stores", icon: <HomeIcon /> },
    { label: "My Orders", link: "/orders", icon: <HistoryIcon /> },
  ],
  owner: [
    { label: "My Store", link: `/mystore/${user?.id}`, icon: <HomeIcon /> },
    { label: "Report", link: `/reports`, icon: <HistoryIcon /> },
  ],
  deliveryPartner: [
    { label: "Deliveries", link: "/deliveries", icon: <HistoryIcon /> },
  ],
  god: []
};


obj.god = [
    { label: "Management System", link: "/ms", icon: <HistoryIcon /> },	
  ...obj.customer,
  ...obj.owner,
  ...obj.deliveryPartner,
];


const Sidebar = ({ open, onClose, toggleTheme, isDarkMode }) => {
    const navigate = useNavigate();

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
                },
            }}
        >
      
          <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="close" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <img
                        src="/img2.png" // Replace with the correct path to your logo image
                        alt="Logo"
                        style={{ height: '38px',marginRight:'15px', filter: !isDarkMode && 'invert(1)' }} // Adjust height as needed
                    />
                </Box>

                {/* Other icons can be added here, e.g., shopping cart, profile, etc. */}
            </Toolbar>
        </AppBar>

            <Divider sx={{ backgroundColor: '#A0AEC0', marginBottom: 2 }} />

            {/* Navigation List */}
            <List>
                {/* Profile item */}
                <ListItem button component={Link} to={`/profile`} onClick={handleLinkClick}>
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={user?.name} sx={{ color: '#2D3748' }} />
                </ListItem>

             {
             
  scope &&obj[scope]?.map((comps) => (
    <ListItem button component={Link} to={comps.link} onClick={handleLinkClick} key={comps.label}>
      <ListItemIcon>
        {comps.icon}
      </ListItemIcon>
      <ListItemText primary={comps.label} sx={{ color: '#2D3748' }} />
    </ListItem>
  ))
}


              

                {/* About link */}
                <ListItem button component={Link} to="/about" onClick={handleLinkClick}>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="About" sx={{ color: '#2D3748' }} />
                </ListItem>
                
                 <ListItem button component={Link} to="/tc" onClick={handleLinkClick}>
                    <ListItemIcon>
                        <SummarizeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Term & Condition" sx={{ color: '#2D3748' }} />
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

