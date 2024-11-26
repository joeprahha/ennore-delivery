import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from "react-leaflet";
import * as turf from "@turf/turf";
import axios from "axios";

const polygonCoordinates = [
  [13.231363, 80.329004],
  [13.230971, 80.328405],
  [13.229867, 80.327941],
  [13.229261, 80.327434],
  [13.230004, 80.326865],
  [13.229434, 80.325324],
  [13.228328, 80.325501],
  [13.228140, 80.324791],
  [13.227817, 80.324655],
  [13.227189, 80.324444],
  [13.226861, 80.322907],
  [13.226434, 80.321746],
  [13.225317, 80.320912],
];

const polygonCenter = [13.226383, 80.329723]; // Center of the polygon (adjust if needed)

const SelectDeliveryLocation = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {

    const storedLocation = localStorage.getItem("deliveryLocation");
    if (storedLocation) {
      setSelectedLocation(JSON.parse(storedLocation));
    } else {
      setSelectedLocation(polygonCenter);
    }
  }, []);

  const isInsidePolygon = (lat, lng) => {
    const point = turf.point([lng, lat]);
    const polygon = turf.polygon([[...polygonCoordinates, polygonCoordinates[0]]]); // Ensure closed polygon
    return turf.booleanPointInPolygon(point, polygon);
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (isInsidePolygon(lat, lng)) {
          setSelectedLocation([lat, lng]);
          setError("");
        } else {
          setError("Selected location is outside the delivery area.");
        }
      },
    });

    return selectedLocation ? <Marker position={selectedLocation}></Marker> : null;
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
      console.log("Location sent to backend:", response.data);
      alert("Location confirmed!");
      localStorage.setItem("deliveryLocation", JSON.stringify(selectedLocation));
    } catch (err) {
      console.error("Error sending location to backend:", err);
      setError("Failed to confirm location.");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={polygonCenter} zoom={15} style={{ height: "80%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Polygon positions={polygonCoordinates} pathOptions={{ color: "blue" }} />
        <LocationMarker />
      </MapContainer>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <button
        onClick={confirmLocation}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Confirm Location
      </button>
    </div>
  );
};

export default SelectDeliveryLocation;

