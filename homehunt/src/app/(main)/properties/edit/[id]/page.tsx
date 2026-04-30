"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    price: "",
    city: "",
    category: "",
  });

  const [images, setImages] = useState<
    { url: string; public_id: string }[]
  >([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    fetchData();
  }, [params?.id]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/properties/${params.id}`);
      const data = await res.json();

      const property = data.data || data;

      if (!property || property.error) {
        alert(property?.error || "Failed to load property");
        return;
      }

      setForm({
        title: property.title || "",
        description: property.description || "",
        price: property.price || "",
        city: property.location?.city || "",
        category: property.category || "",
      });

      setImages(property.images || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Upload image
  const handleImageUpload = async (e: any) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    if (files.length > 5) {
      alert("Max 5 images allowed");
      return;
    }

    try {
      //get signature
      const sigRes = await fetch("/api/cloudinary-signature", {
        method: "POST",
      });

      const { timestamp, signature, apiKey, cloudName, folder } =
        await sigRes.json();

      //upload all images in parallel
      const uploadPromises = files.map(async (file: any) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();

        return {
          url: data.secure_url,
          public_id: data.public_id,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      //add all images at once
      setImages((prev) => [...prev, ...uploadedImages]);

      console.log("Uploaded images...", uploadedImages);

      e.target.value = ""; //reset input
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image Upload failed");
    }
  };

  // Remove image (UI only)
  const handleRemoveImage = (public_id: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== public_id));
  };

  // Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/properties/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          location: { city: form.city },
          images,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }

      alert("Property updated!");
      router.push("/properties");
      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border p-2 w-full"
        />

        {/* CATEGORY DROPDOWN */}
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Select Category</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />

        {/* IMAGE PREVIEW */}
        <div className="flex gap-2 flex-wrap">
          {images.map((img) => (
            <div key={img.public_id} className="relative">
              <img src={img.url} className="w-20 h-20 object-cover rounded" />

              <button
                type="button"
                onClick={() => handleRemoveImage(img.public_id)}
                className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button disabled={loading} className="bg-black text-white px-4 py-2">
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
