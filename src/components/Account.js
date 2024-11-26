import React,{useEffect,useState} from 'react';
import { Container, Typography, Paper, Button, Box, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { getUserInfo,setUserInfo } from '../utils/localStorage';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {  logout } from '../utils/auth';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import { api } from '../utils/api';

const required =   <Typography
            variant="body1"
            sx={{
                marginLeft: 1,
                fontSize: '0.8rem',
                color: 'red',
                animation: 'blink 0.5s step-start infinite',
                '@keyframes blink': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0 },
                    '100%': { opacity: 1 }
                }
            }}
        >
            Required
        </Typography>
        
        export function useAddToHomescreenPrompt() {
  const [promptEvent, setPromptEvent] = React.useState(null);

  const promptToInstall = () => {
    if (promptEvent) {
      return promptEvent.prompt();
    }
    return Promise.reject(
      new Error("Tried installing before the browser sent the 'beforeinstallprompt' event.")
    );
  };

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent default display of the prompt
      setPromptEvent(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return [promptEvent, promptToInstall];
}

const Account = ({toggleTheme,isDarkMode}) => {


    const navigate = useNavigate();
const[address,setAddress]=React.useState(getUserInfo()||{})

 const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener("appinstalled", checkIfInstalled);
    checkIfInstalled(); // Run on initial load

    return () => {
      window.removeEventListener("appinstalled", checkIfInstalled);
    };
  }, []);


    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleOrdersClick = () => {
        navigate('/orders');
    };
const handleAboutClick=()=>{
        navigate('/about');
}
    const handleLogout = () => {
    	logout()
    };




    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
        
         <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mt: 2,mb:2 }} onClick={handleProfileClick}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1,flexDirection:'column' }}>
                 <AccountCircleIcon  sx={{ fontSize:'5rem',color:'text.secondary'}}/>
                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ marginLeft: 1,flex:1 }}>Profile</Typography>

                   </Box>
                <Typography variant="body1" align="right" onClick={handleProfileClick} sx={{ mr:1,color:'blue',fontSize:"0.75rem" }}>Edit</Typography>
                     </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }}>

                    <Typography variant="subtitle2" sx={{ marginLeft: 1, fontWeight: 500, fontSize: '0.8rem' }}>
                        Name:
                    </Typography>
                   {address.name ? (
        <Typography variant="body1" sx={{ marginLeft: 1, fontSize: '0.8rem' }}>
            {address.name}
        </Typography>
    ) :required
    }
                </Box>

                
                <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }}>
               
                    <Typography variant="subtitle2" sx={{ marginLeft: 1, fontWeight: 500, fontSize: '0.8rem' }}>
                        Phone:
                    </Typography>
                     {address.phone ? (
        <Typography variant="body1" sx={{ marginLeft: 1, fontSize: '0.8rem' }}>
            {address.phone}
        </Typography>
    ) :required
    }
                </Box>

                
                 <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }}>

                    <Typography variant="subtitle2" sx={{ marginLeft: 1, fontWeight: 500, fontSize: '0.8rem' }}>
                        Address:
                    </Typography>
                     {address.address1 ? (
        <Typography variant="body1" sx={{ marginLeft: 1, fontSize: '0.8rem' }}>
            {address.address1}, {address.local}
        </Typography>
    ) :required
    }
                </Box>
                <Divider />
               
               
            </Paper>
           
            <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
                <List>
                    <ListItem button onClick={handleProfileClick}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={handleOrdersClick}>
                        <ListItemIcon>
                            <ReceiptIcon />
                        </ListItemIcon>
                        <ListItemText primary="Your Orders" />
                    </ListItem>
                </List>
            </Paper>
            

 	<Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
    <Typography variant="h6" sx={{ mb: 1 }}> Ennore Delivery settings</Typography>
    <List >
         <ListItem button onClick={toggleTheme}>
                    <ListItemIcon>
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </ListItemIcon>
                    <ListItemText
                        primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        sx={{ color: '#2D3748' }}
                    />
                </ListItem>
        <Divider />
        <ListItem button onClick={handleAboutClick}>
            <ListItemIcon>
                <InfoOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
        </ListItem>
                <Divider />
         <ListItem button onClick={()=>{navigate('/tc')}}>
            <ListItemIcon>
                <SummarizeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Terms & Conditions" />
        </ListItem>
                        <Divider />
         {prompt && <ListItem button onClick={promptToInstall} >
            <ListItemIcon>
                <MobileFriendlyIcon />
            </ListItemIcon>
            <ListItemText primary="Add to Home Screen" />
        </ListItem>	
        }
    </List>
</Paper>


           

            <Button
                variant="contained"
                color="secondary"
                onClick={()=>logout(navigate)}
                sx={{ mt: 3, width: '100%' }}
            >
                Logout
            </Button>
            
            <Box sx={{height:'80px'}}/>
        </Container>
    );
};

export default Account;

