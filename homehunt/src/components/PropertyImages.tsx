"use client";

import { useState } from "react";

export default function PropertyImages({ images }: any) {
  const [selected, setSelected] = useState(images?.[0]);

  if (!images?.length) return <p>No images</p>;

  return (
    <div className="space-y-4">
      
      {/* MAIN IMAGE */}
      <img
        src={selected.url}
        className="w-full h-96 object-cover rounded"
      />

      {/* THUMBNAILS */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img: any) => (
          <img
            key={img.public_id}
            src={img.url}
            onClick={() => setSelected(img)}
            className={`w-24 h-24 object-cover rounded cursor-pointer border ${
              selected.public_id === img.public_id
                ? "border-black"
                : "border-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}