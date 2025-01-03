import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Grid
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ItemCardV2 from "./ItemCardV2"; // Assuming ItemCard is another component

// MenuAccordion Component for rendering individual category sections
const AccordionMenu = ({
  category,
  menuItems,
  index,
  cart,
  setCart,
  addToCart,
  handleOpenModal,
  navigate,
  storeInfo,
  categoryLength
}) => {
  return (
    <Accordion
      key={index}
      sx={{ mt: 0.5, width: "100%" }}
      elevation={0}
      expanded={categoryLength <= 5}
    >
      {/* Accordion Summary */}
      <AccordionSummary
        expandIcon={
          <ArrowDropDownIcon fontSize="large" sx={{ color: "black" }} />
        }
        aria-controls={`panel-${index}-content`}
        id={`panel-${index}-header`}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#333" : "#fff"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {menuItems[category]?.image && (
            <img
              src={menuItems[category]?.image}
              alt={category}
              style={{
                width: 50,
                height: 50,
                marginRight: 8,
                borderRadius: "50%"
              }}
            />
          )}
          <Typography variant="subtitle2" sx={{ fontSize: "1rem" }}>
            {category}
          </Typography>
        </Box>
      </AccordionSummary>

      {/* Accordion Details */}
      <AccordionDetails sx={{ p: 0 }}>
        <Box
          key={index}
          id={`category-${index}`}
          sx={{ p: 0.5, width: "auto" }}
        >
          <Grid container spacing={1}>
            {menuItems[category].items
              .filter((item) => item.available) // Filter only available items
              .map((item) => (
                <ItemCardV2
                  item={item}
                  cart={cart}
                  setCart={setCart}
                  addToCart={addToCart}
                  handleOpenModal={handleOpenModal}
                  navigate={navigate}
                  storeStatus={storeInfo}
                />
              ))}
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionMenu;
