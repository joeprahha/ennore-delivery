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
    Divider,useTheme,
        Button,
    Chip
} from '@mui/material';
import ItemCard from './Components/ItemCard'; // Adjust the import based on your file structure
import ClearIcon from '@mui/icons-material/Clear';

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
  const theme = useTheme();

    const { storeId } = useParams();
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [storeInfo, setStoreInfo] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchFocus = () => {
        setIsSearching(true);
    };

    const handleSearchClear = () => {
        setSearchTerm('');
        setIsSearching(false);
    };
    const [cart, setCart] = useState(getCartFromLocalStorage() || {storeId, storeName: storeInfo.name, items: [] });
	const goToCartButton =()=> JSON.parse(localStorage.getItem('cart'))?.items.length ? true :false
    const addToCart = (item) => {
        const existingCart = JSON.parse(localStorage.getItem('cart'));
        
        if (!existingCart || existingCart.storeId !== storeId) {
 const userConfirmed = window.confirm(
        'You can create an order for one store at a time. Is that okay to clear the cart and add the new item?'
    );
    
    if (!userConfirmed) {
        return; // Exit if the user does not confirm
    }
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
    ? Object.entries(menuItems).reduce((acc, [category, { available, items }]) => {
        if (available) {
            items.forEach((item) => {
                if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    acc.push(item);
                }
            });
        }
        return acc;
    }, [])
    : menuItems[Object.keys(menuItems)[activeTab]]?.available ? menuItems[Object.keys(menuItems)[activeTab]]?.items || [] : [];

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

 useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find the index of the category that is intersecting
        const index = categoryRefs.current.indexOf(entry.target);
        if (index !== -1 && activeTab !== index) {
          setActiveTab(index); // Set the active tab based on the category index
        }
      }
    });
  }, {
    threshold: 0.5,  // This means at least 50% of the category should be visible to trigger the observer
  });

  // Observe all category elements
  categoryRefs.current.forEach(ref => {
    if (ref) observer.observe(ref);
  });

  return () => {
    observer.disconnect();  // Cleanup the observer when the component is unmounted or dependencies change
  };
}, [menuItems, activeTab,categoryRefs]);  // Add activeTab and menuItems as dependencies


    return (
        <Box sx={{ width: '100%', p: 0 }}>
            {loading ? (
                <BikeLoader />
            ) : (
                <>
                   
                    <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                zIndex: 10,
 backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff', 
                pt: 1,
            }}
        >
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', height: '50px' }}>
                <IconButton onClick={() => navigate('/stores')} sx={{}}>
                    <ArrowBackIcon />
                </IconButton>

                {/* Conditionally render either the store name or search bar */}
                {isSearching ? (
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            transition: 'width 0.3s ease-in-out', // Slide-in transition
                        }}
                    >
                        <TextField
                            variant="outlined"
                            autoFocus
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={handleSearchFocus}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleSearchClear}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: '100%', // Initially full width for search bar when focused
                                pr: 1,
                                transition: 'width 0.3s ease-in-out',
                            }}
                            placeholder={`Search items in "${storeInfo?.name}"`}
                        />
                    </Box>
                ) : (
                    <>
                       <Box sx={{ display: 'flex', alignItems: 'center', p: 1, flexGrow: 1 }}>
    {/* Display the logo or fallback to the image */}
    {storeInfo.logo || storeInfo.image ? (
        <img
            src={storeInfo.logo || storeInfo.image}
            alt="store icon"
            style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 7 }}
        />
    ) : null}
    
    {/* Display the store name */}
    <Typography variant="h6">{storeInfo?.name}</Typography>
</Box>
                        <IconButton onClick={handleSearchFocus} sx={{ p: 1, mr: 2 }}>
                            <SearchIcon />
                        </IconButton>
                    </>
                )}
            </Box>
        
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
                            <IconButton sx={{  flexShrink: 0 }} onClick={toggleDrawer(true)}>
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
                                {Object.keys(menuItems).filter(c=>menuItems[c]?.available).map((category, index) => (
                                    <Tab label={category} key={index} />
                                ))}
                            </Tabs>

                        </Box>}
                    </Box>

   <>
   {
  !searchTerm ? (
    Object.keys(menuItems).filter(c=>menuItems[c]?.available).map((category, index) => (
      <Box
        key={index}
        id={`category-${index}`}
        sx={{  mt: 2,width:'100%' }}
        ref={el => (categoryRefs.current[index] = el)}  // Ensure ref is assigned properly
      >
        <Box
          sx={{
            position: 'sticky',
            top: 96,
 	    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff', 
            pt: 1,
            zIndex: 8,
          
            color:'inherit',
            width:'100%'
          }}
        >
          <Typography variant="subtitle2" align="left" sx={{ mb: 1, fontSize: '1rem', pl:1,
           }}>
            {category}
          </Typography>
          <Divider sx={{ width: '100%' }} />
        </Box>
        <Grid container spacing={2}>
        {menuItems[category].available && 
  menuItems[category].items
    .filter((item) => item.available)
    .map((item) => (
      <ItemCard
        key={item.id}
        item={item}
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        handleOpenModal={handleOpenModal}
        storeStatus={storeInfo}
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
          navigate={navigate}
          storeStatus={storeInfo}
        />
      ))}
    </Grid>
  )
}

   </>


                    {
                        <ItemDetailModal
                            open={modalOpen}
                            onClose={handleCloseModal}
                            item={selectedItem}
                            storeInfo={storeInfo}
                            cart={cart}
                            setCart={setCart}
                            addToCart={addToCart}
                        />
                    }

                    <SwipeableDrawer
                        anchor="bottom"
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                        onOpen={toggleDrawer(true)}
                        sx={{
                            '& .MuiDrawer-paper': {
                                height: '80%',
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
                              {  Object.keys(menuItems).filter(c=>menuItems[c]?.available).map((category, index) => (
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
                          
                        </Box>
                    </SwipeableDrawer>
                </>
            )}
                                {goToCartButton ? <GoToOrdersButton cart={cart} /> : null}
                                
                                {!storeInfo?.fssai &&
<Box sx={{ padding: 2 }}>
  <Paper elevation={0} sx={{ padding: 2, fontSize: '0.75rem' ,backgroundColor:'rgba(95, 37, 159, 0.05)'}}>
    {/* Store Name Section */}
    <Box display="flex" flexDirection="column" marginBottom={1}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary",fontSize: '0.75rem'  }}>
        {storeInfo?.name || "Store Name"}
      </Typography>
    </Box>

    {/* FSSAI Section */}
    <Box display="flex" alignItems="center" marginBottom={1}>
      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500,fontSize: '0.75rem'  }}>
        FSSAI: {storeInfo?.fssai || "N/A"}
      </Typography>
    </Box>

    {/* Phone Section */}
    <Box display="flex" alignItems="center">
      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 ,fontSize: '0.75rem' }}>
        Phone: {storeInfo?.phone || "N/A"}
      </Typography>
    </Box>

    {/* Add other sections as needed */}
  </Paper>
</Box>}
       <Box sx={{height:'80px'}}/>
        </Box>
    );
};

export default StoreDetail;

