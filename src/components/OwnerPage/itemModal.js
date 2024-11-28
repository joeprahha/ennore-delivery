import React from 'react';
import { SwipeableDrawer, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ItemModal = ({ open, handleClose, order }) => {
  // Parse the items and handle cases where items may not be available
  const items = JSON.parse(order?.items || '[]');
  const orderedBy = order?.createduser; // Customer name
  const total = order?.total - order?.donation - order?.delivery_fee; // Total calculation
  const orderId = order?._id; // Order ID
  const placedAtIST = order?.created_at ?   new Date(order.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) :''
  


  



  return (
     <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          height: "83%",
          bottom: 0,
          borderRadius: "16px 16px 0 0",
          overflowY: "auto",
          p:2
        },
      }}
    >
 <Button onClick={handleClose} variant="contained" sx={{ }}>
          Close
        </Button>
        <Typography variant="h6" component="h2" gutterBottom>
          Order Details #{orderId}
        </Typography>

        {/* Customer Name, Order ID, and Placed At */}
        <Box mb={1}>


          <Typography variant="body1">Placed At: {placedAtIST}</Typography>
        </Box>
	
        
        <Typography variant="body1">Payment Status : {order.payment}</Typography>
     

   { order?.instructions && <Box
        sx={{
        mt:1,
          flex: 1,
         width:"100%",
          padding: 1,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h6" sx={{fontSize:'0.75rem'}} gutterBottom>
          Instructions:
        </Typography>
        <Typography variant="body1">{order.instructions}</Typography>
      </Box> }
      {/* Items Table */}
        {items && items.length > 0 ? (
          <TableContainer
      component={Paper}
      sx={{
	mt:1,
        width:'auto',
        height: '350px', // Adjust the height as needed
        overflowY: 'auto', // Enable vertical scrolling
        border: '1px solid #ddd', // Add a border
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Optional shadow
      }}
    >
      <Table stickyHeader> {/* Sticky header for better visibility */}
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell align="center"><strong>Quantity</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="center">{item.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        ) : (
          <Typography>No items available</Typography>
        )}

       
         </SwipeableDrawer>
  );
};

export default ItemModal;

