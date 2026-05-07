"use client";

import PropertyCard from "./PropertyCard";

export default function PropertyList({
  properties,
  onShowMap
}: any) {
  if (!properties || properties.length === 0) {
    return <p>No properties found</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {properties.map((property: any) => {

        return (
          <PropertyCard
            key={property._id}
            property={property}
            onShowMap={onShowMap}
          />
        );
      })}
    </div>
  );
}