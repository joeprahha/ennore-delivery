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
    Modal,
    FormControl,
    Switch,
    Select,
    MenuItem,
    Avatar,
    InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ItemModal from './itemModal'; 
import AddIcon from '@mui/icons-material/Add';
import { decodeToken, getToken } from '../../utils/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import OrderControls from './orderControlls';
import MenuManagement from './MenuMange';
import CreateStoreDialog from './CreateStoreModal';

const MyStore = () => {
    const userId = decodeToken()?.id;
    const [value, setValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null); // State for selected store
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const [itemModal, setItemModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});

    const navigate = useNavigate();
    const { storeId } = useParams();

    const handleClose = () => {
        setStoreModalOpen(false);
        setItemModal(false);
    };

    const fetchOrders = async (selectedStore) => {
        try {
            const response = await api.get(`mystore/${selectedStore}/orders`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchStores = async (fetchOrdersFlag = true) => {
        const { id: ownerId } = decodeToken();
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
        const interval = setInterval(() => {
            if (selectedStore) fetchOrders(selectedStore);
        }, 300000); // Fetch orders every 5 minutes
        return () => clearInterval(interval);
    }, [selectedStore]);

    const handleStoreChange = (event) => {
        const storeId = event.target.value;
        setSelectedStore(storeId);
        fetchOrders(storeId);
        fetchMenu(storeId);
    };

    const handleToggle = async () => {
        const newStatus = stores[0]?.status === 'open' ? 'close' : 'open';
        setStores([{ ...stores[0], status: newStatus }]);
        try {
            await api.put(`mystore/${stores[0]._id}/status?status=${newStatus}`, { status: newStatus });
            fetchStores(false);
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
                await api.post('/api/notify-drivers', { orderId });
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
        <Box>
            <Box mb={4} display="flex" alignItems="center" justifyContent="space-between" style={{ margin: 10 }}>
                
		
            </Box>

            {selectedStore && stores.length ? (
                <Box mb={4} display="flex" alignItems="center" justifyContent="space-between" style={{ margin: 10 }}>
                    <Box display="flex" alignItems="center">
                        <Avatar
                            alt={stores.find(s => s._id === selectedStore)?.name}
                            src={stores.find(s => s._id === selectedStore)?.logo}
                            sx={{ width: 30, height: 30, mr: 1 }}
                            imgProps={{
                                style: {
                                    objectFit: 'contain',
                                    width: '100%',
                                    height: '100%',
                                },
                            }}
                        />
                        <FormControl  variant="outlined">
                    <InputLabel>Select Store</InputLabel>
                    <Select
                        value={selectedStore || "Create Store"}
                        onChange={handleStoreChange}
                        label="Select Store"
                    >
                        {stores.map((store) => (
                            <MenuItem key={store._id} value={store._id}>
                                {store.name}
                            </MenuItem>
                        ))}
                        
                <MenuItem  onClick={(e) => { setStoreModalOpen(true)}}>
                         <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    //onClick={() => setStoreModalOpen(true)}
                >
                    Create Store
                </Button>
                </MenuItem>
                    </Select>
                </FormControl>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Switch
                            checked={stores.find(s => s._id === selectedStore)?.status === 'open'}
                            onChange={handleToggle}
                            color="primary"
                            sx={{ ml: 2 }}
                        />
                        <Typography variant="body2" style={{ marginLeft: 5, marginRight: 10 }}>
                            {stores.find(s => s._id === selectedStore)?.status === 'open' ? 'Open' : 'Closed'}
                        </Typography>
                    </Box>
                </Box>
            ) :null}
               
            <CreateStoreDialog
                storeDialogOpen={storeModalOpen}
                setStoreDialogOpen={setStoreModalOpen}
                fetchStores={fetchStores}
            />

            <Tabs
                value={value}
                onChange={(e, newValue) => {
                    setValue(newValue);
                    menu.length === 0 && fetchMenu(selectedStore);
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: '1px solid #ccc' }}
            >
                <Tab label="Orders" />
                <Tab label="Menu" />
            </Tabs>

            <Box mt={8} style={{ margin: 0 }}>
                {value === 0 && (
                  <>                      
                            <OrderControls onRefresh={() => fetchOrders(selectedStore)} />
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
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1, width: '25%' }}>
                    Order ID
                </TableCell>
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1, width: '25%' }}>
                    Customer
                </TableCell>
                
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1, width: '25%' }}>
                    Status
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {orders.map((order) => (
                <TableRow key={order._id}>
                    <TableCell onClick={(e) => showItems(e, order)}>{order._id.slice(-4)}</TableCell>
                    <TableCell onClick={(e) => showItems(e, order)}>{order.createduser}</TableCell>
                   
                    <TableCell>
                        <FormControl fullWidth>
                            <Select
                                fullWidth
                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                value={order.status}
                                sx={{
                                    border: order.status === "new" ? '2px solid red' : 'none',
                                    '&:focus': {
                                        border: order.status === "new" ? '2px solid red' : 'none',
                                        boxShadow: 'none',
                                    },
                                    '& .MuiSelect-select': {
                                        fontSize: '0.75rem', // Set font size for Select component
                                        height: '30px', // Set height for the Select
                                        lineHeight: '30px', // Align text vertically
                                    },
                                    '& .MuiInputBase-root': {
                                        height: '30px', // Set height for the input root
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200, // Adjust max height of the dropdown if needed
                                        },
                                    },
                                    MenuListProps: {
                                        sx: {
                                            '& .MuiMenuItem-root': {
                                                fontSize: '0.75rem', // Set font size for MenuItem
                                                height: '24px', // Adjust height for MenuItem
                                                lineHeight: '24px', // Align text vertically
                                            },
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="" disabled>
                                    Select Status
                                </MenuItem>
                                <MenuItem value="new">New</MenuItem>
                                <MenuItem value="accepted">Accepted</MenuItem>
                                <MenuItem value="ready">Ready</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                            </Select>
                        </FormControl>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
</TableContainer>


                            </>
                        )}
                    </Box></>
                )}
                {value === 1 && (
                    <MenuManagement menu={menu} loadingMenu={loadingMenu} setMenu={setMenu} userId={userId} selectedStore={selectedStore}/>
                )}
            </Box>
        </Box>
    );
};

export default MyStore;

