"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"
import { useTransition } from "react";

export default function PropertyCard({ property, onShowMap }: any) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this property?");

    if(!confirmDelete) return;

    try{
      const res = await fetch(`/api/properties/${property._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if(!res.ok){
        alert(data.error);
        return;
      }

      alert("Deleted successfully");

      //Refresh server data
      startTransition(()=>{
        router.refresh();
      });
    }catch(err){
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow">

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

        <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={()=>
          router.push(`/properties/edit/${property._id}`)
        }
        >
          Edit
        </button>

        <button
        onClick={handleDelete}
        disabled={isPending}
        className="bg-red-500 text-white px-3 py-1 rounded"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  )
}