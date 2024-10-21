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
    Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ItemModal from './itemModal'; 
import AddIcon from '@mui/icons-material/Add';
import { decodeToken, getToken } from '../../utils/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import OrderControls from './orderControlls';
import MenuManagement from './MenuMange';
import  CreateStoreModal from './CreateStoreModal';

const MyStore = () => {
    const userId = decodeToken()?.id;
    const [value, setValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [stores, setStores] = useState([]);
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const [itemModal, setItemModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});

    const navigate = useNavigate();
    const { storeId } = useParams();

    const handleClose = () => {
        setStoreModalOpen(false);
        setItemModal(false);
    };

    const fetchOrders = async (storeId) => {
    console.log(stores[0])
        const id = storeId || stores[0]._id;
        try {
            const response = await api.get(`mystore/${id}/orders`, {
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
            fetchOrdersFlag && fetchOrders(response.data[0]._id);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };
    const fetchMenu = async () => {
	console.log("st",stores[0])
            try {
                const response = await api.get(`menus/${stores[0]?._id}`);
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
            fetchOrders();
        }, 300000); // Fetch orders every 5 minutes
        return () => clearInterval(interval);
    }, []);

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
            fetchOrders();
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
            { (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => setStoreModalOpen(true)}
                >
                    Create Store
                </Button>
            )}

            {/* Modal for creating a new store */}
           <CreateStoreModal storeModalOpen={storeModalOpen} setStoreModalOpen={setStoreModalOpen} fetchStores={fetchStores} />

            {/* Sticky Tab Navigation */}
            <Tabs
                value={value}
                onChange={(e, newValue) => {
                    setValue(newValue);
                    menu.length === 0 && fetchMenu();
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: '1px solid #ccc' }}
            >
                <Tab label="Orders" />
                <Tab label="Menu" />
            </Tabs>

            {/* Tab Content */}
            <Box mt={8} style={{ margin: 0 }}>
                {value === 0 && (
                    <Box p={3}>
                        {loadingOrders ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <OrderControls onRefresh={() => fetchOrders()} />
                                <ItemModal open={itemModal} handleClose={handleClose} order={selectedOrder} />
                                <TableContainer stickyHeader sx={{ width: '100%' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                    Order ID
                                                </TableCell>
                                                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                    Customer
                                                </TableCell>
                                                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                    Action
                                                </TableCell>
                                                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                    Status
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <TableRow key={order._id}>
                                                    <TableCell>{order._id.slice(-4)}</TableCell>
                                                    <TableCell>{order.createduser}</TableCell>
                                                    <TableCell>
                                                        <Button onClick={(e) => showItems(e, order)}>
                                                            Items
                                                        </Button>
                                                    </TableCell>
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
                    </Box>
                )}
                {value === 1 && (
                    <MenuManagement menu={menu} loadingMenu={loadingMenu} setMenu={setMenu} userId={userId}/>
                )}
            </Box>
        </Box>
    );
};

export default MyStore;

