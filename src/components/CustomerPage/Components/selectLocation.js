import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from "react-leaflet";
import * as turf from "@turf/turf";
import axios from "axios";
import { Box, Typography, Button,Modal } from "@mui/material";

const polygonCoordinates = [
  [13.231363, 80.329004],
  [13.230971, 80.328405],
  [13.229867, 80.327941],
  [13.229261, 80.327434],
  [13.230004, 80.326865],
  [13.229434, 80.325324],
];

const polygonCenter = { lat: 13.226383, lng: 80.329723 };

const StaticMapModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMapClick = (e) => {
    const { lat, lng } = e.nativeEvent; // Replace with your custom click handler logic if needed
    const isInside = isInsidePolygon(lat, lng);
    if (isInside) {
      setSelectedLocation({ lat, lng });
      setError("");
    } else {
      setError("Selected location is outside the delivery area.");
    }
  };

  const isInsidePolygon = (lat, lng) => {
    const point = turf.point([lng, lat]);
    const polygon = turf.polygon([[...polygonCoordinates, polygonCoordinates[0]]]);
    return turf.booleanPointInPolygon(point, polygon);
  };

  const confirmLocation = async () => {
    if (!selectedLocation) {
      setError("Please select a location first.");
      return;
    }
    try {
      const response = await axios.post("/api/orders", {
        deliveryLocation: selectedLocation,
      });
      alert("Location confirmed!");
    } catch (err) {
      console.error(err);
      setError("Failed to confirm location.");
    }
  };

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${polygonCenter.lat},${polygonCenter.lng}&zoom=15&size=600x400&maptype=roadmap&path=fillcolor:0xAA000033|color:0xFFFFFF00|enc:YourPolygonPath&key=YOUR_GOOGLE_API_KEY`;

  return (
    <Box>
      <Typography variant="h6">Update Delivery Location</Typography>
      <Button variant="contained" onClick={handleOpen}>
        Select Location on Map
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" textAlign="center">
            Select Delivery Location
          </Typography>
          <Box
            component="img"
            src={staticMapUrl}
            alt="Static Map"
            sx={{ width: "100%", height: 400, mt: 2, cursor: "pointer" }}
            onClick={handleMapClick} // Add custom click logic
          />
          {error && (
            <Typography variant="body2" color="error" mt={2}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={confirmLocation}
          >
            Confirm Location
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default StaticMapModal;

