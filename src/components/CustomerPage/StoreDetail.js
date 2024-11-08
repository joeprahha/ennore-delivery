import React, { useEffect, useState, useRef,useCallback } from 'react';
import {
    Box,
    TextField,
    Typography,
    IconButton,
    Paper,
    InputAdornment,
    Grid,
    Tabs,
    Tab,
    AppBar,
    SwipeableDrawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Chip
} from '@mui/material';
import ItemCard from './Components/ItemCard'; // Adjust the import based on your file structure

import { GoToOrdersButton } from './Components/GoToOrdersButton';
import BikeLoader from '../../loader/BikeLoader';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { isTokenValid, logout } from '../../utils/auth';
import { api } from '../../utils/api';
import ItemDetailModal from './Components/ItemModal';
import { getCartFromLocalStorage } from '../../utils/localStorage';
import MenuIcon from '@mui/icons-material/Menu';
import QuantityButton from './Components/QuantityButton'

const StoreDetail = () => {
    const { storeId } = useParams();
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [storeInfo, setStoreInfo] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    
    const [cart, setCart] = useState(getCartFromLocalStorage() || {storeId, storeName: storeInfo.name, items: [] });
	const goToCartButton =()=> JSON.parse(localStorage.getItem('cart'))?.items.length ? true :false
    const addToCart = (item) => {
        const existingCart = JSON.parse(localStorage.getItem('cart'));
        
        if (!existingCart || existingCart.storeId !== storeId) {
            const newCart = {
                storeId,
                storeName: storeInfo.name,
                items: [{ ...item, count: 1 }]
            };
            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
        } else {
            const existingItem = existingCart.items.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.count += 1;
                setCart({ ...existingCart });
                localStorage.setItem('cart', JSON.stringify(existingCart));
            } else {
                existingCart.items.push({ ...item, count: 1 });
                setCart({ ...existingCart });
                localStorage.setItem('cart', JSON.stringify(existingCart));
            }
        }
    };

    const incrementItemCount = (item) => {
        const existingItem = cart.items.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.count += 1;
            setCart({ ...cart, items: [...cart.items] });
            localStorage.setItem('cart', JSON.stringify({ ...cart, items: [...cart.items] }));
        }
    };

    const decrementItemCount = (item) => {
        const existingItem = cart.items.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            if (existingItem.count > 1) {
                existingItem.count -= 1;
            } else {
                cart.items = cart.items.filter(cartItem => cartItem.id !== item.id);
            }
            setCart({ ...cart, items: [...cart.items] });
            localStorage.setItem('cart', JSON.stringify({ ...cart, items: [...cart.items] }));
        }
    };
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const navigate = useNavigate();
    const categoryRefs = useRef([]);

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    const fetchMenu = async () => {
        try {
            const response = await api.get(`menus/${storeId}`);
            setMenuItems(response.data);
            const storeResponse = await api.get(`stores/${storeId}`);
            setStoreInfo(storeResponse.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isTokenValid()) {
            logout(navigate);
        }
        fetchMenu();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        const categoryElement = document.getElementById(`category-${newValue}`);
        if (categoryElement) {
            const stickyHeaderHeight = 80;
            const elementOffset = categoryElement.getBoundingClientRect().top + window.scrollY; 
            const centerPosition = elementOffset - (window.innerHeight / 2) + (categoryElement.clientHeight / 2) + stickyHeaderHeight;

            window.scrollTo({
                top: centerPosition,
                behavior: 'smooth'
            });
        }
    };

    const filteredItems = searchTerm
        ? Object.keys(menuItems).reduce((acc, category) => {
            menuItems[category].forEach(item => {
                if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    acc.push(item);
                }
            });
            return acc;
        }, [])
        : (menuItems[Object.keys(menuItems)[activeTab]] || []);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = categoryRefs.current.indexOf(entry.target);
                    if (index !== -1) {
                        setActiveTab(index);
                    }
                }
            });
        }, {
            threshold: 0.5
        });

        categoryRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
        };
    }, [menuItems]);

    return (
        <Box sx={{ width: '100%', p: 0 }}>
            {loading ? (
                <BikeLoader />
            ) : (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                        
                        <Typography variant="h6">{storeInfo?.name}</Typography>
                    </Box>

                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            flexDirection: 'column',
                            position: 'sticky', 
                            top: 0, 
                            zIndex: 10, 
                            backgroundColor: '#fff', 
                            pt: 1, 
                        }}
                    >
                      <Box sx={{display:'flex',width:'100%'}}>  
				<IconButton onClick={() => navigate('/stores')} sx={{ }}>
                            <ArrowBackIcon />
                        </IconButton>
				<TextField
                            variant="outlined"
                            size="small"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: '95%',pr:1	 }}
                            placeholder={`Search items in "${storeInfo?.name}"`}
                        /> </Box>
                       {searchTerm?
                       
                       <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                width: '100%', 
                                overflow: 'hidden', 
                            }}
                        >
				 <Typography variant="h6" align="left"  sx={{ m: 2}}>
			    {'Search Results :'}
			  </Typography>
			</Box>
                       
                       
                       :<Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                width: '100%', 
                                overflow: 'hidden', 
                            }}
                        >
                            <IconButton sx={{ color: 'inherit', flexShrink: 0 }} onClick={toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{ 
                                    overflowX: 'auto', 
                                    flexGrow: 1, 
                                    flexShrink: 1, 
                                    minHeight: '48px', 
                                }} 
                            >
                                {Object.keys(menuItems).map((category, index) => (
                                    <Tab label={category} key={index} />
                                ))}
                            </Tabs>

                        </Box>}
                    </Box>

                <>
  {!searchTerm ? (
    Object.keys(menuItems).map((category, index) => (
      <Box key={index} id={`category-${index}`} sx={{ p: 1, mt: 2 }} ref={el => (categoryRefs.current[index] = el)}>
        <Box
          sx={{
            position: 'sticky',
            top: 96,
            backgroundColor: 'white',
            pt: 1,
            zIndex: 8,
          }}
        >
          <Typography variant="subtitle2" align="left" id={`category-${index}`} sx={{ mb: 1,fontSize:'1rem' }}>
            {category}
          </Typography>
          <Divider />
        </Box>
        <Grid container spacing={2}>
          {menuItems[category].map(item => (
            <ItemCard
              key={item.id}
              item={item}
              cart={cart}
              setCart={setCart}
              addToCart={addToCart}
              handleOpenModal={handleOpenModal}
            />
          ))}
        </Grid>
      </Box>
    ))
  ) : (
    <Grid container spacing={2}>
      {filteredItems.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          cart={cart}
          setCart={setCart}
          addToCart={addToCart}
          handleOpenModal={handleOpenModal}
        />
      ))}
    </Grid>
  )}
</>


                    {false && (
                        <ItemDetailModal
                            open={modalOpen}
                            onClose={handleCloseModal}
                            item={selectedItem}
                            storeInfo={storeInfo}
                            cart={cart}
                            setCart={setCart}
                        />
                    )}

                    <SwipeableDrawer
                        anchor="bottom"
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                        onOpen={toggleDrawer(true)}
                        sx={{
                            '& .MuiDrawer-paper': {
                                height: '85%',
                                bottom: 0,
                                borderRadius: '16px 16px 0 0',
                            },
                        }}
                    >
                        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <IconButton onClick={toggleDrawer(false)}>
                                    <CloseIcon />
                                </IconButton>
                                <Typography variant="h6" sx={{ ml: 1 }}>Select Category</Typography>
                            </Box>
                            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                {Object.keys(menuItems).map((category, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem button onClick={() => {
                                            handleTabChange(null, index);
                                            toggleDrawer(false)();
                                        }}>
                                            <ListItemText primary={category} />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                            <Box sx={{ mt: 'auto', mb: 2 }}>
                                <Button fullWidth variant="contained" onClick={toggleDrawer(false)}>
                                    DISMISS
                                </Button>
                            </Box>
                        </Box>
                    </SwipeableDrawer>
                </>
            )}
                                {goToCartButton ? <GoToOrdersButton cart={cart} /> : null}
       <Box sx={{height:'80px'}}/>
        </Box>
    );
};

export default StoreDetail;

