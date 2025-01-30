import React, { useEffect } from "react";
import { Grid, Paper, Box, Typography, Button, Divider } from "@mui/material";
import QuantityButton from "./QuantityButton"; // Adjust the import based on your file structure
import { isTokenValid, logout } from "../../../utils/auth";

const getOptimizedImageUrl = (imageUrl) => {
  const [base, imgUrl] = imageUrl.split("/upload/");
  return `${base}/upload/w_300,h_300,c_fill,f_webp/${imgUrl}`;
};

const ItemCardV2 = ({
  item,
  cart,
  setCart,
  addToCart,
  handleOpenModal,
  storeStatus,
  navigate,
  isReady
}) => {
  const cartItem = cart.items.find((cartItem) => cartItem.id === item.id);

  return (
    <Grid item xs={12} sm={3} md={2} key={item.id}>
      <Paper
        onClick={() => handleOpenModal(item)}
        sx={{
          cursor: "pointer",
          p: 1,
          ml: 2,
          height: item?.image ? "140px" : "100px",
          display: "flex",
          transition: "none",
          "&:hover": {
            backgroundColor: "transparent"
          },
          "&:active": {
            backgroundColor: "transparent"
          },
          "&:focus": {
            outline: "none"
          }
        }}
        tabIndex={0}
        elevation={0}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%"
          }}
        >
          {/* Left Section: 60% */}
          <Box
            sx={{
              flex: "3 3 60%",
              display: "flex",
              flexDirection: "column",
              //justifyContent: 'space-between',
              overflow: "hidden"
            }}
          >
            {/* Item Name */}
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                overflow: "hidden",
                mt: 2
              }}
            >
              {item.name}
            </Typography>

            {/* Item Price */}
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontSize: "0.95rem",
                color: "#555",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              ₹{item.price}
            </Typography>
          </Box>

          {/* Right Section: 40% */}
          <Box
            sx={{
              flex: "2 2 40%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              // justifyContent: 'flex-end',
              gap: 0.5
            }}
          >
            {item.image && (
              <Box
                sx={{
                  width: "100px",
                  height: "100px",
                  overflow: "hidden",
                  borderRadius: "4px",
                  flexShrink: 0
                }}
              >
                <img
                  src={getOptimizedImageUrl(item.image)}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  loading="lazy"
                />
              </Box>
            )}
            <Box sx={{ width: "70%" }}>
              {cartItem ? (
                <QuantityButton
                  item={item}
                  cart={cart}
                  setCart={setCart}
                  cartItem={cartItem}
                />
              ) : (
                <Button
                  disableRipple
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!isTokenValid()) {
                      alert("Sign in to Add Cart");
                      return;
                    }
                    addToCart(item);
                  }}
                  sx={{
                    height: "35px",
                    width: "100%",
                    fontSize: "0.75rem",
                    "&:hover": {
                      backgroundColor: "transparent"
                    },
                    "&:active": {
                      backgroundColor: "#e0e0e0"
                    }
                  }}
                  disabled={!isReady}
                >
                  ADD +{" "}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ItemCardV2;
