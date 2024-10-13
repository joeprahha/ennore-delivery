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
    TextField,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Modal,
} from '@mui/material';
import { Avatar } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { decodeToken, getToken } from '../utils/auth';
import { useNavigate, useParams } from 'react-router-dom';

const MyStore = () => {
    const [value, setValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [newItem, setNewItem] = useState({ category: '', name: '', price: '' });
    const [storeCategory, setStoreCategory] = useState('');
    const [storeOpenTime, setStoreOpenTime] = useState('');
    const [storeCloseTime, setStoreCloseTime] = useState('');
    const [stores, setStores] = useState([]);
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const [storeName, setStoreName] = useState('');
    const [storeAddress1, setStoreAddress1] = useState('');
    const [storeLocalArea, setStoreLocalArea] = useState('');
    
    const navigate = useNavigate();
    const baseUrl = 'http://localhost:5000/ennore-delivery';
    const { storeId } = useParams();

    const handleClose = () => {
        setStoreModalOpen(false);
    };

    // Fetch orders for the store
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${baseUrl}/mystore/${storeId}/orders`, {
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

    // Fetch menu items for the store
    const fetchMenu = async () => {
        try {
            const response = await axios.get(`${baseUrl}/menu`);
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoadingMenu(false);
        }
    };

    const checkAuth = (accessible) => {
        if (!getToken()) {
            navigate('/signin');
            return;
        }
        const { scope } = decodeToken();
        if (scope !== accessible) {
            navigate('/stores');
        }
    };

    const fetchStores = async () => {
        const { id: ownerId } = decodeToken(); // Get ownerId from the JWT token
        try {
            const response = await axios.get(`${baseUrl}/mystore`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Include JWT token in the header
                },
            });
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    useEffect(() => {
        if (!getToken()) {
            navigate('/signin');
        }
        checkAuth('owner');
        if (getToken() && !storeId) {
            window.location.href = `${window.location.pathname}/${decodeToken().id}`;
        }
        fetchStores();
        fetchOrders();
    }, []);

    const handleCreateStore = async () => {
        try {
            const { id } = decodeToken();
            await axios.post(`${baseUrl}/create-store`, {
                name: storeName,
                category: storeCategory,
                open_time: storeOpenTime,
                close_time: storeCloseTime,
                address1: storeAddress1,
                local: storeLocalArea,
                ownerId: id,
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            setStoreModalOpen(false); // Close the modal after creating the store
            fetchOrders(); // Fetch updated orders
        } catch (error) {
            console.error('Error creating store:', error);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${baseUrl}/orders/${orderId}`, { status: newStatus });
            fetchOrders(); // Refresh orders after updating
            if (newStatus === 'ready') {
                await axios.post('/api/notify-drivers', { orderId });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory) return;
        try {
            await axios.post(`${baseUrl}/menu`, { categoryName: newCategory });
            setNewCategory('');
            fetchMenu(); // Refresh menu after adding a category
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleAddItem = async () => {
        if (!newItem.category || !newItem.name || !newItem.price) return;
        try {
            await axios.post(`${baseUrl}/menu/item`, { ...newItem });
            setNewItem({ category: '', name: '', price: '' });
            fetchMenu(); // Refresh menu after adding an item
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return (
        <Box>
            {stores.length ? (
                <Box mb={4} display="flex" alignItems="center" style={{ margin: 10 }}>
                    <Avatar
                        alt={stores[0].name}
                        src={stores[0].logoUrl}
                        sx={{ width: 30, height: 30, mr: 1 }}
                    />
                    <Typography variant="h6" gutterBottom style={{ lineHeight: '30px' }}>
                        {stores[0].name}
                    </Typography>
                </Box>
            ) : (
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
            <Modal
                open={storeModalOpen}
                onClose={handleClose}
                aria-labelledby="create-store-modal-title"
                aria-describedby="create-store-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="create-store-modal-title" variant="h6" component="h2">
                        Create Store
                    </Typography>
                    <TextField
                        label="Store Name"
                        fullWidth
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        margin="normal"
                    />
                    <Select
                        label="Category"
                        fullWidth
                        required
                        value={storeCategory}
                        onChange={(e) => setStoreCategory(e.target.value)}
                        displayEmpty
                        margin="normal"
                    >
                        <MenuItem value="">
                            <em>Select a category</em>
                        </MenuItem>
                        <MenuItem value="groceries">Groceries</MenuItem>
                        <MenuItem value="restaurant">Restaurant</MenuItem>
                    </Select>
                    <TextField
                        label="Open Time"
                        type="time"
                        fullWidth
                        required
                        value={storeOpenTime}
                        onChange={(e) => setStoreOpenTime(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Close Time"
                        type="time"
                        fullWidth
                        required
                        value={storeCloseTime}
                        onChange={(e) => setStoreCloseTime(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Store Address"
                        fullWidth
                        required
                        value={storeAddress1}
                        onChange={(e) => setStoreAddress1(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Local Area"
                        fullWidth
                        required
                        value={storeLocalArea}
                        onChange={(e) => setStoreLocalArea(e.target.value)}
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateStore}
                        sx={{ mt: 2 }}
                    >
                        Create Store
                    </Button>
                </Box>
            </Modal>

            {/* Sticky Tab Navigation */}
         
                    <Tabs
                        value={value}
                       onChange={(e, newValue) => setValue(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: '1px solid #ccc' }}
                    >
                      <Tab label="Orders" />
                    <Tab label="Menu" />
                    </Tabs>

            {/* Tab Content */}
            <Box mt={8} style={{margin:0}}>
                {value === 0 && (
                   <Box p={3}>
    {loadingOrders ? (
        <CircularProgress />
    ) : (
        <TableContainer sx={{ maxHeight: 400 }} stickyHeader>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            Order ID
                        </TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            Customer
                        </TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            Total
                        </TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            Status
                        </TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.createduser}</TableCell>
                            <TableCell>{order.total - +order.donation - +order.delivery_fee}</TableCell>
                            <TableCell>
                                <Select
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="accepted">Accepted</MenuItem>
                                    <MenuItem value="ready">Ready</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleUpdateStatus(order.id, 'ready')}>
                                    Mark as Ready
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )}
</Box>

                )}
                {value === 1 && (
                    <Box p={3}>
                        {loadingMenu ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Add Category</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TextField
                                            label="New Category"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Button onClick={handleAddCategory} variant="contained" color="primary">
                                            Add Category
                                        </Button>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Add Item</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Select
                                            label="Category"
                                            value={newItem.category}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, category: e.target.value })
                                            }
                                            fullWidth
                                            margin="normal"
                                        >
                                            <MenuItem value="">
                                                <em>Select Category</em>
                                            </MenuItem>
                                            {menuItems.map((item) => (
                                                <MenuItem key={item.category} value={item.category}>
                                                    {item.category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <TextField
                                            label="Item Name"
                                            value={newItem.name}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, name: e.target.value })
                                            }
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Price"
                                            value={newItem.price}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, price: e.target.value })
                                            }
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Button onClick={handleAddItem} variant="contained" color="primary">
                                            Add Item
                                        </Button>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MyStore;

