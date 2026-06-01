"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import PropertyCard from "@/components/PropertyCard";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [allProperties, setAllProperties] = useState([]);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => setAllProperties(data.data || []));
  }, []);

  const filtered = allProperties.filter((p: any) =>
    favorites.includes(p._id)
  );

  if (!filtered.length) {
    return <p className="p-6 text-center">No favorites yet ❤️</p>;
  }

  return (
    <>
      <button
        onClick={() => router.push("/properties")}
        className="mb-4 mt-3.5 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ← Back to Properties
      </button>
      <div className="p-15 grid grid-cols-3 gap-6">
        {filtered.map((property: any) => (
          <PropertyCard
            key={property._id}
            property={property}
            showMapButton={false}
          />
        ))}
      </div>
    </>
  );
}