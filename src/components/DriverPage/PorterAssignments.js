// src/components/PorterAssignments.js
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  SwipeableDrawer,
  IconButton,
  Paper,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Button
} from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { api } from "../../utils/api";
import { getUserInfo } from "../../utils/localStorage";
import { goToDeliveries, goToPorterAssignments } from "./Deliveries";
import { useNavigate } from "react-router-dom";

const porterStatus = { new: "picked", picked: "delivered" };

function getRelativeTimeFromIST(istDateString) {
  if (!istDateString) return "Invalid date";

  // Split date and time parts
  const [datePart, timePart] = istDateString.split(", ");
  if (!datePart || !timePart) return "Invalid date";

  // Parse the date part (DD/MM/YYYY)
  const [day, month, year] = datePart.split("/").map(Number);

  // Parse the time part (hh:mm:ss am/pm)
  const [time, period] = timePart.split(" ");
  const [hours, minutes, seconds] = time.split(":").map(Number);

  // Convert 12-hour time to 24-hour time
  const adjustedHours =
    period.toLowerCase() === "pm" && hours !== 12
      ? hours + 12
      : period.toLowerCase() === "am" && hours === 12
      ? 0
      : hours;

  // Create the Date object
  const parsedDate = new Date(
    year,
    month - 1,
    day,
    adjustedHours,
    minutes,
    seconds
  );

  if (isNaN(parsedDate)) return "Invalid date"; // Ensure it's a valid date

  // Calculate relative time
  const now = new Date();
  const diff = now - parsedDate; // Difference in milliseconds

  const secondsDiff = Math.floor(diff / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);

  if (daysDiff > 0) {
    return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
  } else if (hoursDiff > 0) {
    return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;
  } else if (minutesDiff > 0) {
    return `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} ago`;
  } else {
    return `${secondsDiff} second${secondsDiff > 1 ? "s" : ""} ago`;
  }
}

const PorterAssignments = () => {
  const [value, setValue] = useState(0); // Track the active tab

  const [assignedOrders, setAssignedOrders] = useState([]);
  const [filteredOrders, setFilteredOrderss] = useState([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false); // Loading state for assigned orders
  const [error, setError] = useState(null); // For error handling
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const fetchDriverAssignments = async () => {
    try {
      //setLoadingAssignments(true); // Set loading state to true before the request
      const response = await api.get(
        `/assign-driver?driverId=${getUserInfo()._id}`
      );
      setAssignedOrders(response.data.assignments);
      setFilteredOrderss(
        response.data.assignments.filter((a) => a.status !== "delivered")
      );
      setError(null); // Clear any previous errors on success
    } catch (error) {
      setError("Error fetching driver assignments"); // Set an error message if the request fails
      console.error("Error fetching driver assignments:", error); // Log the error for debugging
    } finally {
      // setLoadingAssignments(false); // Set loading state to false after the request finishes (whether successful or not)
    }
  };

  const porterStatusUpdate = async () => {
    try {
      const deliveryPartnerId = getUserInfo()._id;
      const name = getUserInfo().name;

      if (porterStatus[selectedOrder.status]) {
        // porterStatus[selectedOrder.status] === "picked";
        const response = await api.put(
          `/assign-driver?driverId=${getUserInfo()._id}`,
          {
            assignmentId: selectedOrder._id,
            status: porterStatus[selectedOrder.status],
            pickedTime: new Date(),
            deliveredTime: new Date()
          }
        );
      } else {
        // Update the order status
        const newStatus = porterStatus[selectedOrder.status].toLowerCase();
        await api.put(`/orders/${selectedOrder._id}/status`, {
          status: newStatus
        });
        //fetchNewOrders();v c
      }
      setDrawerOpen(false);
    } catch (error) {
      setError("Assign failed");
      console.error("Error assigning order:", error);
    }
  };

  // Handle tab change
  const handleTabChange = async (vent, newValue) => {
    console.log(newValue);
    setValue(newValue);
    if (newValue === 0) {
      setFilteredOrderss(
        assignedOrders.filter((a) => a.status !== "delivered")
      );
    } else if (newValue === 1) {
      setFilteredOrderss(
        assignedOrders.filter((a) => a.status === "delivered")
      );
      console.log(assignedOrders.filter((a) => a.status === "delivered"));
    } else {
      //await fetchCompletedOrders();
    }
  };

  const handleRowClick = (order) => {
    console.log(order);
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  useEffect(() => {
    // Fetch new orders by default when the component mounts
    fetchDriverAssignments();
  }, []);
  console.log(assignedOrders);

  return (
    <Box>
      <Button
        type="text"
        onClick={() => {
          if (window.location.pathname === "/deliveries") {
            goToPorterAssignments(navigate); // Function call when the button is clicked
          } else {
            goToDeliveries(navigate); // Function call when the button is clicked
          }
        }}
      >
        {"<"} Go to{" "}
        {window.location.pathname === "/deliveries"
          ? "Porter Assignments"
          : "Orders"}
      </Button>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#fff",
          pt: 1
        }}
      >
        {" "}
        <Tabs
          //sx={{ mt: 2 }}
          value={value}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="inherit"
          centered
        >
          <Tab label="Porter" />
          <Tab label="Done" />
        </Tabs>
      </Box>

      <Box sx={{ padding: 2 }}>
        {/* Error message */}
        {error && (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        )}

        {/* Assigned Orders Tab */}
        {(value === 0 || value === 1) &&
          (loadingAssigned ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow
                        key={order._id}
                        onClick={() => handleRowClick(order)}
                      >
                        <TableCell>{order.driverName}</TableCell>{" "}
                        {/* Customer Name */}
                        <TableCell>{order.fromAddress}</TableCell> {/* Price */}
                        <TableCell>{order.status}</TableCell> {/* Status */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No orders assigned to you.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ))}
      </Box>

      {/* Swipeable Drawer for Order Details */}
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        sx={{
          "& .MuiDrawer-paper": {
            height: "90%",
            bottom: 0,
            borderRadius: "16px 16px 0 0",
            overflowY: "auto"
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
            backgroundColor: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 10
          }}
        >
          <IconButton onClick={() => setDrawerOpen(false)}>
            <KeyboardArrowDownOutlinedIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
            Order Details
          </Typography>

          {selectedOrder?.status !== "delivered" ||
          selectedOrder.status !== "cancelled" ? (
            <Button
              onClick={porterStatusUpdate}
              sx={{
                backgroundColor: porterStatus[selectedOrder?.status]
                  ? "red"
                  : selectedOrder?.deliver_by
                  ? "inherit"
                  : "red",
                color: "white",
                "&:hover": {
                  backgroundColor: "#c62828"
                }
              }}
              disabled={!porterStatus[selectedOrder?.status]}
            >
              {porterStatus[selectedOrder?.status]}
            </Button>
          ) : (
            <Button sx={{ backgroundColor: "green" }}>Delivered</Button>
          )}
        </Box>

        {selectedOrder && selectedOrder?.assignmentId && (
          <>
            <Paper elevation={3} sx={{ borderRadius: 2, padding: 1, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  justifyContent: "center",
                  my: 1
                }}
              >
                <Typography variant="body1" sx={{ fontSize: "0.75rem", mr: 2 }}>
                  <strong>Assignment ID:</strong> {selectedOrder?._id}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>
                  Pickup Address:{selectedOrder?.fromAddress}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>
                  Pickup Contact:{selectedOrder?.senderPhone}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>
                  Drop Address:{selectedOrder?.toAddress}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>
                  Drop Contact:{selectedOrder?.receiverPhone}
                </Typography>
              </Box>
            </Paper>
          </>
        )}
      </SwipeableDrawer>
    </Box>
  );
};

export default PorterAssignments;
