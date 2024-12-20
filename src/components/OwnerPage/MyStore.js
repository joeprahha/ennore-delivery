import React, { useEffect, useState } from 'react';
import {
    Box,
AppBar,
    Tabs,
    Tab,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
    IconButton,
    FormControl,
    Switch,
    Select,
    MenuItem,
    Avatar,useTheme,
    InputLabel,Grid,TextField
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatDistanceToNow } from 'date-fns';
import { parseISO } from 'date-fns';
import {  useNavigate,useLocation } from "react-router-dom";
import Reports from './Report';
import ItemModal from './itemModal'; 
import Settings from './Settings'
import { decodeToken, getToken } from '../../utils/auth';

import { api } from '../../utils/api';

import MenuManagement from './MenuMange';

import CreateStoreDialog from './CreateStoreModal';

const today = new Date().toISOString().split('T')[0];

function getRelativeTimeFromIST(istDateString) {
  if (!istDateString) return 'Invalid date';


  // Split date and time parts
  const [datePart, timePart] = istDateString.split(', ');
  if (!datePart || !timePart) return 'Invalid date';

  // Parse the date part (DD/MM/YYYY)
  const [day, month, year] = datePart.split('/').map(Number);

  // Parse the time part (hh:mm:ss am/pm)
  const [time, period] = timePart.split(' ');
  const [hours, minutes, seconds] = time.split(':').map(Number);

  // Convert 12-hour time to 24-hour time
  const adjustedHours =
    period.toLowerCase() === 'pm' && hours !== 12
      ? hours + 12
      : period.toLowerCase() === 'am' && hours === 12
      ? 0
      : hours;

  // Create the Date object
  const parsedDate = new Date(year, month - 1, day, adjustedHours, minutes, seconds);



  if (isNaN(parsedDate)) return 'Invalid date'; // Ensure it's a valid date

  // Calculate relative time
  const now = new Date();
  const diff = now - parsedDate; // Difference in milliseconds

  const secondsDiff = Math.floor(diff / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);

  if (daysDiff > 0) {
    return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
  } else if (hoursDiff > 0) {
    return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
  } else if (minutesDiff > 0) {
    return `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
  } else {
    return `${secondsDiff} second${secondsDiff > 1 ? 's' : ''} ago`;
  }
}


const MyStore = ({onMenuClick}) => {
    const userId = decodeToken()?.id;
  const theme = useTheme();
    const [orders, setOrders] = useState([]);
        const [filteredOrders, setFilteredOrders] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null); // State for selected store
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const [itemModal, setItemModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
 const [from, setFrom] = useState(today); // Default to today
    const [to, setTo] = useState(today); // Default to today
    const [previousOrderCount, setPreviousOrderCount] = useState(0);  // Keep track of the previous order count

      const location = useLocation();
    const tabNames = ["orders", "completed-orders", "menu", "reports","settings"];

    
const queryParams = new URLSearchParams(location.search);
        const currentTab = queryParams.get("tab");
        const tabIndex = tabNames.indexOf(currentTab);
    const [value, setValue] = useState(tabIndex!==-1?tabIndex:0);
    const navigate = useNavigate();


    

    const handleChange = (e, newValue) => {
        setValue(newValue);

        // Update the URL query parameter
        const newTab = tabNames[newValue];
        navigate(`?tab=${newTab}`);

        if (newValue === 2 && menu.length === 0) {
            fetchMenu(selectedStore);
        }
    };

    const handleClose = () => {
        setStoreModalOpen(false);
        setItemModal(false);
    };


  
  
const fetchOrders = async (selectedStore) => {
    try {
        const response = await api.get(`mystore/${selectedStore}/orders?from=${from}&to=${to}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        setOrders(response.data);
        setFilteredOrders(response.data.filter(o => o.status !== 'delivered'));

        // Check if any order has 'new' status
        const newOrder = response.data.find(o => o.status === 'new');
        if (newOrder) {
            // New order came in, play the sound
            playNewOrderSound();
        }

    } catch (error) {
        console.error('Error fetching orders:', error);
    } finally {
        setLoadingOrders(false);
    }
};

const playNewOrderSound = () => {
    const phrases = [
        'Ennore Delivery',
        'New order',
        'New order',
        'New order'
    ];
    
    let delay = 0;

    phrases.forEach((phrase, index) => {
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(phrase);
            utterance.volume = 1;  // Full volume
            utterance.rate = 1;  // Slow down the speech
            window.speechSynthesis.speak(utterance);
        }, delay);

        delay += 100;  // Add a 1-second delay between each phrase
    });
};

// Poll every 2 minutes (120,000 milliseconds)
useEffect(() => {
    const intervalId = setInterval(() => {
        // Assuming selectedStore is available in the scope
        fetchOrders(selectedStore);
    }, 30000);  // Poll every 2 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
}, [selectedStore]);



    const fetchStores = async (fetchOrdersFlag = true) => {

        try {
            const response = await api.get('mystore');
            setStores(response.data);
            if (fetchOrdersFlag && response.data.length > 0) {
                setSelectedStore(response.data[0]._id);
                fetchOrders(response.data[0]._id);
            }
        } catch (error) {

            console.error('Error fetching stores:', error);
        }
    };

    const fetchMenu = async (storeId) => {
        try {
            const response = await api.get(`menus/${storeId}`);
            setMenu(response.data);
            setLoadingMenu(false);
        } catch (error) {
            console.error('Error fetching menu:', error);
            setLoadingMenu(false);
        }
    };

    useEffect(() => {
        if (!getToken()) {
            navigate('/signin');
        }
        fetchStores();
    }, []);
    
    useEffect(() => {
setFilteredOrders([])
    if(value===1)
    {
     setFilteredOrders(orders.filter(o=>o.status==='delivered'))
    }
    else{
    setFilteredOrders(orders.filter(o=>o.status!=='delivered'))
    }
    
       
    }, [value]);

  

    const handleStoreChange = (event) => {
        const storeId = event.target.value;
        setSelectedStore(storeId);
        fetchOrders(storeId);
        fetchMenu(storeId);
    };

    const handleToggle = async () => {
    // Find the selected store
    let updateStore = stores.find(s => s._id === selectedStore);
    if (!updateStore) return;

    // Toggle the store's status
    const newStatus = updateStore.status === 'open' ? 'close' : 'open';

    // Update the store status in the stores array
    const updatedStores = stores.map(store =>
        store._id === selectedStore ? { ...store, status: newStatus } : store
    );

    // Update the state with the modified stores array
    setStores(updatedStores);

    // Send the status update request to the server
    try {
        await api.put(`mystore/${updateStore._id}/status?status=${newStatus}`, { status: newStatus });
        fetchStores(false);  // Refresh the store list
    } catch (error) {
        console.error('Error updating store status:', error);
    }
};


    const handleUpdateStatus = async (orderId, newStatus) => {
        const updatedOrders = orders.map((o) => {
            if (o._id === orderId) {
                return { ...o, status: newStatus };
            }
            return o;
        });
        setOrders(updatedOrders);

        try {
            await api.put(`orders/${orderId}/status`, { status: newStatus });
            fetchOrders(selectedStore);
            if (newStatus === 'ready') {
            //TODO
               // await api.post('/api/notify-drivers', { orderId });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const showItems = (e, order) => {
        setSelectedOrder(order);
        setItemModal(true);
    };

    return (
        <Box sx={{overFlowX:'hidden',overFlowY:'hidden'}}>
            
            
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
           <AppBar
  position="static"
  sx={{
    backgroundColor: 'inherit',
    color: 'primary.main',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    p: 2,

  }}
  elevation={0}
>
  {/* Menu Icon */}
  <IconButton
    edge="start"
    color="inherit"
    aria-label="menu"
    onClick={onMenuClick}
    sx={{ alignSelf: 'center' }}
  >
    <MenuIcon />
  </IconButton>

  {/* Store Logo Avatar */}
  <Box sx={{display:'flex'}}>
  <Avatar
    alt={stores.find((s) => s._id === selectedStore)?.name}
    src={stores.find((s) => s._id === selectedStore)?.logo}
    sx={{
      width: 30,
      height: 30,
      alignSelf: 'center',
      imgProps: {
        style: {
          objectFit: 'contain',
          width: '100%',
          height: '100%',
        },
      },
    }}
  />

  {/* Store Selection Dropdown */}
  <FormControl
    
    variant="outlined"
    size="small"
    sx={{
	width:'150px',
      marginY: 'auto', // Center vertically
    }}
  >
    <InputLabel>Select Store</InputLabel>
    <Select
      value={selectedStore || stores[0]?._id || 'Create Store'}
      onChange={handleStoreChange}
      label="Select Store"
    >
      {stores.map((store) => (
        <MenuItem key={store._id} value={store._id}>
          {store.name}
        </MenuItem>
      ))}
      <MenuItem onClick={(e) => setStoreModalOpen(true)}>Create Store</MenuItem>
    </Select>
  </FormControl>

</Box>
  {/* Store Status Toggle */}
  {selectedStore && (
    <Box display="flex" alignItems="center" sx={{ marginLeft: 2 }}>
      <Switch
        checked={stores.find((s) => s._id === selectedStore)?.status === 'open'}
        onChange={handleToggle}
        color="primary"
      />
      <Typography variant="body2" sx={{  }}>
        {stores.find((s) => s._id === selectedStore)?.status === 'open'
          ? 'Open'
          : 'Closed'}
      </Typography>
    </Box>
  )}
</AppBar>


             <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                width: '100%', 
                                overflow: 'hidden', 
                            }}
                        >
                           
                            <Tabs
                                value={value}
                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{ 
                                    overflowX: 'auto', 
                                    flexGrow: 1, 
                                    flexShrink: 1, 
                                    minHeight: '48px', 
                                }} 
                            >
                                  <Tab label="Orders" />
		 <Tab label="Completed Orders" />
                <Tab label="Menu" />
                 <Tab label="Reports"/>
        	 <Tab label="Settings"/>
                            </Tabs>

                        </Box>
         
            
</Box>
   <CreateStoreDialog
                storeDialogOpen={storeModalOpen}
                setStoreDialogOpen={setStoreModalOpen}
                fetchStores={fetchStores}
            />

            <Box mt={8} style={{ margin: 0 }}>
                {(value === 0 || value===1) && (
                  <>  
               <Grid container sx={{pl:2,pt:2}} alignItems="center" spacing={1} wrap="nowrap">
    {/* From Date */}
    <Grid item xs={"4.5"}>
        <TextField
            type="date"
            label="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
        />
    </Grid>

    {/* To Date */}
    <Grid item xs={"4.5"}>
        <TextField
            type="date"
            label="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
        />
    </Grid>

    {/* Go Button */}
    <Grid item xs="auto">
        <Button
            variant="contained"
            color="primary"
            onClick={() => fetchOrders(selectedStore)}
            size="medium"
        >
            Go
        </Button>
    </Grid>

    {/*  
    <Grid item xs="auto">
       <OrderControls onRefresh={() => fetchOrders(selectedStore)} />
    </Grid>
    */}
</Grid>

              

                    <Box p={1}>
                        {loadingOrders ? (
                            <CircularProgress />
                        ) : (
                            <>

                                <ItemModal open={itemModal} handleClose={handleClose} order={selectedOrder} />
                        <TableContainer stickyHeader sx={{ width: '100%', overflowX: 'auto' }}>
    <Table sx={{ width: '100%', tableLayout: 'fixed', '& .MuiTableCell-root': { fontSize: '0.75rem' } }}> {/* Set font size for all TableCell */}
        <TableHead>
            <TableRow>
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1, width: '25%',height:30 }}>
                    Order ID
                </TableCell>
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1, width: '25%',height:30 }}>
                    Time
                </TableCell>
                
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1, width: '25%',height:30 }}>
                    Status
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {filteredOrders.map((order) => {
             const placedAtIST = order?.created_at ? new Date(order.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '';

const relativeTime = getRelativeTimeFromIST(placedAtIST);


               return( <TableRow 
               key={order._id}
                   sx={{backgroundColor: order.status === "new" ? "rgba(255, 0, 0, 0.1)" : "inherit",}}

               >
                    <TableCell sx={{ height: 30 }} onClick={(e) => showItems(e, order)}>{order.customer_details?.name} :: {order._id.slice(-4)} </TableCell>
                    <TableCell sx={{ height: 30 }} onClick={(e) => showItems(e, order)}>{relativeTime}</TableCell>
                
                  { value===0 ? <TableCell sx={{ height: 30 }}>
                        <FormControl fullWidth variant="outlined" size="small" sx={{ height: 20 }}> 
                            <Select
                                
                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                value={order.status}
                                 sx={{ height: 20, display: 'flex', alignItems: 'center', fontSize: '0.65rem' }}
                               
                            >
                                
                                <MenuItem value="new">New</MenuItem>
                                <MenuItem value="accepted">Accepted</MenuItem>
                                <MenuItem value="ready">Ready</MenuItem>

                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="cancelled">Cancel</MenuItem>

                            </Select>
                        </FormControl>
                    </TableCell>: 
                     <TableCell align="left" sx={{ height: 30 }}>

        	  Delivered

                <CheckCircleIcon color="success" />
      </TableCell> }
                </TableRow>
            )})}
        </TableBody>
    </Table>
</TableContainer>


                            </>
                        )}
                    </Box></>
                )}
                {value === 2 && (
                    <MenuManagement menu={menu} loadingMenu={loadingMenu} setMenu={setMenu} userId={userId} selectedStore={selectedStore}/>
                )}
                {value === 3 && (
                    <Reports selectedStore={selectedStore}/>
                )}
                {value === 4 && (
 			<Settings selectedStore={selectedStore}/>
                )}
                
            </Box>
        </Box>
    );
};

export default MyStore;

