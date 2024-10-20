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
    Modal,
    FormControl,
    Switch,
    InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ItemModal from './itemModal'; 
import AddIcon from '@mui/icons-material/Add';

   
import { Avatar } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { decodeToken, getToken } from '../../utils/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { baseUrl,api } from '../../utils/api';
import OrderControls from './orderControlls'

const MyStore = () => {
const userId =decodeToken()?.id
    const [value, setValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [storeCategory, setStoreCategory] = useState('');
    const [storeOpenTime, setStoreOpenTime] = useState('');
    const [storeCloseTime, setStoreCloseTime] = useState('');
    const [stores, setStores] = useState([]);
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const [storeName, setStoreName] = useState('');
    const [storeAddress1, setStoreAddress1] = useState('');
    const [storeLocalArea, setStoreLocalArea] = useState('');
    
     const [menu, setMenu] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newItem, setNewItem] = useState({  name: '', price: '' });

    const [addingCategory, setAddingCategory] = useState(false); // Toggle for category input

const [alertEnabled, setAlertEnabled] = useState(true);

const [editIndex, setEditIndex] = useState(null);
    const [editedItem, setEditedItem] = useState({ name: '', price: '' });
    const [selectedCategory, setSelectedCategory] = useState(Object.keys(menu)[0]); // Default to the first category
const [itemModal, setItemModal] = useState(false);
const [selectedOrder,setSelectedOrder]= useState({});
const showItems=(e,order)=>{

 setSelectedOrder(order)
  setItemModal(true)
}


    const handleToggle = async () => {
                const newStatus = stores[0]?.status==='open'?"close":'open'
                setStores([{...stores[0],status:newStatus}])
        try {

            // Make API call to update the status
            await api.put(`mystore/${stores[0]._id}/status?status=${newStatus}`, { status: newStatus  });
		fetchStores(false)
            // Optionally: You can show a success message or handle errors
        } catch (error) {
            console.error('Error updating store status:', error);

        }
    };

  const handleUpdateItem = (index,category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category][index] = editedItem; // Update the item
        setMenu(updatedMenu); // Update the state
        setEditedItem({ name: '', price: '' }); // Clear the input
        setEditIndex(null); // Reset the edit index
    };

    const handleDeleteItem = (index,category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category].splice(index, 1); // Remove the item
        setMenu(updatedMenu); // Update the state
    };



    const navigate = useNavigate();
    const { storeId } = useParams();

    const handleClose = () => {
        setStoreModalOpen(false);
        setItemModal(false)
    };

    // Fetch orders for the store
    const fetchOrders = async (storeId) => {

    let id =storeId || stores[0]._id

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
 useEffect(()=>{
 const interval = setInterval(() => {
        fetchOrders();
    }, 300000); // 300000 milliseconds = 5 minutes

   
    // Cleanup the interval on unmount
    return () => clearInterval(interval);
},[])



// Fetch menu items for the store
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

const fetchStores = async (orders=true) => {
    const { id: ownerId } = decodeToken(); // Get ownerId from the JWT token
    try {
       const response =await api.get('mystore');
       console.log(response)
       setStores(response.data);
     orders && fetchOrders(response.data[0]._id);

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


}, []);

const handleCreateStore = async () => {
    try {
        const { id } = decodeToken();
        const response = await api.post('/create-store', {
    name: storeName,
    category: storeCategory,
    open_time: storeOpenTime,
    close_time: storeCloseTime,
    address1: storeAddress1,
    local: storeLocalArea,
    ownerId: id,
});
        setStoreModalOpen(false); // Close the modal after creating the store
        fetchOrders(); // Fetch updated orders
    } catch (error) {
        console.error('Error creating store:', error);
    }
};

const handleUpdateStatus = async (orderId, newStatus) => {
	
	const updatedOrders = orders.map((o) => {
  if (o._id === orderId) {
    console.log(o._id);
    return { ...o, status: newStatus }; // Return a new object with the updated status
  }
  return o; // Return the unchanged orders
});

setOrders(updatedOrders); // Set the new updated array to the state

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


    
    // Add a new category
    const handleAddCategory = () => {
        if (newCategory) {
            setMenu((prevMenu) => ({ ...prevMenu, [newCategory]: [] }));
            setNewCategory('');
            setAddingCategory(false);
        }
    };

    // Add a new item to a category
   const handleAddItem = (category) => {
        const updatedMenu = { ...menu };
        updatedMenu[category].push(newItem); // Add the new item
        setMenu(updatedMenu); // Update the state
        setNewItem({ name: '', price: '' }); // Clear the input
    };

    const handleSaveMenu = async () => {
        const formattedMenu = Object.entries(menu).map(([categoryName, items]) => ({
            categoryName,
            items,
        }));

        try {
            await api.put(`menus/${userId}`, { menu: formattedMenu });
            alert('Menu saved successfully');
        } catch (error) {
            console.error('Error saving menu:', error);
            alert('Error saving menu');
        }
    };
 

return (
    <Box>
        {stores.length ? (
		    <Box mb={4} display="flex" alignItems="center" justifyContent="space-between" style={{ margin: 10 }}>
	    <Box display="flex" alignItems="center">
		<Avatar
		    alt={stores[0].name}
		    src={stores[0].logoUrl}
		    sx={{ width: 30, height: 30, mr: 1 }}
		/>
		<Typography variant="h6" gutterBottom style={{ lineHeight: '30px' }}>
		    {stores[0].name}
		</Typography>
	    </Box>
	    
	    <Box display="flex" alignItems="center">
		<Switch
		    checked={stores[0]?.status==='open'}
		    onChange={handleToggle}
		    color="primary"
		    sx={{ ml: 2 }} // Add some margin to the left
		/>
		<Typography variant="body2" style={{ marginLeft: 5,marginRight:10 }}>
		    {stores[0]?.status==='open' ? 'Open' : 'Closed'}
		</Typography>
	    </Box>
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
            onChange={(e, newValue) => {setValue(newValue); menu.length===0 && fetchMenu()}}
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
			<OrderControls    onRefresh={()=>fetchOrders()}  />
						<ItemModal
						open={itemModal}
						handleClose={handleClose}
						order={selectedOrder}
					      />
                        <TableContainer stickyHeader sx={{width:'100%'}}>
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            Order ID
                                        </TableCell>
                                        
                                        
                                        <TableCell sx={{ position: 'sticky', top: 0,  zIndex: 1 }}>
                                            Customer
                                        </TableCell>
                                        <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            Action
                                        </TableCell>
                                        <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                           actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell>{order._id.slice(-4)}</TableCell>
                                            
                                   <TableCell>{order.createduser}</TableCell>
                                  
                                   <TableCell>
                                   <Button onClick={(e)=>showItems(e,order)}>
                                   		items
                                   		</Button>
		                            
				      </TableCell>
                                   <TableCell>
				    <FormControl fullWidth>
					<Select
					    fullWidth
					    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
					    value={order.status}
					    sx={{
						border: order.status === "new" ? '2px solid red' : 'none', // Conditional red border
						'&:focus': {
						    border: order.status === "new" ? '2px solid red' : 'none', // Maintain the border on focus
						    boxShadow: 'none', // Remove default focus shadow
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
                <Box p={3}>
                    <Box display="flex" mb={2} sx={{ alignItems: 'center' }}>
		    <TextField
			label="Add New Category"
			value={newCategory}
			onChange={(e) => setNewCategory(e.target.value)}
			fullWidth
			margin="normal"
			sx={{ height: '40px' ,mb:2,mt:0}} // Set height and ensure input fits
		    />
		  { newCategory && <Button
			variant="contained"
			color="primary"
			size="small"
			onClick={handleAddCategory}
			sx={{ ml: 2, height: '40px', alignSelf: 'stretch' }} // Set height and align
		    >
			Add
		    </Button> }
		</Box>
                    {loadingMenu ? (
                        <CircularProgress />
                    ) : (
                       <Box sx={{ mt: 2 }}>

                
                <Tabs
                
                    value={selectedCategory}
                    onChange={(event, newValue) => setSelectedCategory(newValue)}
                >
                    {Object.keys(menu).map((category) => (
                        <Tab key={category} label={category} value={category} />
                    ))}
                </Tabs>
               
           
         

            <Box sx={{ mt: 2 }}>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menu[selectedCategory]?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <TextField
                                            value={editIndex === index ? editedItem.name : item.name}
                                            onChange={(e) => {
                                                const newName = e.target.value;
                                                if (editIndex === index) {
                                                    setEditedItem({ ...editedItem, name: newName });
                                                }
                                            }}
                                            disabled={editIndex !== index} // Disable when not editing
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <TextField
                                            value={editIndex === index ? editedItem.price : item.price}
                                            type="number"
                                            onChange={(e) => {
                                                const newPrice = parseFloat(e.target.value);
                                                if (editIndex === index && !isNaN(newPrice)) {
                                                    setEditedItem({ ...editedItem, price: newPrice });
                                                }
                                            }}
                                            disabled={editIndex !== index} // Disable when not editing
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {editIndex === index ? (
                                            <>
                                                <Button onClick={() => handleUpdateItem(index, selectedCategory)} color="primary">
                                                    Save
                                                </Button>
                                                <Button onClick={() => setEditIndex(null)} color="secondary">
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button onClick={() => {
                                                    setEditedItem(item);
                                                    setEditIndex(index);
                                                }} color="primary">
                                                    Edit
                                                </Button>
                                                <Button onClick={() => handleDeleteItem(index, selectedCategory)} color="secondary">
                                                    <DeleteIcon />
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        label="Name"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        InputProps={{
                                            style: { height: '30px' }, // Set height and padding to match other rows
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Price"
                                        value={newItem.price}
                                        type="number"
                                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                                        InputProps={{
                                            style: { height: '30px' }, // Set height and padding to match other rows
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAddItem(selectedCategory)}
                                    >
                                        Add
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Button variant="contained" color="secondary" onClick={handleSaveMenu} sx={{ mt: 2 }}>
                Save Menu
            </Button>
        </Box>
                    )}
                </Box>
           
            )}
        </Box>
    </Box>
);
};

export default MyStore;

