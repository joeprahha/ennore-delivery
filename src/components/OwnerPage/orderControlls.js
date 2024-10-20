import React, { useState, useEffect } from 'react';
import { Box, Switch, IconButton, Tooltip, Table, TableBody, TableCell, TableRow } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';


const OrderControls = ({ onRefresh}) => {


  

    return (
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
            {/* Toggle Button for Alert
            <Tooltip title={alertEnabled ? "Disable Alerts" : "Enable Alerts"} placement="top">
                <Switch
                    checked={alertEnabled}
                    onChange={handleToggleAlert}
                    color="primary"
                    inputProps={{ 'aria-label': 'toggle alerts' }}
                />
            </Tooltip> */}

            {/* Refresh Icon Button */}
            <Tooltip title="Refresh Orders" placement="top">
                <IconButton onClick={onRefresh} sx={{ ml: 2 }} color="primary">
                    Refresh <RefreshIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default OrderControls;

