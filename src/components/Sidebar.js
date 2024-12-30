import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Divider,
  ListItemIcon,
  AppBar,
  Toolbar,
  Typography
} from "@mui/material";
import {
  Share as ShareIcon,
  Close as CloseIcon,
  Summarize as SummarizeIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  Logout as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getToken, getUserFromToken, logout, decodeToken } from "../utils/auth";
import { getUserInfo } from "../utils/localStorage";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Sidebar = ({ open, onClose, toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const user = getUserInfo() || getUserFromToken(getToken());
  const { scope } = decodeToken();

  // Sidebar menu items based on user scope
  const menuItems = {
    customer: [
      { label: "Home", link: "/stores", icon: <HomeIcon /> },
      { label: "My Orders", link: "/orders", icon: <HistoryIcon /> }
    ],
    owner: [
      { label: "My Store", link: "/mystore", icon: <HomeIcon /> },
      { label: "Home", link: "/stores", icon: <HomeIcon /> },
      { label: "Porter", link: "/assign-driver", icon: <LocationOnIcon sx={{color:"#0446DB"}}/> }
    ],
    deliveryPartner: [
      { label: "Deliveries", link: "/deliveries", icon: <HistoryIcon /> },
      { label: "Porter Assignments", link: "/porter-assignments", icon: <LocationOnIcon sx={{color:"#0446DB"}}/> }
    ],
    god: []
  };

  // Extend god's menu items
  menuItems.god = [
    { label: "Management System", link: "/ms", icon: <HistoryIcon /> },
    ...menuItems.customer,
    ...menuItems.owner,
    ...menuItems.deliveryPartner
  ];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Ennore Delivery",
          text: "Check out Ennore Delivery!",
          url: "https://ennore-delivery.netlify.app"
        });
      } else {
        alert("Sharing is not supported on this device.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "80%"
        }
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
            <Typography variant="h6" noWrap>
              Menu
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Divider sx={{ backgroundColor: "#A0AEC0", marginBottom: 2 }} />

      <List>
        {/* Profile */}
        <ListItem button component={Link} to="/profile" onClick={onClose}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={user?.name} sx={{ color: "#2D3748" }} />
        </ListItem>

        {/* Dynamic menu items based on user scope */}
        {scope &&
          menuItems[scope]?.map((item) => (
            <ListItem
              button
              component={Link}
              to={item.link}
              onClick={onClose}
              key={item.label}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{ color: "#2D3748" }} />
            </ListItem>
          ))}

        {/* Static Links */}
        <ListItem button component={Link} to="/about" onClick={onClose}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" sx={{ color: "#2D3748" }} />
        </ListItem>

        <ListItem button component={Link} to="/tc" onClick={onClose}>
          <ListItemIcon>
            <SummarizeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Terms & Conditions"
            sx={{ color: "#2D3748" }}
          />
        </ListItem>

        {/* Theme Toggle */}
        <ListItem button onClick={toggleTheme}>
          <ListItemIcon>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText
            primary={isDarkMode ? "Light Mode" : "Dark Mode"}
            sx={{ color: "#2D3748" }}
          />
        </ListItem>

        {/* Share Button */}
        <ListItem
          button
          onClick={() => {
            handleShare();
            onClose();
          }}
        >
          <ListItemIcon>
            <ShareIcon sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText
            primary="Share"
            sx={{ fontweight: 500, color: "primary.main" }}
          />
        </ListItem>

        {/* Sign Out */}
        <ListItem
          button
          onClick={() => {
            logout(navigate);
            onClose();
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: "#F44336" }} />
          </ListItemIcon>
          <ListItemText primary="Sign Out" sx={{ color: "#2D3748" }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
