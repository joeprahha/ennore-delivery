import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Paper,
  InputAdornment,
  Grid,
  useTheme
} from "@mui/material";
import ItemCard from "./Components/ItemCard";
import ClearIcon from "@mui/icons-material/Clear";
import { GoToOrdersButton } from "./Components/GoToOrdersButton";
import BikeLoader from "../../loader/BikeLoader";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { isTokenValid, logout } from "../../utils/auth";
import { api } from "../../utils/api";
import ItemDetailModal from "./Components/ItemModal";
import { getCartFromLocalStorage } from "../../utils/localStorage";
import AccordionMenu from "./Components/AccordionMenu";
import TabMenu from "./Components/TabMenu";

const StoreDetail = () => {
  const theme = useTheme();

  const { storeId } = useParams();
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [storeInfo, setStoreInfo] = useState(null);
  const [isGrocery, setIsGrocery] = useState(false);
  const [isServices, setIsServices] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setIsSearching(false);
  };
  const [cart, setCart] = useState(
    getCartFromLocalStorage() || {
      storeId,
      storeName: storeInfo.name,
      items: []
    }
  );
  const goToCartButton = () =>
    JSON.parse(localStorage.getItem("cart"))?.items.length ? true : false;
  const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("cart"));

    if (!existingCart || existingCart.storeId !== storeId) {
      const userConfirmed = window.confirm(
        "Create a new cart , You can create cart from one store at a time"
      );

      if (!userConfirmed) {
        return; // Exit if the user does not confirm
      }
      const newCart = {
        storeId,
        storeName: storeInfo.name,
        items: [{ ...item, count: 1 }]
      };
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    } else {
      const existingItem = existingCart.items.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        existingItem.count += 1;
        setCart({ ...existingCart });
        localStorage.setItem("cart", JSON.stringify(existingCart));
      } else {
        existingCart.items.push({ ...item, count: 1 });
        setCart({ ...existingCart });
        localStorage.setItem("cart", JSON.stringify(existingCart));
      }
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const categoryRefs = useRef([]);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };
  const fetchMenu = async () => {
    const menuCacheKey = `menus-${storeId}`;
    const storeCacheKey = `stores-${storeId}`;

    // Check and validate cached menu data
    const cachedMenu = sessionStorage.getItem(menuCacheKey);
    const cachedStore = false; //sessionStorage.getItem(storeCacheKey);

    const currentTime = Date.now();

    let menuData = null;
    let storeData = null;

    if (cachedMenu) {
      const { menuData: cachedMenuData, timestamp } = JSON.parse(cachedMenu);
      if (currentTime - timestamp < 5 * 60 * 1000) {
        menuData = cachedMenuData; // Use cached menu data
      }
    }

    if (cachedStore) {
      const { storeData: cachedStoreData, timestamp } = JSON.parse(cachedStore);
      if (currentTime - timestamp < 5 * 60 * 1000) {
        storeData = cachedStoreData; // Use cached store data
      }
    }

    // Fetch data if not in cache or cache expired
    if (!menuData || !storeData) {
      try {
        const [menuResponse, storeResponse] = await Promise.all([
          api.get(`menus/${storeId}`),
          api.get(`stores/${storeId}`)
        ]);

        menuData = menuResponse.data;
        storeData = storeResponse.data;

        // Cache the results
        sessionStorage.setItem(
          menuCacheKey,
          JSON.stringify({ menuData, timestamp: currentTime })
        );
        sessionStorage.setItem(
          storeCacheKey,
          JSON.stringify({ storeData, timestamp: currentTime })
        );
      } catch (error) {
        console.error("Error fetching menu or store data:", error);
        throw new Error("Failed to fetch data.");
      }
    }

    setLoading(false);

    setMenuItems(menuData);
    setStoreInfo(storeData);
    setIsGrocery(storeData?.category?.includes("roceries"));
  };

  useEffect(() => {
    if (!isTokenValid()) {
      logout(navigate);
    }
    fetchMenu();
  }, []);

  const filteredItems = searchTerm
    ? Object.entries(menuItems).reduce(
        (acc, [category, { available, items }]) => {
          if (available) {
            items.forEach((item) => {
              if (
                item.name?.toLowerCase().includes(searchTerm?.toLowerCase())
              ) {
                acc.push(item);
              }
            });
          }
          return acc;
        },
        []
      )
    : menuItems[Object.keys(menuItems)[activeTab]]?.available
    ? menuItems[Object.keys(menuItems)[activeTab]]?.items || []
    : [];

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ width: "100%", p: 0, position: "relative" }}>
      {loading ? (
        <BikeLoader />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
              pt: 1
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                height: "50px"
              }}
            >
              <IconButton onClick={() => navigate("/stores")} sx={{}}>
                <ArrowBackIcon />
              </IconButton>

              {/* Conditionally render either the store name or search bar */}
              {isSearching ? (
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    transition: "width 0.3s ease-in-out" // Slide-in transition
                  }}
                >
                  <TextField
                    variant="outlined"
                    autoFocus
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleSearchFocus}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSearchClear}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      width: "100%", // Initially full width for search bar when focused
                      pr: 1,
                      transition: "width 0.3s ease-in-out"
                    }}
                    placeholder={`Search items in "${storeInfo?.name}"`}
                  />
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                      flexGrow: 1
                    }}
                  >
                    {/* Display the logo or fallback to the image */}
                    {storeInfo.logo || storeInfo.image ? (
                      <img
                        src={storeInfo.logo || storeInfo.image}
                        alt="store icon"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          marginRight: 7
                        }}
                      />
                    ) : null}

                    {/* Display the store name */}
                    <Typography variant="h6">{storeInfo?.name}</Typography>
                  </Box>
                  <IconButton onClick={handleSearchFocus} sx={{ p: 1, mr: 2 }}>
                    <SearchIcon />
                  </IconButton>
                </>
              )}
            </Box>

            {searchTerm && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  overflow: "hidden"
                }}
              >
                <Typography variant="h6" align="left" sx={{ m: 2 }}>
                  {"Search Results :"}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ p: 0.2 }}>
            {!searchTerm ? (
              isGrocery ? (
                <Box
                  sx={{
                    maxHeight: "calc(100vh - 50px)",
                    overflowY: "auto"
                  }}
                >
                  {" "}
                  <TabMenu
                    menuItems={menuItems}
                    cart={cart}
                    setCart={setCart}
                    addToCart={addToCart}
                    handleOpenModal={handleOpenModal}
                    navigate={navigate}
                    storeInfo={storeInfo}
                  />{" "}
                </Box>
              ) : isServices ? (
                <></> // or null if you prefer no rendering
              ) : (
                Object.keys(menuItems)
                  .filter((category) => menuItems[category]?.available)
                  .map((category, index) => (
                    <AccordionMenu
                      key={index}
                      category={category}
                      menuItems={menuItems}
                      index={index}
                      cart={cart}
                      setCart={setCart}
                      addToCart={addToCart}
                      handleOpenModal={handleOpenModal}
                      navigate={navigate}
                      storeInfo={storeInfo}
                      categoryLength={Object.keys(menuItems).length}
                    />
                  ))
              )
            ) : (
              <Grid container spacing={2}>
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
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
            )}
          </Box>

          {
            <ItemDetailModal
              open={modalOpen}
              onClose={handleCloseModal}
              item={selectedItem}
              storeInfo={storeInfo}
              cart={cart}
              setCart={setCart}
              addToCart={addToCart}
            />
          }
        </>
      )}
      {goToCartButton ? <GoToOrdersButton cart={cart} /> : null}

      {storeInfo?.fssai && (
        <Box sx={{ padding: 2 }}>
          <Paper
            elevation={0}
            sx={{
              padding: 2,
              fontSize: "0.75rem",
              backgroundColor: "rgba(95, 37, 159, 0.05)"
            }}
          >
            {/* Store Name Section */}
            <Box display="flex" flexDirection="column" marginBottom={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: "0.75rem"
                }}
              >
                {storeInfo?.name || "Store Name"}
              </Typography>
            </Box>

            {/* FSSAI Section */}
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: "0.75rem"
                }}
              >
                FSSAI: {storeInfo?.fssai || "N/A"}
              </Typography>
            </Box>

            {/* Phone Section */}
            <Box display="flex" alignItems="center">
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: "0.75rem"
                }}
              >
                Phone: {storeInfo?.phone || "N/A"}
              </Typography>
            </Box>

            {/* Add other sections as needed */}
          </Paper>
        </Box>
      )}
      {!isGrocery ? <Box sx={{ height: "80px" }} /> : <></>}
    </Box>
  );
};

export default StoreDetail;
