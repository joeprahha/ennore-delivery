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

const steps = ["Placed", "Accepted", "Ready", "Driver Picked", "Delivered"];
const collectionSteps = ["Placed", "Accepted", "Ready"];
const getStatusIndex = (status) => {
  switch (status) {
    case "new":
      return 0;
    case "accepted":
      return 1;
    case "ready":
      return 2;
    case "picked":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
};
const DriverStatus = { ready: "Picked", picked: "Delivered" };

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
  const [orders, setOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]); // Added state for assigned orders
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loadingNew, setLoadingNew] = useState(false);
  const [loadingAssigned, setLoadingAssigned] = useState(false); // Loading state for assigned orders
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [error, setError] = useState(null); // For error handling
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);



  const fetchDriverAssignments = async () => {
    try {
      //setLoadingAssignments(true); // Set loading state to true before the request
      const response = await api.get(
        `/assign-driver?driverId=${getUserInfo()._id}`
      );
      setAssignedOrders(response.data); // Set the state with the fetched assignments
      //setUnassignedAssignments(response.data.filter((a) => a.status !== "completed")); // Filter the unassigned or incomplete assignments
      setError(null); // Clear any previous errors on success
    } catch (error) {
      setError("Error fetching driver assignments"); // Set an error message if the request fails
      console.error("Error fetching driver assignments:", error); // Log the error for debugging
    } finally {
      // setLoadingAssignments(false); // Set loading state to false after the request finishes (whether successful or not)
    }
  };



  const assignToMe = async () => {
    try {
      const deliveryPartnerId = getUserInfo()._id;
      const name = getUserInfo().name;

      if (!selectedOrder?.deliver_by && DriverStatus[selectedOrder.status]) {
        // Update the delivery partner
        const response = await api.put(
          `/orders/${selectedOrder._id}/delivery-partner`,
          {
            deliveryPartnerId,
            name
          }
        );
        setNewOrders(response.data);
      } else {
        // Update the order status
        const newStatus = DriverStatus[selectedOrder.status].toLowerCase();
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
    setValue(newValue);
    if (newValue === 0) {
      await fetchDriverAssignments();
    } else if (newValue === 1) {
      //  await fetchDriverAssignments();
      //fetchNewOrders();
    } else {
      //await fetchCompletedOrders();
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  useEffect(() => {
    // Fetch new orders by default when the component mounts
    fetchDriverAssignments()
  }, []);

  return (
    <Box>
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
          sx={{ mt: 2 }}
          value={value}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="inherit"
          centered
        >
          <Tab label="Porter" />
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
        {value === 0 &&
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
                  {assignedOrders.length > 0 ? (
                    [assignedOrders]
                      .filter(
                        (order) =>
                          (order?.deliver_by === getUserInfo().name ||
                            order?.diverName === getUserInfo().name) &&
                          (order.status !== "delivered" ||
                            order.status !== "cancelled")
                      )
                      .map((order) => (
                        <TableRow
                          key={order.id}
                          onClick={() => handleRowClick(order)}
                        >
                          <TableCell>{order.createduser}</TableCell>
                          <TableCell>{order.total}</TableCell>
                          <TableCell>{order.status}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
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
              onClick={assignToMe}
              sx={{
                backgroundColor: DriverStatus[selectedOrder?.status]
                  ? "red"
                  : selectedOrder?.deliver_by
                  ? "inherit"
                  : "red",
                color: "white",
                "&:hover": {
                  backgroundColor: "#c62828"
                }
              }}
              disabled={!DriverStatus[selectedOrder?.status]}
            >
              {selectedOrder?.deliver_by
                ? DriverStatus[selectedOrder?.status] ||
                  selectedOrder?.deliver_by
                : "Assign to Me"}
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
                  Drop Contact:{selectedOrder?.reciverPhone}
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
