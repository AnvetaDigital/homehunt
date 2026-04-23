"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import PropertyList from "./PropertyList";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function MapWrapper({ properties }: any) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (property: any) => {
    const coords = property.location?.coordinates;
    if (coords?.lat && coords?.lng) {
      setSelectedLocation(coords);
      setSelectedId(property._id);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Map */}
      <div className="w-1/2">
        <Map
          properties={properties}
          selectedLocation={selectedLocation}
          selectedId={selectedId}
        />
      </div>

      {/* Property List */}
      <div className="w-1/2 h-125 overflow-y-auto">
        <PropertyList
          properties={properties}
          onSelect={handleSelect}
          selectedId={selectedId}
        />
      </div>
    </div>
  );
}
