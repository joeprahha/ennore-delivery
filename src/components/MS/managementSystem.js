import React, { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Tabs,
    Tab,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BikeLoader from '../../loader/BikeLoader';

import Users from './Components/Users';   // Import Users component
import Orders from './Components/Orders'; // Import Orders component
import Stores from './Components/Stores'; // Import Stores component
import Reports from './Components/Reports'; // Import Reports component
import QRCodeManager from './Components/Qr.js'
import Agreement from './Components/Agreement.js'

const MS = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [categories] = useState(['Users', 'Orders', 'Stores', 'Reports','Qr','Aggrement']);

    // Dummy effect to simulate loading data
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Simulate 2 seconds loading time
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

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
                            backgroundColor: '#fff',
                            pt: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                overflow: 'hidden',
                            }}
                        >
                           
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
                                {categories.map((category, index) => (
                                    <Tab label={category} key={index} />
                                ))}
                            </Tabs>
                        </Box>
                    </Box>
                    
                    {/* Conditionally render components based on the active tab */}
                    <Box sx={{ p: 2 }}>
                        {activeTab === 0 && <Users />}
                        {activeTab === 1 && <Orders />}
                        {activeTab === 2 && <Stores />}
                        {activeTab === 3 && <Reports />}
                        {activeTab === 4 && <QRCodeManager />}
                                                {activeTab === 5 && <Agreement />}
                        
                       
                    </Box>
                </>
            )}
        </Box>
    );
};

export default MS;

