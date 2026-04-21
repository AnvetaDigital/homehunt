"use client";

import PropertyCard from "./PropertyCard";

export default function PropertyList({ properties, onSelect }: any) {
  if (!properties || properties.length === 0) {
    return <p>No properties found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {properties.map((property: any) => (
        <div
          id={`property-${property._id}`}
          key={property._id}
          onClick={() => onSelect(property)}
          className="cursor-pointer"
        >
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
}