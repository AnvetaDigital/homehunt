"use client";

import { useRouter } from "next/navigation";

export default function PropertyActions({ property }: any) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/properties/${property._id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    alert("Deleted!");
    router.push("/properties");
    router.refresh();
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={() => router.push(`/properties/edit/${property._id}`)}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Edit
      </button>

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2"
      >
        Delete
      </button>
    </div>
  );
}