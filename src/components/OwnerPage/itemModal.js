import React from 'react';
import { Modal, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ItemModal = ({ open, handleClose, order }) => {
  // Parse the items and handle cases where items may not be available
  const items = JSON.parse(order?.items || '[]');
  const orderedBy = order?.createduser; // Customer name
  const total = order?.total - order?.donation - order?.delivery_fee; // Total calculation
  const orderId = order?._id; // Order ID
  const placedAtIST = order?.created_at ?   new Date(order.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) :''
  


  



  return (
    <Modal open={open} onClose={handleClose}>
      <Box
    sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        height: '70vh',
        overflowY: 'auto', // Enable vertical scrolling
        overflowX: 'hidden', // Hide horizontal scrolling if not needed
    }}
>
 <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
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
     

      <Box
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
      </Box>
      {/* Items Table */}
        {items && items.length > 0 ? (
          <TableContainer>
            <Table>
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

       
      </Box>
    </Modal>
  );
};

export default ItemModal;

