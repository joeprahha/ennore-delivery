import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Typography,
  Paper,
  Button,
  Autocomplete,
  CircularProgress,
  FormControlLabel,
  Switch,
  Grid
} from "@mui/material";
import { api } from "../../utils/api";
import { getUserInfo } from "../../utils/localStorage";

const categories = [
  "Groceries",
  "Fast Food",
  "Pizza",
  "Burger",
  "Snacks",
  "Bakery",
  "Restaurant"
];
const locations = [
  "Nettukuppam",
  "Ennore Kuppam",
  "Thazhankuppam",
  "Mugathuvara Kuppam",
  "Ulagnathapuram",
  "SVM Nagar",
  "Vallur Nagar",
  "Kamaraj Nagar",
  "High School Surroundings",
  "Kaathukuppam",
  "RS Road",
  "Ennore Bus Depot Surroundings"
];

const Settings = ({ selectedStore }) => {
  // State variables
  const [storeName, setStoreName] = useState("");
  const [storeCategories, setStoreCategories] = useState([]);
  const [storeOpenTime, setStoreOpenTime] = useState("");
  const [storeCloseTime, setStoreCloseTime] = useState("");
  const [storeAddress1, setStoreAddress1] = useState("");
  const [storeLocalArea, setStoreLocalArea] = useState("");
  const [storeImageUrl, setStoreImageUrl] = useState("");
  const [storeLogoUrl, setStoreLogoUrl] = useState("");
  const [fssai, setFssai] = useState("");
  const [phone, setPhone] = useState("");
  const [phone1, setPhone1] = useState("");
  const [cod, setCod] = useState(false);
  const [minimumOrderValue, setMinOrderValue] = useState();
  const [onlyOrderByPhone, setOnlyyOrderByPhone] = useState(false);

  const [email, setEmail] = useState([]);
  const [email1, setEmail1] = useState([]);

  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const handleCategoryChange = (event) => {
    setStoreCategories(event.target.value);
  };

  useEffect(() => {
    if (selectedStore) {
      api
        .get(`stores/${selectedStore}`)
        .then((response) => {
          const data = response.data;
          setStoreName(data.name || "");
          setStoreCategories(data.category ? data.category.split(",") : []);
          setStoreOpenTime(data.open_time || "");
          setStoreCloseTime(data.close_time || "");
          setStoreAddress1(data.address1 || "");
          setStoreLocalArea(data.local || "");
          setStoreImageUrl(data.image || "");
          setStoreLogoUrl(data.logo || "");
          setFssai(data.fssai || "");
          setPhone(data.phone[0] || "");
          setEmail(data.email[0] || "");
          setPhone1(data.phone[1] || "");
          setEmail1(data.email[1] || "");
          setStatus(data.status || "");
          setReady(data.ready || false);
          setCod(data.cod || false);
          setMinOrderValue(data.minOrderValue);
          setOnlyyOrderByPhone(data.onlyOrderByPhone || false);
        })
        .catch((error) => {
          console.error("Error fetching store details:", error);
        });
    }
  }, [selectedStore]);

  const handleUpdateStore = async () => {
    try {
      let body = {
        name: storeName,
        image: storeImageUrl,
        logo: storeLogoUrl,
        category: storeCategories.join(","),
        open_time: storeOpenTime,
        close_time: storeCloseTime,
        address1: storeAddress1,
        local: storeLocalArea,
        fssai,
        phone: [phone, phone1],
        email: [email, email1],
        storeId: selectedStore,
        ready,
        status,
        cod,
        minOrderValue: minimumOrderValue,
        onlyOrderByPhone
      };
      if (getUserInfo().scope === "owner") {
        //ody.fcmToken = localStorage.getItem("fcmToken");
      }
      const response = await api.put(`stores/${selectedStore}`, body);

      console.log("Store updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  const handleImageUpload = async (event, cat) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setImageUploading(true);
    try {
      const response = await api.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrl = response.data.url;
      cat === "store"
        ? setStoreImageUrl(imageUrl || "")
        : setStoreLogoUrl(imageUrl || "");
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        maxWidth: 600,
        margin: "0 auto"
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={ready}
                  onChange={(e) => setReady(e.target.checked)}
                  color="primary"
                />
              }
              label="Ready"
              labelPlacement="start"
            />
          </Grid>

          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  color="primary"
                />
              }
              label="Open"
              labelPlacement="start"
            />
          </Grid>

          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={cod}
                  onChange={(e) => setCod(e.target.checked)}
                  color="primary"
                />
              }
              label="COD"
              labelPlacement="start"
            />
          </Grid>

          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={onlyOrderByPhone}
                  onChange={(e) => setOnlyyOrderByPhone(e.target.checked)}
                  color="primary"
                />
              }
              label="Only Phone Order"
              labelPlacement="start"
            />
          </Grid>
        </Grid>
      </Box>

      <TextField
        label="Minimum Order VAlue"
        size="small"
        fullWidth
        required
        value={minimumOrderValue}
        onChange={(e) => setMinOrderValue(Number(e.target.value))}
        margin="normal"
      />
      <TextField
        label="Store Name"
        size="small"
        fullWidth
        required
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        margin="normal"
      />

      <Select
        label="Categories"
        fullWidth
        multiple
        value={storeCategories}
        onChange={handleCategoryChange}
        input={<OutlinedInput label="Categories" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {selected.map((value) => (
              <Chip key={value} label={value} sx={{ margin: 0.5 }} />
            ))}
          </Box>
        )}
        margin="normal"
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Open Time"
          size="small"
          type="time"
          fullWidth
          required
          value={storeOpenTime}
          onChange={(e) => setStoreOpenTime(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Close Time"
          size="small"
          type="time"
          fullWidth
          required
          value={storeCloseTime}
          onChange={(e) => setStoreCloseTime(e.target.value)}
          margin="normal"
        />
      </Box>

      <TextField
        label="Address Line"
        size="small"
        fullWidth
        required
        value={storeAddress1}
        onChange={(e) => setStoreAddress1(e.target.value)}
        margin="normal"
      />

      <Autocomplete
        fullWidth
        options={locations}
        value={storeLocalArea}
        onChange={(e, newValue) => setStoreLocalArea(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Local Area" margin="normal" />
        )}
      />

      <TextField
        size="small"
        label="FSSAI"
        fullWidth
        value={fssai}
        onChange={(e) => setFssai(e.target.value)}
        margin="normal"
      />

      <TextField
        size="small"
        label="Email 1"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        size="small"
        label="Email 2"
        fullWidth
        value={email1}
        onChange={(e) => setEmail1(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Phone 1"
        size="small"
        type="number"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Phone 2"
        size="small"
        type="number"
        fullWidth
        value={phone1}
        onChange={(e) => setPhone1(e.target.value)}
        margin="normal"
      />

      {/* Image Upload for Store Image */}
      <Paper
        sx={{
          width: "100%",
          height: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed grey",
          cursor: "pointer",
          mt: 4,
          mb: 4
        }}
      >
        <input
          type="file"
          id="store-image-upload"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "store")}
        />
        {imageUploading ? (
          <CircularProgress size="40px" />
        ) : storeImageUrl ? (
          <img
            src={storeImageUrl}
            alt="Store image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() =>
              document.getElementById("store-image-upload").click()
            }
          >
            <span>Upload Store Image</span>
          </Box>
        )}
      </Paper>

      {/* Image Upload for Store Logo */}

      <Paper
        sx={{
          width: "100%",
          height: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed grey",
          cursor: "pointer",
          mt: 2
        }}
      >
        <input
          type="file"
          id="logo-image-upload"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "logo")}
        />
        {imageUploading ? (
          <CircularProgress size="40px" />
        ) : storeLogoUrl ? (
          <img
            src={storeLogoUrl}
            alt="Logo image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => document.getElementById("logo-image-upload").click()}
          >
            <span>Upload Logo</span>
          </Box>
        )}
      </Paper>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleUpdateStore}
      >
        Update Store
      </Button>
    </Box>
  );
};

export default Settings;
