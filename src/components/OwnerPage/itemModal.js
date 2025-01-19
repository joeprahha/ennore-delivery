import React from "react";
import {
  SwipeableDrawer,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

export const handlePrint = (e, order) => {
  const originalContents = document.body.innerHTML;

  // Create receipt HTML
  const receiptContent = `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; width: 8cm; box-sizing: border-box; font-size: 1rem;">
  <div style="padding: 5px;">
    <!-- Header with logos -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <img src="https://res.cloudinary.com/dq6e1ggmv/image/upload/v1735579876/jtbzy1ax6vcsz7ez89qb.jpg?v=1" alt="Ennore Delivery Logo" style="width:100px;height: 25px; object-fit: cover; object-position: center;">
      <img src="takeaway_logo.png" alt="Takeaway Logo" style="width: 50px; height: 50px;">
    </div>

    <!-- Order details -->
    <div style="display: flex; justify-content: space-between; margin-top: 5px;">
      <div style="width: 100%;">
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order._id}</p>
        <p style="margin: 5px 0;"><strong>Placed on:</strong> ${new Date(
          order.created_at
        ).toLocaleString()}</p>
        <p style="margin: 5px 0;"><strong>Store:</strong> ${order.storename}</p>
      </div>
    </div>

    <div style="border-top: 1px solid #000; margin: 5px 0;"></div>

    <!-- Customer information -->
    <div style="margin-top: 7px;">
      <p style="margin: 5px 0;">Customer Name: ${order.createduser}</p>
      <p style="margin: 5px 0;">Payment: ${order.payment}</p>
      <p style="margin: 5px 0;">Phone: ${order.customer_details.phone}</p>
    </div>

    <div style="border-top: 1px solid #000; margin: 5px 0;"></div>

    <!-- Items list -->
    <div style="margin-top: 7px;">
      <table width="100%" style="padding: 5px; text-align: left;">
        <tr>
          <th style="width: 60%;">Item</th>
          <th>Qty</th>
          <th>Amount</th>
        </tr>
        ${JSON.parse(order.items)
          .map(
            (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.count}</td>
            <td>₹${item.price}</td>
          </tr>
        `
          )
          .join("")}
      </table>
    </div>

    <div style="border-top: 1px solid #000; margin: 5px 0;"></div>

    <div style="margin-top: 7px;">
      <p style="margin: 5px 0;">Subtotal: ₹${order.subTotal}</p>
      <p style="margin: 5px 0;">Others: ₹${
        order.donation + order.delivery_fee + order.platformFee
      }</p>
    </div>

    <div style="border-top: 1px solid #000; margin: 5px 0;"></div>

    <!-- Total -->
    <div style="font-weight: bold;">
      <p style="margin: 5px 0;"><strong>Total:</strong> ₹${order.total}</p>
    </div>

    <div style="border-top: 1px solid #000; margin: 5px 0;"></div>

    <!-- Footer with link -->
    <div style="text-align: center; margin-top: 10px;">
      <p style="margin: 5px 0;">Order more on Ennore Delivery</p>
      <a href="https://ennore-delivery.netlify.app/" target="_blank" style="text-decoration: none; color: #000; font-weight: bold;">https://ennore-delivery.netlify.app/</a>
    </div>
  </div>
</div>
 `;

  // Replace the body with the receipt content for printing
  document.body.innerHTML = receiptContent;

  // Add a print-specific CSS style to ensure content is printed in the correct size
  const printStyle = `
      <style>
        @media print {
          body {
            margin: 0;
            padding: 0;
            width: 8cm;
            height: auto;
            font-size: 12px;
          }
          @page {
            size: 8cm;
            margin: 0;
          }
        }
      </style>
    `;
  const styleElement = document.createElement("style");
  styleElement.innerHTML = printStyle;
  document.head.appendChild(styleElement);

  // Trigger print and restore original content after printing
  setTimeout(() => {
    window.print();
    window.location.reload();
    document.body.innerHTML = originalContents; // Restore the original page content
    document.head.removeChild(styleElement); // Remove the added print-specific styles
  }, 0);
};

const ItemModal = ({ open, handleClose, order }) => {
  const items = JSON.parse(order?.items || "[]");
  const orderedBy = order?.createduser; // Customer name
  const total = order?.total - order?.donation - order?.delivery_fee; // Total calculation
  const orderId = order?._id; // Order ID
  const placedAtIST = order?.created_at
    ? new Date(order.created_at).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
      })
    : "";

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
          p: 2
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Button onClick={handleClose} variant="contained" sx={{}}>
          Close
        </Button>
      </Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Order Details #{orderId}
      </Typography>
      <Typography variant="body1">Placed At: {placedAtIST}</Typography>
      <Box mb={1}>
        {/* Display Customer Name */}
        <Typography variant="body1">
          Name: {order?.customer_details?.name}
        </Typography>

        {/* Display Phone Number */}
        <Typography variant="body1">
          Phone: {order?.customer_details?.phone}
        </Typography>

        {/* Display Address */}
        <Typography variant="body1">
          Address: {order.customer_details?.address?.address1},{" "}
          {order?.customer_details?.address?.local}
        </Typography>
      </Box>

      <Typography variant="body1">Payment Status : {order.payment}</Typography>

      {order?.instructions && (
        <Box
          sx={{
            mt: 1,
            flex: 1,
            width: "auto",
            padding: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9"
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "0.75rem" }} gutterBottom>
            Instructions:
          </Typography>
          <Typography variant="body1">{order.instructions}</Typography>
        </Box>
      )}
      {/* Items Table */}
      {items && items.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            mt: 1,
            width: "auto",
            height: "350px", // Adjust the height as needed
            overflowY: "auto", // Enable vertical scrolling
            border: "1px solid #ddd", // Add a border
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)" // Optional shadow
          }}
        >
          <Table stickyHeader>
            {" "}
            {/* Sticky header for better visibility */}
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{item.count}</TableCell>
                  <TableCell>{item.name}</TableCell>
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
