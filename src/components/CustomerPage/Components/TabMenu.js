import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Grid,
  SwipeableDrawer,
  useTheme,
  CircularProgress
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ItemCard from "./ItemCard"; // Assuming you have ItemCard as a separate component

const TabMenu = ({
  menuItems,
  cart,
  setCart,
  addToCart,
  handleOpenModal,
  storeInfo,
  isReady
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    const categoryItemsCount =
      menuItems[Object.keys(menuItems)[newValue]]?.items?.length || 0;
    if (categoryItemsCount > 50) {
      setLoading(true);
    }
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (loading) {
      const categoryItemsCount =
        menuItems[Object.keys(menuItems)[activeTab]]?.items?.length || 0;
      const dynamicDelay = categoryItemsCount * 5;
      setTimeout(() => {
        setLoading(false); // Stop loading after calculated delay
      }, dynamicDelay);
    }
  }, [loading, activeTab, menuItems]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
        maxHeight: "calc(80vh - 50px)"
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          position: "relative",
          backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff"
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            width: "auto",
            backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
            zIndex: 1,
            height: "calc(80vh)"
          }}
        >
          <IconButton sx={{ flexShrink: 0 }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Menu categories"
            orientation="vertical"
            variant="scrollable"
            sx={{
              borderRight: 1,
              borderColor: "divider",
              position: "sticky", // Sticky position
              top: 0, // Stick to the top when scrolling
              height: "100%", // Full height
              zIndex: 1,
              bgcolor: "background.paper", // Keeps background consistent while scrolling
              overflow: "hidden" // Prevents scrolling on the tabs
            }}
          >
            {Object.keys(menuItems)
              .filter((c) => menuItems[c]?.available)
              .map((category, index) => {
                const categoryImage =
                  menuItems[category]?.image ??
                  "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_240/NI_CATALOG/IMAGES/CIW/2024/8/20/c20eec04-70c9-4bab-b5ba-e90bf6889651_51ace0bb-7d70-49e5-899b-a68e20858bd8";

                return (
                  <Tab
                    sx={{ p: 1 }}
                    aria-controls={`vertical-tabpanel-${index}`}
                    label={
                      <div style={{ textAlign: "center" }}>
                        <img
                          src={categoryImage}
                          alt={category}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            marginBottom: "8px"
                          }}
                        />
                        <div style={{ fontSize: "0.70rem" }}>{category}</div>
                      </div>
                    }
                    key={index}
                  />
                );
              })}
            <Tab
              aria-controls={`vertical-tabpanel`}
              label={
                <div style={{ textAlign: "center" }}>
                  <Box
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginBottom: "8px"
                    }}
                  />
                </div>
              }
            />
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
          loading={loading}
          isReady={isReady}
        />

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
            <Grid
              container
              spacing={1}
              sx={{ flexGrow: 1, overflowX: "hidden" }}
            >
              {Object.keys(menuItems)
                .filter((c) => menuItems[c]?.available)
                .map((category, index) => {
                  const categoryImage =
                    menuItems[category]?.image ??
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
  theme,
  loading,
  isReady
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff"
      }}
    >
      {loading ? (
        // Show a loader while loading data
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%", // Ensure it takes full height of the viewport or set specific height
            width: "100%" // Ensure full width
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
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
                  isReady={isReady}
                />
              ))}
        </Grid>
      )}

      <Box sx={{ height: "50px" }}></Box>
    </Box>
  );
};

export default TabMenu;
