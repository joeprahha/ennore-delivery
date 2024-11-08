import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    AppBar,
    Toolbar,
    Slide,
    Tabs,
    Tab,
    List,
    Menu,
    MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ItemList from './ItemList'; // Make sure the path is correct
import { GoToOrdersButton } from './GoToOrdersButton';

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="left" ref={ref} {...props} />;
});

const StoreCategoryListModal = ({ open, onClose, menuItems = {}, handleItemClick, storeName,goToCartButton ,cart}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (open) {
            setSelectedTab(0); // Default to the first tab when modal opens
        }
    }, [open]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleCategorySelect = (index) => {
        setSelectedTab(index);
        handleCloseMenu();
    };

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
            <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000', zIndex: 9 }}>
                <Toolbar>
                    <IconButton 
                        edge="start" 
                        color="inherit" 
                        onClick={onClose}
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '50%',
                            '&:hover': {
                                backgroundColor: 'darkgrey',
                            },
                            mr: 2
                        }} 
                        aria-label="close" 
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        {storeName}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ height: '100vh', overflowY: 'auto' }}>
                {/* Sticky Header for Menu Icon and Tabs */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        position: 'sticky', 
                        top: 0, 
                        zIndex: 10, 
                        backgroundColor: '#fff', 
                        pt: 0.5, 
                    }}
                >
                    <IconButton onClick={handleMenuClick} sx={{ color: 'inherit' }}>
                        <MenuIcon />
                    </IconButton>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ flexGrow: 1 }}
                    >
                        {Object.keys(menuItems).map((category) => (
                            <Tab key={category} label={category} sx={{ minWidth: '100px' }} />
                        ))}
                    </Tabs>
                </Box>

                {/* Dropdown Menu for Categories */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                >
                    {Object.keys(menuItems).map((category, index) => (
                        <MenuItem key={category} onClick={() => handleCategorySelect(index)}>
                            {category}
                        </MenuItem>
                    ))}
                </Menu>

                {/* List of Items for the Selected Category */}
                <Box>
                    {Object.keys(menuItems).map((category, index) => (
                        <Box
                            key={category}
                            role="tabpanel"
                            hidden={selectedTab !== index}
                            sx={{ mb: 3 }}
                        >
                            {selectedTab === index && (
                                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                    <ItemList items={menuItems[category]} handleItemClick={handleItemClick} />
                                </List>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
                    {goToCartButton ? <GoToOrdersButton cart={cart} /> : null}
		<Box sx={{height:'80px'}}/>
        </Dialog>
    );
};

export default StoreCategoryListModal;

