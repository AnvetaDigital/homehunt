"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const applyFilters = () => {
    // ✅ Convert to numbers safely
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    // ✅ Validation
    if (min !== null && max !== null && min > max) {
      alert("Min price cannot be greater than max price");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (city) params.set("city", city);
    else params.delete("city");

    if (category) params.set("category", category);
    else params.delete("category");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`/properties?${params.toString()}`);
  };

 const clearFilters = () => {
  setCity("");
  setCategory("");
  setMinPrice("");
  setMaxPrice("");

  router.replace("/properties");
};

  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="City"
        className="border p-2"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <select
        className="border p-2"
        onChange={(e) => setCategory(e.target.value)}
        value={category}
      >
        <option value="">All</option>
        <option value="apartment">Apartment</option>
        <option value="villa">Villa</option>
        <option value="plot">Plot</option>
        <option value="commercial">Commercial</option>

      </select>

      <input
        type="number"
        placeholder="Min Price"
        className="border p-2"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max Price"
        className="border p-2"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <button onClick={applyFilters} className="bg-black text-white px-4">
        Apply
      </button>

      <button
      onClick={clearFilters}
      className="bg-gray-300 px-4 py-2 rounded ml-2"
      >
        Clear Filters
      </button>
    </div>
  );
}
