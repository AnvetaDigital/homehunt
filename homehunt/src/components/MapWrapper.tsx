"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import PropertyList from "./PropertyList";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function MapWrapper({ properties }: any) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  return (
    <>
      {/* Pass click handler to list */}
      <PropertyList
        properties={properties}
        // onSelect={(property: any) => {
        //   const coords = property.location?.coordinates;
        //   if (coords?.lat && coords?.lng) {
        //     setSelectedLocation(coords);
        //   }
        // }}

        onSelect={(property: any) =>
          setSelectedLocation(property.location.coordinates)
        }
      />

      <Map properties={properties} selectedLocation={selectedLocation} />
    </>
  );
}
