import React, { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Typography,
    Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';
import EditMenuModal from './EditMenuModal';
import SettingsModal from './Settings'; 


const Stores = () => {
    const [stores, setStores] = useState([]);
    const navigate = useNavigate();
      const [openStoreModal, setOpenStoreModal] = useState(false);
  const [openMenuModal, setOpenMenuModal] = useState(false);
const [selectedStore,setSelectedStore] =useState('')

 const handleEditMenuClick = (id) => {
 setSelectedStore(id)
    setOpenMenuModal(true);
  };
  
   const handleEditSettingsClick = (id) => {
 setSelectedStore(id)
  setOpenStoreModal(true)
  };


    // Fetch stores on component mount
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await api.get('/stores');
                setStores(response.data);
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        };

        fetchStores();
    }, []);

    // Handle delete store
    const handleDeleteStore = async (storeId) => {
        if (window.confirm('Are you sure you want to delete this store?')) {
            try {
                await api.delete(`/store/${storeId}`);
                setStores((prev) => prev.filter((store) => store.id !== storeId));
                alert('Store deleted successfully');
            } catch (error) {
                console.error('Error deleting store:', error);
                alert('Failed to delete store');
            }
        }
    };

    // Handle delete menu
    const handleDeleteMenu = async (storeId) => {
        if (window.confirm('Are you sure you want to delete the menu for this store?')) {
            try {
                await api.delete(`/menu/${storeId}`);
                alert('Menu deleted successfully');
            } catch (error) {
                console.error('Error deleting menu:', error);
                alert('Failed to delete menu');
            }
        }
    };

    return (
        <div>
           

            {stores.map((store) => (
                <Accordion key={store.id} sx={{ marginBottom: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{store.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDeleteStore(store._id)}
                            >
                                Delete Store
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => handleDeleteMenu(store._id)}
                            >
                                Delete Menu
                            </Button>
                              <Button
    variant="contained"
    color="secondary"
    onClick={() => handleEditSettingsClick(store._id) } // Open modal for editing store settings
  >
    Edit Settings
  </Button>
  <Button
    variant="contained"
    color="secondary"
    onClick={() => handleEditMenuClick(store._id)} // Open modal for editing menu
  >
    Edit Menu
  </Button>
                           
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
            
        <SettingsModal
        selectedStore={selectedStore}
        open={openStoreModal}
        onClose={() => setOpenStoreModal(false)}
      />
      


      <EditMenuModal
        selectedStore={selectedStore}
        open={openMenuModal}
        onClose={() => setOpenMenuModal(false)}
      /> 
      
        </div>
    );
};

export default Stores;

