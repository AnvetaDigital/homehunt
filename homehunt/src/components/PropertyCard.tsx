"use client";

import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

export default function PropertyCard({ property, onShowMap }: any) {

  return (
    <div className="border rounded-lg p-4 shadow relative">

      <div className="absolute top-2 right-2 text-xl">
        <FavoriteButton propertyId={property._id} />
      </div>

      <img
        src={property.images?.[0]?.url}
        alt="property"
        className="w-full h-40 object-cover rounded"
      />

      <h2 className="text-lg font-semibold mt-2">
        {property.title}
      </h2>

      <p className="text-gray-600">
        {property.location?.city}
      </p>

      <p className="font-bold mt-2">
        ₹ {property.price.toLocaleString("en-IN")}
      </p>

      <div className="flex gap-3 mt-4">

        {/* Action Buttons */}
        <Link href={`/properties/${property._id}`}>
          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            See Details
          </button>
        </Link>

        <button
          onClick={() => onShowMap(property)}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Show on Map
        </button>
      </div>
    </div>
  )
}