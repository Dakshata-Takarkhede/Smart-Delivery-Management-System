import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom markers
import { LocationOn } from "@mui/icons-material"; // Using MUI icon for the marker

const MapComponent = () => {
  // Set initial center of the map (San Francisco, for example)
  const [viewport, setViewport] = React.useState({
    latitude: 37.7749, // Latitude for San Francisco
    longitude: -122.4194, // Longitude for San Francisco
    zoom: 12,
  });

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={[37.7749, -122.4194]} // Set initial map center
        zoom={viewport.zoom} // Set zoom level
        style={{ width: "100%", height: "100%" }}
      >
        {/* Use OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker with Material UI Icon */}
        <Marker position={[37.7749, -122.4194]} icon={new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Default marker icon
          iconSize: [25, 41], // Size of the marker
          iconAnchor: [12, 41], // Point of the icon that will be placed at the marker's position
        })}>
          <Popup>
            San Francisco
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
