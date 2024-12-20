import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Divider,
  Button,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Chip,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "../../utils/api";
import { decodeToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import BikeLoader from "../../loader/BikeLoader";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const steps = ["Placed", "Accepted", "Ready", "Driver Picked", "Delivered"];
const collectionSteps = ["Placed", "Accepted", "Ready"];

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const storeImages = {
    "Fun O Feast":
      "https://res.cloudinary.com/dq6e1ggmv/image/upload/v1729698487/IMG_3971-removebg-preview-Photoroom_i0fymt.png"
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteOrder = () => {};
  const handleViewOrder = async (order) => {
    let response;
    try {
      response = await api.get(`order/${order._id}`);
    } catch (r) {}
    setSelectedOrder(response.data || order);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get(`orders/${decodeToken().id}`);
      setOrders(response.data);
      filterRecentOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch order history:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const filterRecentOrders = (data) => {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const filtered = data.filter(
      (order) => new Date(order.created_at) >= tenDaysAgo
    );
    setFilteredOrders(filtered);
  };

  const refetchPaymentStatus = async (e, id) => {
    e.stopPropagation();
    await api.post(
      `https://ennore-delivery-api.onrender.com/ennore-delivery/redirect-payment/${id}`
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Orders</Typography>

      <Grid container spacing={2}>
        {loading ? (
          <BikeLoader />
        ) : filteredOrders.length === 0 ? (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh"
            }}
          >
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                No orders
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/stores")}
              >
                Click here to order
              </Button>
            </Box>
          </Grid>
        ) : (
          filteredOrders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Paper
                sx={{ p: 1, fontSize: "0.75rem", mb: 2 }}
                onClick={() => handleViewOrder(order)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={storeImages[order.storename] || "app.png"}
                      alt={order.storename}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "8px",
                        objectFit: "contain",
                        objectPosition: "center"
                      }} // Adjust styles as needed
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                    >
                      {order.storename}
                    </Typography>
                  </Box>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    flexGrow: 1
                  }}
                >
                  Order id :{order._id}
                </Typography>
                <Divider sx={{ my: 1 }} />
                {JSON.parse(order.items)
                  .slice(0, 3)
                  .map((item, itemIndex) => (
                    <Box
                      key={itemIndex}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                        {item.count} x {item.name}
                      </Typography>
                    </Box>
                  ))}
                {}
                {JSON.parse(order.items).length > 3 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.75rem", color: "blue" }}
                    >
                      ...Show more
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.7rem",
                      flexGrow: 1
                    }}
                  >
                    Placed on:{" "}
                    {new Date(order.created_at).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata"
                    })}{" "}
                    <br />
                    Status: {order.status === "new" ? "Placed" : order.status}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                  >
                    ₹{order.total}
                  </Typography>

                  <ChevronRightOutlinedIcon
                    onClick={() => handleViewOrder(order)}
                  />
                </Box>

                <Box
                  sx={{
                    padding: 1,
                    mt: 2,

                    borderColor: order.payment === "paid" ? "green" : "red",
                    borderRadius: 1
                  }}
                >
                  {order.payment === "paid" ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "green",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        mr: 2
                      }}
                      textAlign="right"
                    >
                      Paid
                    </Typography>
                  ) : (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          mr: 2
                        }}
                        textAlign="right"
                      >
                        {order.status==='cancelled'?'Order Cancelled':order.payment === "failed"
                          ? "Payment Failed"
                          : order.payment}
                      </Typography>
                      {/* Disclaimer */}
                      {order.payment !== "cash on delivery" && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          {" "}
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.75rem",
                              color: "text.secondary",
                              marginTop: 1
                            }}
                          >
                            If the amount was debited
                          </Typography>
                          {/* Refetch Button */}
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{
                              width: "120px",
                              fontSize: "0.55rem",
                              marginTop: 1
                            }}
                            onClick={(e) => refetchPaymentStatus(e, order._id)}
                          >
                            Refetch Payment Status
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ p: 0 }}
      >
        <MenuItem
          onClick={() =>
            handleViewOrder(
              orders.find((order) => order.id === selectedOrder._id)
            )
          }
          sx={{ fontSize: "0.75rem" }}
        >
          Invoice
        </MenuItem>
        <MenuItem onClick={handleDeleteOrder} sx={{ fontSize: "0.75rem" }}>
          Delete Order
        </MenuItem>
      </Menu>

      {/* Drawer for Order Details */}
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        sx={{
          "& .MuiDrawer-paper": {
            height: "auto",
            bottom: 0,

            overFlowY: "auto"
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "inherit"
          }}
        >
          <IconButton onClick={() => setDrawerOpen(false)}>
            <KeyboardArrowDownOutlinedIcon />
          </IconButton>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <Typography variant="h6" align="left" sx={{ fontSize: "0.75rem" }}>
              {selectedOrder?.storename}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.75rem", color: "primary.main" }}
            >
              Ennore Delivery
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="h6"
          align="left"
          sx={{ fontSize: "0.75rem", pl: 2, pb: 1 }}
        >
          orderId : #{selectedOrder?._id}
        </Typography>
        {selectedOrder?.payment === "paid" ? (
          <Typography
            variant="body2"
            sx={{
              pl: 2,
              color: "green",
              fontSize: "0.75rem",
              fontWeight: "bold"
            }}
          >
            Paid
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              pl: 2,
              color: "red",
              fontSize: "0.55rem",

              fontWeight: "bold"
            }}
          >
            {selectedOrder?.payment === "failed"
              ? "Payment failed"
              : selectedOrder?.payment}
          </Typography>
        )}
        <Divider />

        <Typography
          variant="h6"
          align="left"
          sx={{ fontSize: "0.75rem", p: 2 }}
        >
          Your order is {selectedOrder?.status}
        </Typography>

        <Stepper
          activeStep={getStatusIndex(selectedOrder?.status)}
          sx={{ mb: 3 }}
          alternativeLabel
        >
          {(selectedOrder?.orderType === "collection"
            ? collectionSteps
            : steps
          ).map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider />
        <Typography
          variant="body2"
          sx={{ fontSize: "1rem", fontWeight: "500", p: 1 }}
        >
          {" "}
          Your Orders{" "}
        </Typography>
        {selectedOrder?.items &&
          JSON.parse(selectedOrder.items).map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "space-between", p: 1 }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                  {item.count} x ₹{item.price}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                ₹{(item.price * item.count).toFixed(2)}
              </Typography>
            </Box>
          ))}

        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pl: 1,
            pr: 1
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
            Driver Fee
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
            ₹{selectedOrder?.delivery_fee?.toFixed(2)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pl: 1,
            pr: 1
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
            Donation
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
            ₹{selectedOrder?.donation?.toFixed(2)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pl: 1,
            pr: 1
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
            Driver Tip
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
            ₹{selectedOrder?.driverTip?.toFixed(2)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pl: 1,
            pr: 1
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
            Platform Fee
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
            ₹{selectedOrder?.platformFee?.toFixed(2)}
          </Typography>
        </Box>
        {/* Add more fee breakdowns as needed */}
        <Divider />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", p: 1, pr: 1 }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
            Total
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
            ₹{selectedOrder?.total?.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />
        <Box sx={{ height: "40px", width: "100%" }}>
          <Chip
            label="Download Invoice"
            sx={{ width: "100%" }}
            onClick={() => console.log("Download invoice")}
            variant="outlined"
          />
        </Box>
        <Typography
          variant="subtitle2"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main", mb: 8, p: 2 }}
        >
          Thanks ,Ennore Delivery!!
        </Typography>
        <Box sx={{ height: "180px" }} />
      </SwipeableDrawer>
    </Box>
  );
};

export default OrderHistory;
