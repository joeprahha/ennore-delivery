import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  SwipeableDrawer,
  AppBar,
  Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuantityButton from "./QuantityButton"; // Adjust import as needed
import { isTokenValid } from "../../../utils/auth";

const ItemDetailModal = ({
  open,
  onClose,
  item,
  storeInfo,
  cart,
  setCart,

  addToCart,
}) => {
  const cartItem = cart.items.find((cartItem) => cartItem?.id === item?.id);
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          height: "83%",
          bottom: 0,
          borderRadius: "16px 16px 0 0",
          overflowY: "auto",
        },
      }}
    >
      {/* AppBar with title */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#fff", color: "#000" }}
        elevation={0}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {item?.name}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Modal content */}
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Image section */}
        <Box
          component="img"
          src={item?.image || storeInfo?.logo}
          alt={item?.name}
          sx={{
            width: "100%",
            height: "40%",
            objectFit: "contain",
          }}
        />

        {/* Details section */}
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5">{item?.name}</Typography>
          <Typography variant="h6" color="textSecondary">
            Rs. {item?.price}
          </Typography>
          {item?.description && (
            <Typography variant="h5" fontSize={"0.70rem"}>
              {item.description}
            </Typography>
          )}
        </Box>

        {/* Action buttons */}
        <Box sx={{ padding: 2 }}>
          {storeInfo?.status !== "open" ? (
            <Button
              variant="outlined"
              fullWidth
              disabled
              sx={{
                height: "40px",
                fontSize: "0.9rem",
                cursor: "not-allowed",
              }}
            >
              Store Closed
            </Button>
          ) : cartItem ? (
            <QuantityButton
              item={item}
              cart={cart}
              setCart={setCart}
              cartItem={cartItem}
              height={"60px"}
            />
          ) : (
            <Button
              variant="outlined"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                if (!isTokenValid()) {
                  alert("Sign in to Add Cart");
                  return;
                }
                addToCart(item);
              }}
              sx={{
                height: "60px",
                fontSize: "0.9rem",
              }}
            >
              Add to Cart
            </Button>
          )}
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default ItemDetailModal;
