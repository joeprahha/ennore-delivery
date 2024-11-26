import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,

    InputAdornment,

    IconButton,
} from '@mui/material';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { useNavigate } from 'react-router-dom';
import BikeLoader from '../../loader/BikeLoader';
import { isTokenValid, logout } from '../../utils/auth';
import { api } from '../../utils/api';
import SearchIcon from '@mui/icons-material/Search';



import StoreCategoryListModal from './Components/StoreCategoryList';
import { getCartFromLocalStorage } from '../../utils/localStorage';
import { GoToOrdersButton } from './Components/GoToOrdersButton';
import ClearIcon from '@mui/icons-material/Clear';

const convertToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};
const Stores = () => {
    const [stores, setStores] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();





    const [isModalOpen, setModalOpen] = useState(false);
    const [cart, setCart] = useState(getCartFromLocalStorage() || { items: [] });
 const [isSearching, setIsSearching] = useState(false);

    const handleSearchFocus = () => {
        setIsSearching(true);
    };

    const handleSearchClear = () => {
        setSearchQuery	('');
        setIsSearching(false);
    };
   
    const categories = [
        "Groceries",
        "Fast Food",
        "Pizza",
        "Burger",
        "Bakery"
    ];

    useEffect(() => {
        if (!isTokenValid()) {
            logout(navigate);
        }

        const fetchStores = async () => {
            setLoading(true);
            try {
                const response = await api.get('stores');
                setStores(response.data);
            } catch (error) {
                console.error('Error fetching stores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, [navigate]);

    useEffect(() => {
        const newFilteredStores = stores.filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesSearch;
        });
        setFilteredStores(newFilteredStores);
    }, [stores, searchQuery]);

 

    const handleStoreClick = (storeId) => {
        navigate(`/stores/${storeId}`);
    };

   

   

    return (
        <Box sx={{ p: 0, minHeight: '100vh', overflowX: 'hidden',backgroundColor: 'rgba(95, 37, 159, 0.05)' }}>
         <>
  <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    height: '50px',
    position: 'sticky',
    top: 0,
    zIndex: 10,

    width: '100%', 
  }}
>
  <Paper
    elevation={0}
    sx={{
      width: '100%',
      height: 'auto',
      textAlign: 'center',
      display: 'flex',


    }}
  >
    {isSearching ? (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          transition: 'width 0.3s ease-in-out', // Slide-in transition
          height: '40px',
        }}
      >
        <TextField
          variant="outlined"
          autoFocus
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          InputProps={{
            disableUnderline: true,
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            },
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
          placeholder={`Search stores in Ennore Delivery`}
        />
      </Box>
    ) : (
      <Box sx={{ height: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1,pl:2, flexGrow: 1 }}>
          <Typography variant="subtitle2">All Stores</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end',mr:2 }}>
          <IconButton onClick={handleSearchFocus} sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
    )}
  </Paper>
</Box>

  </>
            {/* Display Loader while fetching data */}
            {loading ? (
                <BikeLoader />
            ) : (
                <>


                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 ,p:1.5}}>
                        {filteredStores.map(store => {
                            const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
				const currentMinutes = convertToMinutes(currentTimeString);
				const openMinutes = convertToMinutes(store.open_time);
				const closeMinutes = convertToMinutes(store.close_time);
				const isTimeOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes 
				const isOpen= isTimeOpen && store.status==='open';
                            return (
                                <Paper
                                    key={store._id}
                                    elevation={1}
                                    onClick={isOpen ? () => handleStoreClick(store._id) : null}
                                    sx={{
                                        mb: 1,
                                        width: '100%',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: '6px'
                                    }}
                                >
                                    <img
                                         src={store?.image ||"/app.png" }
					  alt="store"
					  style={{
					    width: '100%',
					    height: '180px',
					    objectFit: 'cover',
					    objectPosition: 'center',
borderTopLeftRadius: '6px',
borderTopRightRadius: '6px',

					  }}
					/>
                                    <Box sx={{ display: "flex", flexDirection: "column", p:0.5,pl:2 }}>
                                        <Typography variant="subtitle2" align='left' sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                            {store.name}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            align="left" 
                                            sx={{ mb: 1, fontSize: '0.75rem', color: '#555' }}
                                        >
                                            {store.address1}
                                        </Typography>
                                    </Box>
                                    {!isOpen && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '180px',
					    backgroundColor: !isOpen ? 'rgba(0, 0, 0, 0.5)' : 'inherit',  // Add a comma here
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderTopLeftRadius: '6px',
borderTopRightRadius: '6px',
                                                zIndex: 1,
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Typography variant="subtitle2" color="white" display="flex" alignItems="center">
					    Store Closed
					    <BedtimeIcon sx={{ marginLeft: 0.5 }} />
					</Typography>
                                            {!isTimeOpen && (
                                                <Typography variant="subtitle2" color="white">
                                                    opens at: {store.open_time}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Paper>
                            );
                        })}
                    </Box>
                </>
            )}

            {/* Go to Orders Button */}
            {cart.storeId && <GoToOrdersButton cart={cart} />}

        </Box>
    );
};

export default Stores;

