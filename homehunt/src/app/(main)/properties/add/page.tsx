"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddPropertyPage() {
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
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

  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <div className="p-6">
        <p>You must login to add property</p>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Login
        </button>
      </div>
    );
  }

  // Upload Image
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

  const handleRemoveImage = (public_id: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== public_id));
  };

  // Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Upload at least one image");
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      location: {
        city: form.city,
      },
      images,
    };

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add property");
        return;
      }

      toast.success("Property created successfully");
      router.push(`/properties/${data.data._id}`);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          className="border p-2 w-full"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          placeholder="City"
          className="border p-2 w-full"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <select
          className="border p-2 w-full"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />

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
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}