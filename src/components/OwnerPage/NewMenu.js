import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Switch,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../../utils/api";
import { debounce } from "lodash"; // Import debounce from lodash

const NewMenuPage = () => {
  const { menuId } = useParams();
  const [menu, setMenu] = useState(null);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState({
    barcode: "",
    name: "",
    price: 0,
    mrp: 0,
    available: true,
    image: null,
    storeName: ""
  });
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  const itemMater = JSON.parse(localStorage.getItem("itemMater") || "[]");
  const itemRefs = useRef({});
  const [selectedStore, setSelectedStore] = useState(menuId);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [save, setSave] = useState(false);
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] =
    useState(false);
  const [openDeleteItemDialog, setOpenDeleteItemDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (event, newValue) => {
    const categoryItemsCount =
      menu[Object.keys(menu)[newValue]]?.items?.length || 0;
    if (categoryItemsCount > 30) {
      setLoading(true);
    }
    setSelectedCategoryIndex(newValue);
  };
  useEffect(() => {
    if (loading) {
      const categoryItemsCount =
        menu[Object.keys(menu)[selectedCategoryIndex]]?.items?.length || 0;
      const dynamicDelay = categoryItemsCount * 1;
      setTimeout(() => {
        setLoading(false); // Stop loading after calculated delay
      }, dynamicDelay);
    }
  }, [loading, selectedCategoryIndex, menu]);
  useEffect(() => {
    fetchMenu(menuId);
  }, [menuId]);

  const fetchMenu = async (storeId) => {
    try {
      const response = await api.get(`/menus/${storeId}`);
      setMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoadingMenu(false);
    }
  };

  const filteredMenu = useMemo(() => {
    if (!menu) return {};
    const newFilteredMenu = Object.keys(menu).reduce((acc, category) => {
      const filteredItems = menu[category].items.filter(
        (item) =>
          item.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          item.barcode?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      if (filteredItems.length > 0 || searchQuery === "") {
        acc[category] = {
          ...menu[category],
          items: searchQuery ? filteredItems.slice(0, 1) : filteredItems
        };
      }
      return acc;
    }, {});
    return newFilteredMenu;
  }, [menu, searchQuery]);

  const handleClick = () => {
    console.log("i");
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input when clicked
    }
  };
  const handleClick2 = () => {
    console.log("i");
    if (inputRef2.current) {
      inputRef2.current.focus(); // Focus the input when clicked
    }
  };

  const handleBarcodeScan = debounce((e) => {
    setSearchQuery(e.target.value);
  }, 300);

  const handleSearchChange = debounce((e) => {
    setSearchQuery(e.target.value);
  }, 300);

  const handleAddCategory = () => {
    if (newCategory && !menu.hasOwnProperty(newCategory)) {
      setMenu({
        ...menu,
        [newCategory]: { available: true, items: [] }
      });
      setNewCategory("");
    } else if (menu.hasOwnProperty(newCategory)) {
      alert("Category already exists!");
    } else {
      alert("Please enter a category name");
    }
  };

  const handleAddItem = (category) => {
    const updatedCategory = {
      ...menu[category],
      items: [
        { ...newItem, id: Date.now().toString() },
        ...menu[category].items
      ]
    };
    setMenu({ ...menu, [category]: updatedCategory });
    setNewItem({
      barcode: "",
      name: "",
      price: "",
      available: true,
      image: null,
      storeName: ""
    });
  };

  const handleSaveMenu = async () => {
    const formattedMenu = Object.entries(menu).map(
      ([categoryName, { items, available, image }]) => ({
        categoryName,
        available,
        items,
        image
      })
    );
    setSave(true);
    try {
      await api.put(`/menus/${menuId}`, { menu: formattedMenu });
      alert("Menu saved successfully!");
      fetchMenu(menuId);
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("Error saving menu");
    } finally {
      setSave(false);
    }
  };
  const handleImageChange = async (event, categoryName, itemId) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const imageUrl = response.data.url;

      const updatedCategory = {
        ...menu[categoryName],
        items: menu[categoryName].items.map((item) =>
          item.id === itemId ? { ...item, image: imageUrl } : item
        )
      };

      setMenu({
        ...menu,
        [categoryName]: updatedCategory
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setOpenDeleteCategoryDialog(true);
  };

  const handleDeleteItem = (category, itemId) => {
    setItemToDelete({ category, itemId });
    setOpenDeleteItemDialog(true);
  };

  const handleDeleteCategoryConfirm = () => {
    const updatedMenu = { ...menu };
    delete updatedMenu[categoryToDelete];
    setMenu(updatedMenu);
    setOpenDeleteCategoryDialog(false);
    setCategoryToDelete(null);
  };

  const handleDeleteItemConfirm = () => {
    const updatedCategory = {
      ...menu[itemToDelete.category],
      items: menu[itemToDelete.category].items.filter(
        (item) => item.id !== itemToDelete.itemId
      )
    };
    setMenu({
      ...menu,
      [itemToDelete.category]: updatedCategory
    });
    setOpenDeleteItemDialog(false);
    setItemToDelete(null);
  };
  const handleCategoryImageChange = async (event, categoryName) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const imageUrl = response.data.url;

      // Update the category with the new image
      const updatedCategory = {
        ...menu[categoryName],
        image: imageUrl // Update the image for the category
      };
      // Update the menu state
      setMenu({
        ...menu,
        [categoryName]: updatedCategory
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  return (
    <Box>
      <Box sx={{ m: 1, overflowX: "hidden" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={2}
        >
          <TextField
            label="Search Item"
            variant="outlined"
            onChange={handleSearchChange}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              endAdornment: <SearchIcon />
            }}
          />
          <input
            ref={inputRef}
            onClick={handleClick}
            onChange={handleBarcodeScan}
            style={{
              width: "200px",
              height: "30px",
              position: "relative"
            }}
            placeholder="Click to scan barcode"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveMenu}
            disabled={save}
          >
            {save ? <CircularProgress size={24} /> : <SaveIcon />}
            Save Menu
          </Button>
        </Box>

        {loadingMenu ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "background.paper",
              display: "flex",
              position: "relative",
              height: "70vh"
            }}
          >
            {searchQuery === "" ? (
              <Tabs
                value={selectedCategoryIndex}
                onChange={handleCategoryChange}
                aria-label="Menu categories"
                orientation="vertical"
                variant="scrollable"
                sx={{
                  borderRight: 1,
                  borderColor: "divider",
                  position: "sticky",
                  top: 0,
                  height: "100%",
                  zIndex: 1,
                  bgcolor: "background.paper",
                  overflow: "hidden"
                }}
              >
                {Object.keys(menu).map((categoryName, index) => (
                  <Tab
                    key={categoryName}
                    label={categoryName}
                    aria-controls={`vertical-tabpanel-${index}`}
                  />
                ))}
              </Tabs>
            ) : (
              <></>
            )}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                height: "100%"
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
                    width: "80%" // Ensure full width
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {Object.entries(filteredMenu).map(
                    ([categoryName, { items, available }], index) => {
                      if (selectedCategoryIndex !== index && !searchQuery)
                        return null; // Hide non-selected categories

                      return (
                        <Grid item xs={12} key={categoryName}>
                          <Card>
                            <CardContent>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Box display="flex" alignItems="center">
                                  {" "}
                                  <Box sx={{ width: "50px", height: "50px" }}>
                                    <input
                                      id={`category-image-upload-${categoryName}`}
                                      style={{ display: "none" }}
                                      type="file"
                                      onChange={
                                        (e) =>
                                          handleCategoryImageChange(
                                            e,
                                            categoryName
                                          ) // Handle category image change
                                      }
                                    />
                                    <Box
                                      onClick={() =>
                                        document
                                          .getElementById(
                                            `category-image-upload-${categoryName}`
                                          )
                                          .click()
                                      }
                                      sx={{ width: "50px", height: "50px" }}
                                    >
                                      <img
                                        src={menu[categoryName]?.image} // Use category's image
                                        alt={"image"}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: "cover" }}
                                      />
                                    </Box>
                                  </Box>
                                  <Typography variant="h6">
                                    {categoryName}
                                  </Typography>{" "}
                                </Box>
                                <Box display="flex" alignItems="center">
                                  <IconButton
                                    onClick={() =>
                                      handleDeleteCategory(categoryName)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                  <Switch
                                    checked={available}
                                    onChange={() =>
                                      setMenu({
                                        ...menu,
                                        [categoryName]: {
                                          ...menu[categoryName],
                                          available: !available
                                        }
                                      })
                                    }
                                  />
                                  <IconButton
                                    onClick={() => handleAddItem(categoryName)}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                              <TableContainer>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ width: "5%" }}>
                                        Image
                                      </TableCell>
                                      <TableCell sx={{ width: "15%" }}>
                                        Barcode
                                      </TableCell>
                                      <TableCell sx={{ width: "15%" }}>
                                        Store Name
                                      </TableCell>
                                      <TableCell sx={{ width: "25%" }}>
                                        Website Name
                                      </TableCell>{" "}
                                      {/* Wider column */}
                                      <TableCell sx={{ width: "9%" }}>
                                        MRP
                                      </TableCell>{" "}
                                      {/* Narrower column */}
                                      <TableCell sx={{ width: "9%" }}>
                                        Price
                                      </TableCell>{" "}
                                      {/* Narrower column */}
                                      <TableCell sx={{ width: "9%" }}>
                                        Available
                                      </TableCell>
                                      <TableCell sx={{ width: "8%" }}>
                                        Action
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>

                                  <TableBody>
                                    {items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>
                                          <input
                                            id={`image-upload-${item.id}`}
                                            style={{ display: "none" }}
                                            type="file"
                                            onChange={(e) =>
                                              handleImageChange(
                                                e,
                                                categoryName,
                                                item.id
                                              )
                                            }
                                          />
                                          <Box
                                            onClick={() =>
                                              document
                                                .getElementById(
                                                  `image-upload-${item.id}`
                                                )
                                                .click()
                                            }
                                            sx={{
                                              width: "50px",
                                              height: "50px"
                                            }}
                                          >
                                            <img
                                              src={item.image}
                                              alt={item?.name?.slice(0, 10)}
                                              width="100%"
                                              height="100%"
                                              style={{ objectFit: "cover" }}
                                            />
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            size="small"
                                            InputProps={{
                                              style: {
                                                fontSize: "0.8rem" // Apply font size to the input field
                                              }
                                            }}
                                            value={item.barcode}
                                            ref={inputRef2}
                                            onClick={handleClick2}
                                            onChange={(e) => {
                                              const newBarcode = e.target.value;

                                              const updatedItems = items.map(
                                                (i) =>
                                                  i.id === item.id
                                                    ? {
                                                        ...i,
                                                        barcode: newBarcode
                                                      }
                                                    : i
                                              );

                                              setMenu({
                                                ...menu,
                                                [categoryName]: {
                                                  ...menu[categoryName],
                                                  items: updatedItems
                                                }
                                              });

                                              const matchedItem =
                                                itemMater &&
                                                itemMater?.find(
                                                  (i) =>
                                                    i.Barcode === newBarcode
                                                );

                                              if (matchedItem) {
                                                // Update other fields if a match is found
                                                const updatedItem = {
                                                  ...item,
                                                  barcode: newBarcode, // Ensure the barcode is set
                                                  name: matchedItem[
                                                    "item Name"
                                                  ],
                                                  storeName:
                                                    matchedItem["item Name"],
                                                  price: matchedItem["srate"], // Assign sales rate to price
                                                  mrp: matchedItem["MRP"] // Update MRP
                                                };

                                                // Update the menu state again with the matched item data
                                                setMenu({
                                                  ...menu,
                                                  [categoryName]: {
                                                    ...menu[categoryName],
                                                    items: items.map((i) =>
                                                      i.id === item.id
                                                        ? updatedItem
                                                        : i
                                                    )
                                                  }
                                                });
                                              }
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            size="small"
                                            InputProps={{
                                              style: {
                                                fontSize: "0.8rem" // Apply font size to the input field
                                              }
                                            }}
                                            value={item.storeName}
                                            onChange={(e) =>
                                              setMenu({
                                                ...menu,
                                                [categoryName]: {
                                                  ...menu[categoryName],
                                                  items: items.map((i) =>
                                                    i.id === item.id
                                                      ? {
                                                          ...i,
                                                          storeName:
                                                            e.target.value
                                                        }
                                                      : i
                                                  )
                                                }
                                              })
                                            }
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            sx={{ width: "100%" }}
                                            size="small"
                                            InputProps={{
                                              style: {
                                                fontSize: "0.8rem" // Apply font size to the input field
                                              }
                                            }}
                                            value={item.name}
                                            onChange={(e) =>
                                              setMenu({
                                                ...menu,
                                                [categoryName]: {
                                                  ...menu[categoryName],
                                                  items: items.map((i) =>
                                                    i.id === item.id
                                                      ? {
                                                          ...i,
                                                          name: e.target.value
                                                        }
                                                      : i
                                                  )
                                                }
                                              })
                                            }
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            size="small"
                                            InputProps={{
                                              style: {
                                                fontSize: "0.8rem" // Apply font size to the input field
                                              }
                                            }}
                                            value={item.mrp}
                                            onChange={(e) =>
                                              setMenu({
                                                ...menu,
                                                [categoryName]: {
                                                  ...menu[categoryName],
                                                  items: items.map((i) =>
                                                    i.id === item.id
                                                      ? {
                                                          ...i,
                                                          mrp: e.target.value
                                                        }
                                                      : i
                                                  )
                                                }
                                              })
                                            }
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            size="small"
                                            InputProps={{
                                              style: {
                                                fontSize: "0.8rem" // Apply font size to the input field
                                              }
                                            }}
                                            value={item.price}
                                            onChange={(e) =>
                                              setMenu({
                                                ...menu,
                                                [categoryName]: {
                                                  ...menu[categoryName],
                                                  items: items.map((i) =>
                                                    i.id === item.id
                                                      ? {
                                                          ...i,
                                                          price: e.target.value
                                                        }
                                                      : i
                                                  )
                                                }
                                              })
                                            }
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Switch
                                            checked={item.available}
                                            onChange={() =>
                                              setMenu({
                                                ...menu,
                                                [categoryName]: {
                                                  ...menu[categoryName],
                                                  items: items.map((i) =>
                                                    i.id === item.id
                                                      ? {
                                                          ...i,
                                                          available:
                                                            !i.available
                                                        }
                                                      : i
                                                  )
                                                }
                                              })
                                            }
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <IconButton
                                            onClick={() =>
                                              handleDeleteItem(
                                                categoryName,
                                                item.id
                                              )
                                            }
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    }
                  )}
                </Grid>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Box display="flex" marginTop={2}>
        <TextField
          label="New Category"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </Box>

      {/* Dialogs for Deleting Category/Item */}
      <Dialog
        open={openDeleteCategoryDialog}
        onClose={() => setOpenDeleteCategoryDialog(false)}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteCategoryDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteCategoryConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteItemDialog}
        onClose={() => setOpenDeleteItemDialog(false)}
      >
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteItemDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteItemConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewMenuPage;
