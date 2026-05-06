"use client";

import { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";

export default function FavoritesPage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("/api/favorites/list")
      .then((res) => res.json())
      .then((data) => setProperties(data.data || []));
  }, []);

  if (!properties.length) {
    return (
      <p className="p-6 text-center text-gray-500">
        No favorites yet ❤️
      </p>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {properties.map((property: any) => (
        <PropertyCard
          key={property._id}
          property={property}
        />
      ))}
    </div>
  );
}