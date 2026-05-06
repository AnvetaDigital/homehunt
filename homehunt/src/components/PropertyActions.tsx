"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PropertyActions({ property }: any) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);

    try {
      const res = await fetch(`/api/properties/${property._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Delete failed");
        return;
      }

      toast.success("Property deleted");
      router.push("/properties");
      router.refresh();
    } catch {
      toast.error("Error deleting property");
    }
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
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="mb-4">Are you sure you want to delete?</p>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                No
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}