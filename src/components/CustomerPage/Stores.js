import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Divider
} from "@mui/material";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import { useNavigate } from "react-router-dom";
import BikeLoader from "../../loader/BikeLoader";
import { isTokenValid, logout } from "../../utils/auth";
import { api } from "../../utils/api";
import SearchIcon from "@mui/icons-material/Search";

import { getCartFromLocalStorage } from "../../utils/localStorage";
import { GoToOrdersButton } from "./Components/GoToOrdersButton";
import ClearIcon from "@mui/icons-material/Clear";

const convertToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [cart, setCart] = useState(getCartFromLocalStorage() || { items: [] });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const allowedCategories = [
    "Restaurant",
    "Groceries",
    "Bakes",
    "Meat & More",
    "Fresh Meats & More"
  ];

  useEffect(() => {
    if (!isTokenValid()) {
      logout(navigate);
    }

    const fetchStores = async () => {
      setLoading(true);
      try {
        const cachedStores = false; //sessionStorage.getItem(`stores`);
        if (cachedStores) {
          const { stores, timestamp } = JSON.parse(cachedStores);
          const isCacheValid = Date.now() - timestamp < 2 * 60 * 1000;

          if (isCacheValid) {
            setStores(stores);
            return;
          }
        }
        const response = await api.get("stores");
        setStores(response.data);
        sessionStorage.setItem(
          `stores`,
          JSON.stringify({ stores: response.data, timestamp: Date.now() })
        );
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [navigate]);
  console.log("go;", filteredStores);
  useEffect(() => {
    const newFilteredStores = stores.filter((store) => {
      const matchesSearch = store.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
    setFilteredStores(newFilteredStores);
  }, [stores, searchQuery]);

  const handleStoreClick = (storeId) => {
    navigate(`/stores/${storeId}`);
  };

  const groupStoresByCategory = (stores) => {
    const groupedStores = {};

    stores.forEach((store) => {
      const categories = store.category.split(",");
      categories.forEach((category) => {
        category = category.trim();
        if (
          allowedCategories.some((allowedCategory) =>
            category.includes(allowedCategory)
          )
        ) {
          if (!groupedStores[category]) {
            groupedStores[category] = [];
          }
          groupedStores[category].push(store);
        }
      });
    });

    return groupedStores;
  };

  // Group stores by category
  const groupedStores = groupStoresByCategory(filteredStores);

  return (
    <Box
      sx={{
        p: 0,
        minHeight: "100vh",
        overflowX: "hidden",
        backgroundColor: "rgba(95, 37, 159, 0.05)"
      }}
    >
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "50px",
            position: "sticky",
            top: 0,
            zIndex: 10,

            width: "100%"
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              height: "auto",
              textAlign: "center",
              display: "flex"
            }}
          >
            {isSearching ? (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  transition: "width 0.3s ease-in-out", // Slide-in transition
                  height: "40px"
                }}
              >
                <TextField
                  variant="outlined"
                  autoFocus
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none"
                      }
                    },
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
                  placeholder={`Search stores in Ennore Delivery`}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  height: "40px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    pl: 2,
                    flexGrow: 1
                  }}
                >
                  <Typography variant="subtitle2">All Stores</Typography>
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mr: 2 }}
                >
                  <IconButton onClick={handleSearchFocus} sx={{ p: 1 }}>
                    <SearchIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </>
      {/* Display Loader while fetching data */}
      {loading ? (
        <BikeLoader />
      ) : (
        <>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1.5 }}
          >
            {Object.keys(groupedStores)
              .sort((a, b) => {
                const firstLetterA = a[0].toLowerCase(); // Get the first letter of 'a' (in lowercase)
                const firstLetterB = b[0].toLowerCase(); // Get the first letter of 'b' (in lowercase)

                // Compare the first letters of 'a' and 'b'
                if (firstLetterA < firstLetterB) return -1; // If 'a' comes first alphabetically, return -1
                if (firstLetterA > firstLetterB) return 1; // If 'b' comes first alphabetically, return 1
                return 0; // If both are the same, return 0 (no change in order)
              })
              .map((category) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {category}
                    </Typography>
                    <Divider sx={{ flexGrow: 1, mt: 0.5 }} />
                  </Box>

                  {groupedStores[category]
                    .sort((a, b) => {
                      if (a.rank == null) return 1;
                      if (b.rank == null) return -1;
                      return a.rank - b.rank;
                    })
                    .map((store) => {
                      const now = new Date();
                      const currentTimeString = `${now
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${now
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`;

                      const currentMinutes =
                        convertToMinutes(currentTimeString);
                      const openMinutes = convertToMinutes(store.open_time);
                      const closeMinutes = convertToMinutes(store.close_time);
                      const isTimeOpen =
                        closeMinutes > openMinutes
                          ? currentMinutes >= openMinutes &&
                            currentMinutes <= closeMinutes
                          : currentMinutes >= openMinutes ||
                            currentMinutes <= closeMinutes;

                      const isOpen = isTimeOpen && store.status === "open";
                      const isReady = store?.ready;
                      return (
                        <Paper
                          key={store._id}
                          elevation={1}
                          onClick={
                            isOpen && isReady
                              ? () => handleStoreClick(store._id)
                              : null
                          }
                          sx={{
                            mb: 1,
                            width: "100%",
                            textAlign: "center",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: "6px"
                          }}
                        >
                          <img
                            src={store?.image || "/app.png"}
                            alt="store"
                            style={{
                              width: "100%",
                              height: "180px",
                              objectFit: "cover",
                              objectPosition: "center",
                              borderTopLeftRadius: "6px",
                              borderTopRightRadius: "6px"
                            }}
                            loading="lazy"
                          />
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              p: 0.5,
                              pl: 2
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              align="left"
                              sx={{ fontSize: "1rem", fontWeight: 500 }}
                            >
                              {store.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              align="left"
                              sx={{ mb: 1, fontSize: "0.75rem", color: "#555" }}
                            >
                              {store.address1}
                            </Typography>
                            {store?.cod && (
                              <Typography
                                variant="body1"
                                textAlign={"left"}
                                sx={{
                                  mb: 1,
                                  fontSize: "0.75rem",
                                  color: "success.main",
                                  fontWeight: "500"
                                }}
                              >
                                Cash on Delivery is available
                              </Typography>
                            )}
                          </Box>
                          {(!isOpen || !isReady) && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "180px",
                                backgroundColor:
                                  !isOpen || !isReady
                                    ? "rgba(0, 0, 0, 0.5)"
                                    : "inherit", // Add a comma here
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                borderTopLeftRadius: "6px",
                                borderTopRightRadius: "6px",
                                zIndex: 1,
                                textAlign: "center"
                              }}
                            >
                              {isReady && (
                                <Typography
                                  variant="subtitle2"
                                  color="white"
                                  display="flex"
                                  alignItems="center"
                                >
                                  Store Closed
                                  <BedtimeIcon sx={{ marginLeft: 0.5 }} />
                                </Typography>
                              )}
                              {isReady && !isTimeOpen && (
                                <Typography variant="subtitle2" color="white">
                                  opens at: {store.open_time}
                                </Typography>
                              )}
                              {!isReady && (
                                <Typography variant="subtitle2" color="white">
                                  Coming Soon...
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Paper>
                      );
                    })}
                </>
              ))}
          </Box>
        </>
      )}

      {/* Go to Orders Button */}
      {cart.storeId && <GoToOrdersButton cart={cart} />}
    </Box>
  );
};

export default Stores;
