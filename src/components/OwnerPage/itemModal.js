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

        <Typography variant="h6" component="h2" gutterBottom>
          Order Details #{orderId}
        </Typography>

        {/* Customer Name, Order ID, and Placed At */}
        <Box mb={4}>


          <Typography variant="body1">Placed At: {placedAtIST}</Typography>
        </Box>

        {/* Items Table */}
        {items && items.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell align="center"><strong>Quantity</strong></TableCell>
                  <TableCell align="right"><strong>Price</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="center">{item.count}</TableCell>
                    <TableCell align="right">{item.price}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} align="right">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Rs. {total}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No items available</Typography>
        )}

        <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ItemModal;

