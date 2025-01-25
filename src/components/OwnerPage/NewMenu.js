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
  const inputRef = useRef(null); // Ref for the hidden barcode input field
  const itemRefs = useRef({});
  const [selectedStore, setSelectedStore] = useState(menuId);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [save, setSave] = useState(false);
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] =
    useState(false);
  const [openDeleteItemDialog, setOpenDeleteItemDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleImageChanged = async (event, categoryName, itemId) => {
    const file = event.target.files[0];
    if (!file) return; // If no file selected, return

    // Create a FormData object to send the image file to the server
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Upload the image using your API endpoint
      const response = await api.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Get the image URL from the response
      const imageUrl = response.data.url;

      // Update the menu with the new image URL for the corresponding item
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

  const handleClick = () => {
    console.log("i");
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input when clicked
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
        ...menu[category].items,
        { ...newItem, id: Date.now().toString() }
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
      ([categoryName, { items, available }]) => ({
        categoryName,
        available,
        items
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

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategoryIndex(newValue);
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

  return (
    <Box>
      <Box sx={{ m: 1, overflowX: "auto" }}>
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
            onChange={handleBarcodeScan} // onInput ensures we capture the value on barcode input
            onClick={handleClick} // Focus input on click
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
          <>
            {searchQuery === "" ? (
              <Tabs
                value={selectedCategoryIndex}
                onChange={handleCategoryChange}
                aria-label="Menu categories"
              >
                {Object.keys(menu).map((categoryName, index) => (
                  <Tab key={categoryName} label={categoryName} />
                ))}
              </Tabs>
            ) : (
              <></>
            )}

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
                            <Typography variant="h6">{categoryName}</Typography>
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
                                  <TableCell>Image</TableCell>
                                  <TableCell>Barcode</TableCell>
                                  <TableCell>Store Name</TableCell>
                                  <TableCell>Website Name</TableCell>
                                  <TableCell>MRP</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell>Available</TableCell>
                                  <TableCell>Action</TableCell>
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
                                        sx={{ width: "50px", height: "50px" }}
                                      >
                                        <img
                                          src={item.image}
                                          alt={item.name.slice(0, 10)}
                                          width="100%"
                                          height="100%"
                                          style={{ objectFit: "cover" }}
                                        />
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        value={item.barcode}
                                        onChange={(e) =>
                                          setMenu({
                                            ...menu,
                                            [categoryName]: {
                                              ...menu[categoryName],
                                              items: items.map((i) =>
                                                i.id === item.id
                                                  ? {
                                                      ...i,
                                                      barcode: e.target.value
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
                                                      storeName: e.target.value
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
                                                      available: !i.available
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
          </>
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
