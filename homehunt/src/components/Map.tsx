"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Icons
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Selected icon
const selectedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Move map
function FlyToLocation({ location }: any) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.setView([location.lat, location.lng], 15);
    }
  }, [location, map]);

  return null;
}

export default function Map({
  properties,
  selectedLocation,
  selectedId,
}: any) {
  const markerRefs = useRef<any>({});

  useEffect(() => {
    if (selectedId && markerRefs.current[selectedId]) {
      markerRefs.current[selectedId].openPopup();
    }
  }, [selectedId]);

  return (
    <MapContainer
      center={[18.5204, 73.8567]}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FlyToLocation location={selectedLocation} />

      {properties.map((property: any) => {
        const lat = property.location?.coordinates?.lat;
        const lng = property.location?.coordinates?.lng;

        // ✅ safety check
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

        const isSelected = selectedId === property._id;

        return (
          <Marker
            key={property._id}
            position={[lat, lng]}
            icon={isSelected ? selectedIcon : defaultIcon}
              ref={(ref) => {
                if (ref) markerRefs.current[property._id] = ref;
              }}
              eventHandlers={{
                click: () => {
                  const el = document.getElementById(
                    `property-${property._id}`
                  );
                  if (el) {
                    el.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                },
              }}
          >
            <Popup>
              <div>
                  <h3 className="font-semibold">{property.title}</h3>
                  <p>₹ {property.price.toLocaleString("en-IN")}</p>
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