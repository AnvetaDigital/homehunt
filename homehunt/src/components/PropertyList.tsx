"use client";

import PropertyCard from "./PropertyCard";

export default function PropertyList({
  properties,
  onSelect,
  selectedId,
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
          onClick={() => onSelect(property)}
          className={`cursor-pointer rounded p-2 border ${
            selectedId === property._id
              ? "border-blue-500 shadow-lg"
              : "border-gray-200"
          }`}
        >
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
}