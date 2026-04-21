"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix default marker issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✅ Default (blue) marker
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ✅ Selected (highlighted) marker
const selectedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// ✅ Move map when property is selected
function FlyToLocation({ location }: any) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.setView([location.lat, location.lng], 15);
    }
  }, [location, map]);

  return null;
}

export default function Map({ properties, selectedLocation }: any) {
  return (
    <MapContainer
      center={[18.5204, 73.8567]} // Pune default
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ✅ Fly to selected property */}
      <FlyToLocation location={selectedLocation} />

      {/* ✅ Render markers */}
      {properties.map((property: any) => {
        const lat = property.location?.coordinates?.lat;
        const lng = property.location?.coordinates?.lng;

        if (!lat || !lng) return null;

        // ✅ Check if this marker is selected
        const isSelected =
          selectedLocation &&
          selectedLocation.lat === lat &&
          selectedLocation.lng === lng;

        return (
          <Marker
            key={property._id}
            position={[lat, lng]}
            icon={isSelected ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => {
                const el = document.getElementById(`property-${property._id}`);
                if(el){
                  el.scrollIntoView({behavior: "smooth", block: "center"});
                }
              }
            }}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{property.title}</h3>
                <p>₹ {property.price}</p>
                <p className="text-sm text-gray-500">
                  {property.location?.city}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}