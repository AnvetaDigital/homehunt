"use client";

import PropertyCard from "./PropertyCard";

export default function PropertyList({
  properties,
  selectedId,
  onShowMap
}: any) {
  if (!properties || properties.length === 0) {
    return <p>No properties found</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {properties.map((property: any) => (
        <div
          id={`property-${property._id}`}
          key={property._id}
          className={`cursor-pointer rounded p-2 border ${
            selectedId === property._id
              ? "border-blue-500 shadow-lg"
              : "border-gray-200"
          }`}
        >
          <PropertyCard
          key={property._id}
          property={property} 
          onShowMap={onShowMap}
          />
        </div>
      ))}
    </div>
  );
}