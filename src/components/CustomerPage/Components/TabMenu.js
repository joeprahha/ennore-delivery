import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Divider,
  Grid,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ItemCard from "./ItemCard"; // Assuming you have ItemCard as a separate component
import { act } from "react-dom/test-utils";

const TabMenu = ({
  menuItems,
  cart,
  setCart,
  addToCart,
  handleOpenModal,
  storeInfo
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          position: "sticky",
          top: 55,
          zIndex: 10,
          backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff"
        }}
      >
        <IconButton sx={{ flexShrink: 0 }} onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            overflowX: "auto",
            flexGrow: 1,
            flexShrink: 1,
            minHeight: "48px"
          }}
        >
          {Object.keys(menuItems)
            .filter((c) => menuItems[c]?.available)
            .map((category, index) => (
              <Tab label={category} key={index} />
            ))}
        </Tabs>
      </Box>
      <CategoryItems
        category={Object.keys(menuItems)[activeTab]}
        menuItems={menuItems}
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        handleOpenModal={handleOpenModal}
        storeInfo={storeInfo}
        theme={theme}
      />
      {/* Swipeable Drawer for Categories */}
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{
          "& .MuiDrawer-paper": {
            height: "90%",
            bottom: 0,
            borderRadius: "16px 16px 0 0"
          }
        }}
      >
        <Box
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              flexDirection: "row",
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff"
            }}
          >
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              Select Category
            </Typography>
          </Box>
          <Grid container spacing={1} sx={{ flexGrow: 1, overflowX: "hidden" }}>
            {Object.keys(menuItems)
              .filter((c) => menuItems[c]?.available)
              .map((category, index) => {
                const categoryImage =
                  "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_240/NI_CATALOG/IMAGES/CIW/2024/8/20/c20eec04-70c9-4bab-b5ba-e90bf6889651_51ace0bb-7d70-49e5-899b-a68e20858bd8";

                return (
                  <Grid item xs={4} sm={4} md={3} key={index}>
                    <Box
                      onClick={() => {
                        handleTabChange(null, index);
                        toggleDrawer(false)();
                      }}
                      sx={{
                        cursor: "pointer",
                        textAlign: "center",
                        padding: 2,
                        height: "65px",
                        width: "65px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.05)" }
                      }}
                    >
                      {/* Image */}
                      <img
                        src={categoryImage}
                        alt={category}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          boxShadow: 3,
                          objectFit: "cover",
                          borderRadius: 2
                        }}
                      />
                      {/* Category Name */}
                      <Box
                        sx={{
                          fontSize: "0.75rem",
                          height: "30px"
                        }}
                      >
                        {" "}
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "0.75rem",
                            height: "auto"
                          }}
                        >
                          {category}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
          </Grid>
          );
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

// CategoryItems component to display items of each category
const CategoryItems = ({
  category,
  menuItems,
  index,
  cart,
  setCart,
  addToCart,
  handleOpenModal,
  storeInfo,
  theme
}) => {
  return (
    <Box
      sx={{
        mt: 2,
        width: "100%",
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff"
      }}
    >
      <Grid container spacing={2} sx={{ p: 1 }}>
        {menuItems[category]?.available &&
          menuItems[category]?.items
            ?.filter((item) => item.available)
            ?.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                cart={cart}
                setCart={setCart}
                addToCart={addToCart}
                handleOpenModal={handleOpenModal}
                storeStatus={storeInfo}
              />
            ))}
      </Grid>
    </Box>
  );
};

export default TabMenu;
