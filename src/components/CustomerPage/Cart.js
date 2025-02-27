import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom"; // or the appropriate routing library
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Divider,
  Drawer,
  Snackbar,
  CircularProgress,
  FormControlLabel,
  TextField,
  Radio,
  Autocomplete,
  RadioGroup,
  SwipeableDrawer
} from "@mui/material";
import TipAndDonationSection from "./Components/TipAndDonationSection"; // Adjust the import path as needed

import CheckoutButton from "./Components/CheckoutButton"; // Adjust the import path as needed
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import CloseIcon from "@mui/icons-material/Close";
import VillaOutlinedIcon from "@mui/icons-material/VillaOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { api, baseUrl } from "../../utils/api";

import { getCartFromLocalStorage, getUserInfo } from "../../utils/localStorage";
import QuantityButton from "./Components/QuantityButton";

const locations = [
  "Nettukuppam",
  "Ennore Kuppam",
  "Thazhankuppam",
  "Mugathuvara Kuppam",
  "Ulagnathapuram",
  "SVM Nagar",
  "Vallur Nagar",
  "Kamaraj Nagar",
  "High School Surroundings",
  "Kaathukuppam",
  "RS Road",
  "Ennore Bus Depot Surroundings"
];

const LabelTag = ({ text, style = {}, component }) => (
  <Typography
    variant="body2"
    style={{
      fontSize: "0.70rem",
      color: "#888",
      marginLeft: "4px",
      ...style
    }}
    component={component}
  >
    {text}
  </Typography>
);
const PaymentDetailTag = ({ paymentDetails }) => (
  <Paper
    sx={{
      mt: 1,
      p: 1,
      pl: 2,
      pr: 2,
      mb: 2
      //backgroundColor: "#f9f9f9"
    }}
    elevation={1}
  >
    {paymentDetails?.map((item, index) => (
      <Paper key={index} elevation={0} sx={{}}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="body2"
            sx={{
              width: "80%",
              fontWeight: "430",
              textAlign: "right",
              fontSize: "0.70rem",
              pr: 4
            }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              width: "20%",
              fontWeight: "330",
              textAlign: "left",
              fontSize: "0.70rem"
            }}
          >
            ₹{item.value}
          </Typography>
        </Box>
      </Paper>
    ))}{" "}
  </Paper>
);

const PaymentDrawer = ({
  orderId,
  redirectUrl,
  open,
  onClose,
  onOpen,
  cart,
  initiatePhonePePayment,
  storeAllowsCOD,
  total
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null); // Track selected payment method
  const [isProcessing, setIsProcessing] = useState(false); // Show processing state
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({});

  const handlePaymentProceed = async () => {
    setIsProcessing(true);
    try {
      if (paymentMethod === "cod") {
        try {
          await api.put(`/cod/${orderId}?paymentMethod=${paymentMethod}`);
          navigate(`/ordersuccess/${orderId}?status=success`);
        } catch (err) {
          alert("Order Failed");
          navigate("/cart");
        }
      } else if (paymentMethod === "online" || paymentMethod === "partial") {
        await initiatePhonePePayment(orderId, paymentMethod);
      }
    } catch (error) {
      console.error("Payment API error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    const paymentMessages = {
      cod: [
        { title: "Total", value: total },
        { title: "Total to be paid on delivery", value: total }
      ],
      partial: [
        { title: "Total", value: total },
        { title: "Amount to be paid now", value: 10 },
        {
          title: "Amount to be paid on delivery",
          value: total - 10
        }
      ],
      online: [
        { title: "Total", value: total },
        { title: "Transaction Fee (2%)", value: total * 0.02 },
        { title: "Total Payable Amount", value: total + total * 0.02 }
      ]
    };

    // Set the payment details based on the selected payment method
    setPaymentDetails(paymentMessages[paymentMethod]);
  }, [paymentMethod, total]);
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      sx={{
        "& .MuiDrawer-paper": {
          height: "100vh",
          bottom: 20,
          overflowX: "hidden",
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto"
        }
      }}
    >
      <Box>
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#fff",
            pl: 1,
            pr: 1,
            pt: 2
          }}
        >
          <ArrowBackIosNewOutlinedIcon onClick={onClose} />
          <h2 style={{ marginLeft: "10px" }}>Payment</h2>{" "}
        </Box>

        {/* Payment Options */}
        {redirectUrl ? (
          <iframe
            src={redirectUrl}
            style={{
              width: "100%",
              height: "100vh",
              border: "none",
              overflowX: "hidden"
            }}
            title="Payment Page"
          />
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" style={{ marginBottom: "20px" }}>
              Select Payment Method
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {/* Partial Payment */}
              <Paper
                elevation={0}
                sx={{
                  pl: 1,
                  pr: 1,
                  mb: 3,

                  boxSizing: "border-box"
                }}
              >
                <FormControlLabel
                  value="partial"
                  control={<Radio />}
                  label={
                    <>
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{ fontSize: "0.90rem" }}
                      >
                        Partial Online Payment
                      </Typography>
                      <LabelTag text="(Recommended)" component="span" />
                      <LabelTag
                        text=" Just Pay ₹10 now to place your order,
                        balance is payable on delivery."
                      />
                      {paymentMethod === "partial" && (
                        <PaymentDetailTag paymentDetails={paymentDetails} />
                      )}
                    </>
                  }
                />
              </Paper>

              {/* <Paper
                elevation={0}
                sx={{
                  pl: 1,
                  pr: 1,
                  mb: 3,
                  boxSizing: "border-box"
                }}
              >
                <FormControlLabel
                  value="online"
                  control={<Radio />}
                  label={
                    <>
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{ fontSize: "0.90rem" }}
                      >
                        Full Online Payment
                      </Typography>
                      <LabelTag
                        text="(+2% Transaction fee) "
                        component="span"
                      />
                      <LabelTag text="Payment with total of an order + 2% Transaction Charges added" />
                      {paymentMethod === "online" && (
                        <PaymentDetailTag paymentDetails={paymentDetails} />
                      )}
                    </>
                  }
                  disabled={false}
                  sx={{ width: "100%" }}
                />
              </Paper> */}
              <Paper
                elevation={0}
                sx={{
                  pl: 1,
                  pr: 1,
                  mb: 3,

                  boxSizing: "border-box"
                }}
              >
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label={
                    <>
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "0.90rem" }}
                        component="span"
                      >
                        Cash on Delivery
                      </Typography>
                      {!storeAllowsCOD ? (
                        <LabelTag text="(disabled)" component="span" />
                      ) : (
                        <></>
                      )}
                      <LabelTag text="*You may also pay via google pay, PhonePe, etc., on delivery." />
                      {paymentMethod === "cod" && (
                        <PaymentDetailTag paymentDetails={paymentDetails} />
                      )}
                    </>
                  }
                  disabled={!storeAllowsCOD}
                />
              </Paper>
            </RadioGroup>

            <Box sx={{ marginTop: "20px", textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePaymentProceed}
                disabled={!paymentMethod || isProcessing}
              >
                {isProcessing ? <CircularProgress size={24} /> : "Proceed"}
              </Button>
            </Box>
          </Box>
        )}
        <Box sx={{ height: "40px" }} />
      </Box>
    </SwipeableDrawer>
  );
};

const Cart = () => {
  const [cart, setCart] = useState(getCartFromLocalStorage());
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [address, setAddress] = useState(
    getUserInfo() || { name: "", phone: "", address1: "", local: "" }
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [instructions, setInstruction] = useState("");
  const [donation, setDonation] = useState(1);
  const [driverTip, setDriverTip] = useState(1);
  const [drawerItem, setDrawerItem] = useState(null);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponOffer, setCouponOffer] = useState(null);
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [storeAllowsCOD, setStoreAllowsCOD] = useState(false); // Track if the store allows COD
  const [storeDetail, setStoreDetails] = useState({ status: "open" });
  const [deliveryFee, setDeliveryFee] = useState(7.5);
  const subtotal = cart.items.reduce(
    (total, item) => total + item.price * item.count,
    0
  );
  let platformFee = 2;
  const total = subtotal + platformFee + deliveryFee + donation + driverTip;

  const handleChange = (field) => (event) => {
    setAddress({ ...address, [field]: event.target.value });
  };
  useEffect(() => {
    setCart(getCartFromLocalStorage());
  }, []);

  const handleDrawer = (item) => {
    setDrawerItem(item);
    setDrawerOpen(true);
  };

  const initiatePhonePePayment = async (orderId, paymentMethod) => {
    try {
      const response = await api.post(
        `initiate-payment?paymentMethod=${paymentMethod}`,
        {
          merchantTransactionId: orderId,
          redirectUrl: `https://ennore-delivery-api.onrender.com/ennore-delivery/redirect`, //
          callbackUrl: `https://ennore-delivery-api.onrender.com/ennore-delivery/callback-payment` // Backend callback URL
        }
      );

      if (response.data.success) {
        window.location.href = response.data.redirectUrl;
      } else {
        setLoading(false);
        setIsDrawerOpen(false);
        console.error("Payment initiation failed:", response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setIsDrawerOpen(false);
      console.error("Error initiating payment:", error);
    }
  };

  const closeDrawer = () => {
    setLoading(false);
    setIsDrawerOpen(false);
    setRedirectUrl("");
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await api.get(`/stores/${cart.storeId}`); // Replace with your actual store API endpoint
        setStoreDetails(response.data); //status open close , minOrderValue
        setStoreAllowsCOD(response.data?.cod || false); //();
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };
    if (cart?.storeId) {
      fetchStoreData();
    }
  }, []);

  useEffect(() => {
    setCouponOffer(null);
    setDeliveryFee(7.5);
  }, [coupon, setCoupon]);

  const handleCheckout = async () => {
    console.log(storeDetail.minOrderValue);
    let minOrderValue = storeDetail.minOrderValue || 100;
    setLoading(true);
    if (minOrderValue > subtotal) {
      alert("Minimum order value is Rs." + minOrderValue);
      setLoading(false);
      return;
    }

    if (!address.address1 || !address.phone) {
      alert("name and address required");
      setLoading(false);
      return;
    }
    // Create orderData object
    const orderData = {
      userId: getUserInfo()?._id,
      storeId: cart.storeId,
      storename: cart.storeName,
      createduser: getUserInfo().name,
      total: total,
      delivery_fee: deliveryFee,
      donation: donation,
      orderType: "delivery",
      status: "new",
      customer_details: {
        address: {
          address1: address.address1,
          local: address.local
        },
        name: address.name, // Ensure you have a name field in address
        phone: address.phone,
        id: address._id,
        email: address.email
      },
      items: cart.items,
      driverTip,
      platformFee,
      subTotal: subtotal,
      payment: "pending",
      redirectUrl: `${window.origin}/ordersuccess}`, //
      callbackUrl: `${baseUrl}callback-payment`,
      instructions: instructions
    };
    if (coupon) {
      orderData.couponId = coupon;
    }
    let response;
    try {
      response = await api.post("orders", orderData);
    } catch (err) {
      setLoading(false);
      console.log(err);

      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // Show the error message
      } else {
        alert("An unexpected error occurred"); // Fallback for other errors
      }
    }

    if (response?.data?.order?._id) {
      let orderId = response.data.order._id;
      if (orderId) {
        setIsDrawerOpen(true);
        // if (storeAllowsCOD) {
        //   setIsDrawerOpen(true);
        // } else {
        //   await initiatePhonePePayment(orderId);
        // }
        setCreatedOrderId(orderId);
      } else {
        setLoading(false);
        alert("Error in creating order");
      }
    }
  };

  const handleCoupon = async (e) => {
    try {
      if (!coupon) {
        alert("Not valid");
        return;
      }
      //setCoupon(coupon);
      const response = await api.get(
        `coupon/${coupon}?storeId=${cart.storeId}`
      );
      if (response.data.valid) {
        const onWhat = response.data?.on;
        if (onWhat === "deliveryFee") {
          setDeliveryFee(0);
        }
        setCouponOffer(response.data);
      } else {
        alert("Not valid Coupon");
      }
    } catch (err) {
      console.log(err);
      alert("Not valid Coupon");
    }
  };

  return (
    <>
      <PaymentDrawer
        redirectUrl={redirectUrl}
        open={isDrawerOpen}
        onClose={closeDrawer}
        onOpen={() => setIsDrawerOpen(true)}
        orderId={createdOrderId}
        cart={cart}
        initiatePhonePePayment={initiatePhonePePayment}
        storeAllowsCOD={storeAllowsCOD}
        total={total}
        platformFee={platformFee}
        deliveryFee={deliveryFee}
      />
      <Box
        sx={{
          display: "flex",
          position: "sticky",
          alignItems: "center",
          top: 0,
          zIndex: 10,
          backgroundColor: "inherit",
          mt: 1,
          ml: 1
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosNewOutlinedIcon />
        </IconButton>{" "}
        Go back
        <Divider />
      </Box>
      {cart.items.length ? (
        <Box sx={{ padding: 2 }}>
          {/* Cart Items */}

          <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
            {storeDetail?.minOrderValue > subtotal && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: "0.75rem",
                  color: "red", // Red color for the error message
                  mb: 1
                }}
              >
                Minimum order value is Rs.{storeDetail.minOrderValue}
              </Typography>
            )}

            <Typography
              variant="body1"
              sx={{ fontSize: "0.75rem", color: "#555", mb: 1 }}
            >
              Add More from{" "}
              <Link
                to={`/stores/${cart.storeId}`}
                style={{
                  fontSize: "0.80rem",
                  fontWeight: 500,
                  color: "main.primary",
                  textDecoration: "underline"
                }}
              >
                {cart.storeName}
              </Link>
            </Typography>
            {cart.items.map((item) => (
              <Box key={item.name} sx={{ mb: 2, display: "flex" }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "0.75rem", color: "#555" }}
                  >
                    Rs.{item.price}
                  </Typography>
                </Box>
                <Box>
                  <QuantityButton
                    item={item}
                    cart={cart}
                    setCart={setCart}
                    cartItem={item}
                  />
                  <Typography
                    variant="body2"
                    align="right"
                    sx={{ flex: "0 0 0%" }}
                  >
                    Rs. {item.price * item.count}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Typography variant="subtitle2" sx={{ textAlign: "right" }}>
              Subtotal: Rs. {subtotal}
            </Typography>

            <Box
              sx={{ display: "flex", alignItems: "center", marginY: 1 }}
              onClick={() => handleDrawer("charges")}
            >
              <ReceiptLongOutlinedIcon />
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{ marginLeft: 1, fontSize: "0.8rem" }}
                  >
                    Total Bill:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ marginLeft: 1, fontWeight: 500, fontSize: "0.8rem" }}
                  >
                    {total}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ marginLeft: 1, fontSize: "0.8rem" }}
                >
                  Incl. Delivery Fee & Charges
                </Typography>
              </Box>
              <IconButton onClick={() => handleDrawer("charges")}>
                <KeyboardArrowRightOutlinedIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                mt: 2,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: 1
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    height: "30px",
                    "& .MuiInputBase-root": {
                      height: "30px"
                    }
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    height: "30px",
                    whiteSpace: "nowrap",
                    fontSize: "0.75rem"
                  }}
                  onClick={handleCoupon}
                >
                  Apply
                </Button>
              </Box>

              {couponOffer && coupon && (
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: "#e8f5e9",
                    color: "#2e7d32",
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <span role="img" aria-label="Hurray">
                    🎉
                  </span>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {couponOffer?.description}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                p: 0,
                mt: 2,

                borderRadius: "8px"
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Enter your instructions here..."
                value={instructions}
                onChange={(e) => setInstruction(e.target.value)}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  fontSize: "0.75rem"
                }}
              />
            </Box>
          </Paper>

          {/* Delivery Details */}
          <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
            {/*    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DeliveryDiningOutlinedIcon />
                    <Typography variant="body1" sx={{ marginLeft: 1 }}>Delivery in 47 mins</Typography>
                </Box>
                <Divider /> */}
            <Box
              sx={{ display: "flex", alignItems: "center", marginY: 1 }}
              onClick={() => handleDrawer("deliver")}
            >
              <VillaOutlinedIcon />
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ marginLeft: 1, fontWeight: 500, fontSize: "0.8rem" }}
                >
                  Deliver at:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginLeft: 1,
                    fontSize: "0.8rem",
                    color: address.phone ? "inherit" : "red	"
                  }}
                >
                  {address.address1
                    ? address.address1 + ", " + address.local
                    : "Add Address"}
                </Typography>
              </Box>
              <IconButton onClick={() => handleDrawer("deliver")}>
                <KeyboardArrowRightOutlinedIcon />
              </IconButton>
            </Box>
            <Divider />
            <Box
              sx={{ display: "flex", alignItems: "center", marginY: 1 }}
              onClick={() => handleDrawer("phone")}
            >
              <LocalPhoneOutlinedIcon />

              <Typography
                variant="body1"
                sx={{
                  marginLeft: 1,
                  flexGrow: 1,
                  fontSize: "0.8rem",
                  color: address.phone ? "inherit" : "red	"
                }}
              >
                {address.phone
                  ? address.name + "( " + address.phone + " )"
                  : "Add Phone number"}
              </Typography>
              <IconButton onClick={() => handleDrawer("phone")}>
                <KeyboardArrowRightOutlinedIcon />
              </IconButton>
            </Box>
            <Divider />
            <Box
              sx={{ display: "flex", alignItems: "center", marginY: 1 }}
              onClick={() => handleDrawer("charges")}
            >
              <ReceiptLongOutlinedIcon />
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{ marginLeft: 1, fontSize: "0.8rem" }}
                  >
                    Total Bill:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ marginLeft: 1, fontWeight: 500, fontSize: "0.8rem" }}
                  >
                    {total}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ marginLeft: 1, fontSize: "0.8rem" }}
                >
                  Incl. Delivery Fee & Charges
                </Typography>
              </Box>
              <IconButton onClick={() => handleDrawer("charges")}>
                <KeyboardArrowRightOutlinedIcon />
              </IconButton>
            </Box>
            <Divider />
          </Paper>

          <TipAndDonationSection
            title="Support your delivery partner"
            subtitle="Show appreciation with a tip in these challenging times"
            amounts={[0, 1, 2, 3, 4, 5]}
            selectedAmount={driverTip}
            setSelectedAmount={setDriverTip}
            icon={<DeliveryDiningOutlinedIcon />}
          />

          {/* Donation Section */}
          <TipAndDonationSection
            title="Donation"
            subtitle="Show appreciation with a donation to grow all"
            amounts={[0, 1, 2, 3, 4, 5]}
            selectedAmount={donation}
            setSelectedAmount={setDonation}
            icon={<VolunteerActivismOutlinedIcon />}
          />

          <Box sx={{ height: "80px" }} />
          {/* Checkout Button */}

          <CheckoutButton
            total={total}
            loading={loading}
            handleCheckout={handleCheckout}
            storeOpen={storeDetail ? storeDetail?.status === "open" : true}
            storeDetail={storeDetail}
          />

          {/* Drawer for Address */}
          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              "& .MuiDrawer-paper": {
                height: "auto",
                bottom: 0,
                borderRadius: "16px 16px 0 0"
              }
            }}
          >
            <Box sx={{ padding: 2 }}>
              {/* Close Icon */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {drawerItem === "phone" && (
                <>
                  <Typography variant="h6">
                    Update Receiver's Details
                  </Typography>
                  <TextField
                    label="Receiver's Name"
                    variant="outlined"
                    fullWidth
                    value={address.name}
                    onChange={handleChange("name")}
                    sx={{ mt: 1, mb: 1 }}
                  />
                  <TextField
                    label="Receiver's Mobile Number"
                    variant="outlined"
                    fullWidth
                    value={address.phone}
                    onChange={handleChange("phone")}
                    sx={{ mt: 1, mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDrawerOpen(false);
                    }}
                  >
                    Submit
                  </Button>
                </>
              )}

              {drawerItem === "deliver" && (
                <>
                  <Typography variant="h6">Update Delivery Details</Typography>
                  <TextField
                    label="Full Address"
                    variant="outlined"
                    fullWidth
                    value={address.address1}
                    onChange={handleChange("address1")}
                    sx={{ mt: 1, mb: 2 }}
                  />
                  <Autocomplete
                    fullWidth
                    sx={{ mt: 1, mb: 2 }}
                    options={locations}
                    value={address.local}
                    onChange={(event, newValue) => {
                      setAddress({ ...address, local: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Local Area"
                        variant="outlined"
                      />
                    )}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDrawerOpen(false);
                    }}
                  >
                    Submit
                  </Button>
                </>
              )}

              {drawerItem === "charges" && (
                <>
                  <Typography variant="h6">Bill Summary</Typography>
                  <Divider sx={{ marginY: 1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginY: 1
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ReceiptLongOutlinedIcon sx={{ marginRight: 1 }} />
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        Item Total:
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.8rem" }}>
                      ₹{subtotal}
                    </Typography>
                  </Box>
                  <Divider sx={{ marginY: 1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginY: 1
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocalShippingOutlinedIcon sx={{ marginRight: 1 }} />
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        Delivery Partner Fee:
                      </Typography>
                    </Box>

                    {couponOffer?.on === "deliveryFee" ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {/* Coupon Applied Label */}
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            color: "green",
                            marginRight: 2 // Space before the striked-out fee
                          }}
                        >
                          Coupon Applied🎉
                        </Typography>

                        {/* Displaying the striked out original fee */}
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            textDecoration: "line-through", // This adds the strike-through effect
                            marginRight: 1, // Adds space between the original and new fee
                            color: "green"
                          }}
                        >
                          ₹{7.5}
                        </Typography>

                        {/* Displaying the new fee */}
                        <Typography sx={{ fontSize: "0.8rem", color: "green" }}>
                          ₹{0}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        ₹{deliveryFee}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ marginY: 1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginY: 1
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <MonetizationOnOutlinedIcon sx={{ marginRight: 1 }} />
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        Platform Fee:
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.8rem" }}>
                      ₹{platformFee}
                    </Typography>
                  </Box>
                  <Divider sx={{ marginY: 1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginY: 1
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <VolunteerActivismOutlinedIcon sx={{ marginRight: 1 }} />
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        Donation:
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.8rem" }}>
                      ₹{donation}
                    </Typography>
                  </Box>
                  <Divider sx={{ marginY: 1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginY: 1,
                      fontWeight: "bold"
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <MonetizationOnOutlinedIcon sx={{ marginRight: 1 }} />
                      <Typography variant="h6">Grand Total:</Typography>
                    </Box>
                    <Typography variant="h6">₹{total}</Typography>
                  </Box>
                </>
              )}

              <Box sx={{ height: "80px" }} />
            </Box>
          </Drawer>

          {/* Snackbar for Success Message */}
          <Snackbar
            open={Boolean(successMessage)}
            autoHideDuration={6000}
            onClose={() => setSuccessMessage("")}
            message={successMessage}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh"
          }}
        >
          <Box textAlign="center">
            <Typography gutterBottom>Your cart is empty</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/stores")}
            >
              Click here to order
            </Button>
          </Box>
        </Box>
      )}{" "}
    </>
  );
};

export default Cart;
