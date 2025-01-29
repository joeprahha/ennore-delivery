import React, { useState } from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import QuantityButton from "./QuantityButton"; // Adjust the import based on your file structure
import { isTokenValid, logout } from "../../../utils/auth";

const getOptimizedImageUrl = (imageUrl) => {
  if (imageUrl) {
    if (imageUrl.includes("/upload/") && imageUrl.includes("cloudinary")) {
      const [base, imgUrl] = imageUrl?.split("/upload/");
      return `${base}/upload/w_300,h_300,c_fill,f_webp/${imgUrl}`;
    } else {
      return imageUrl;
    }
  }
  return "";
};

const ItemCard = ({
  item,
  cart,
  setCart,
  addToCart,
  handleOpenModal,
  storeStatus,
  navigate
}) => {
  const [selectedVariant, setSelectedVariant] = useState(
    item?.variant?.[0] ?? null
  );
  const cartItem = cart.items.find((cartItem) => cartItem.id === item.id);

  const handleVariantSelect = (event) => {
    event.stopPropagation();
    const variant = item.variant.find((v) => v.qty === event.target.value);
    setSelectedVariant(variant);
  };

  const currentPrice = selectedVariant ? selectedVariant.price : item.price;
  const currentMRP = selectedVariant ? selectedVariant.mrp : item.mrp;
  const discountPercentage = Math.floor(
    ((currentMRP - currentPrice) / currentMRP) * 100
  );

  return (
    <Grid item xs={6} sm={3} md={2} key={item.id}>
      <Paper
        sx={{
          cursor: "pointer",
          textAlign: "center",
          p: 1,
          height: "220px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative", // Add this for positioning the offer label
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
      >
        {discountPercentage > 10 && (
          <Box
            sx={{
              position: "absolute",
              top: "0px",
              right: "0px",
              backgroundColor: "rgba(25, 173, 52, 0.7)", // Green background for visibility
              color: "white",
              padding: "2px 4px",
              borderRadius: "0 4px 0 4px",
              fontSize: "0.65rem",
              fontWeight: "500",
              zIndex: 1,
              width: "auto"
            }}
          >
            {discountPercentage}% OFF
          </Box>
        )}

        {/* <Box
          sx={{
            position: "absolute",
            top: "0px",
            right: "10px",
            backgroundColor: "rgba(25, 173, 52, 0.7)", // Green background
            color: "white",
            padding: "6px 8px",
            width: "5%",
            height: "auto",
            fontSize: "0.55rem",
            fontWeight: "500",
            zIndex: 1,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)", // V-shape at the bottom
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}
        >
          20% OFF
        </Box> */}

        <Box
          onClick={() => handleOpenModal(item)}
          sx={{
            width: "100%",
            height: "120px",
            overflow: "hidden",
            borderRadius: "4px",
            backgroundColor: item.image ? "transparent" : "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img
            src={getOptimizedImageUrl(item.image)}
            // alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
            loading="lazy"
          />
        </Box>

        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "0.70rem",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "2rem",
            lineHeight: "1rem",
            width: "100%",
            display: "-webkit-box",
            WebkitLineClamp: 2, // Limit to 2 lines
            WebkitBoxOrient: "vertical", // Ensure the box is vertical
            mt: 0.5
          }}
        >
          {item.name}
        </Typography>

        {/* Replace Chips with a Select dropdown */}
        {item.variant && item.variant.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth size="small" sx={{ height: 25 }}>
              <InputLabel>qty</InputLabel>
              <Select
                value={selectedVariant.qty}
                label="Variant"
                onChange={handleVariantSelect}
                sx={{
                  fontSize: "0.65rem", // Reduce font size
                  width: "100%",
                  height: "30px", // Reduce dropdown height
                  "& .MuiSelect-icon": {
                    fontSize: "1.2rem" // Adjust the icon size if needed
                  }
                }}
              >
                {item.variant.map((variant, index) => (
                  <MenuItem
                    key={index}
                    value={variant.qty}
                    sx={{
                      fontSize: "0.65rem", // Smaller text size
                      padding: "2px 8px", // Reduce padding to shrink height
                      height: "auto", // Let the height adjust based on content
                      lineHeight: "0.2" // Reduce the line height to make the text more compact
                    }}
                  >
                    {variant.qty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            pl: 1
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mb: 0.5,
              fontSize: "0.75rem",
              fontWeight: "500",
              overflow: "hidden",
              width: "auto",
              mt: 0.5
            }}
            color="text.secondary"
          >
            ₹{currentPrice}
          </Typography>
          {currentMRP > currentPrice && (
            <Typography
              variant="body2"
              size="small"
              sx={{
                ml: 0.5,
                mb: 0.5,
                fontSize: "0.70rem",
                fontWeight: "200",
                width: "auto",
                mt: 0.5,
                textDecoration: "line-through",
                mr: 1,
                lineHeight: "1.25rem",
                verticalAlign: "bottom"
              }}
              color="text.secondary"
            >
              ₹{currentMRP}
            </Typography>
          )}
        </Box>

        {storeStatus?.status !== "open" ? (
          <Button
            disableRipple
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
            sx={{
              width: "100%",
              mt: "auto",
              height: "25px",
              fontSize: "0.65rem",
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "transparent",
                boxShadow: "none"
              },
              "&:active": {
                backgroundColor: "#e0e0e0",
                boxShadow: "none"
              }
            }}
            disabled={true}
          >
            Store Closed
          </Button>
        ) : cartItem ? (
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
                logout(navigate);
                return;
              }
              addToCart(item);
            }}
            sx={{
              width: "100%",
              mt: "auto",
              height: "25px",
              fontSize: "0.95rem",
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "transparent",
                boxShadow: "none"
              },
              "&:active": {
                backgroundColor: "#e0e0e0",
                boxShadow: "none"
              }
            }}
          >
            Add
          </Button>
        )}
      </Paper>
    </Grid>
  );
};

export default ItemCard;
