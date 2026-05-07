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
    const toastId = toast.loading("Uploading images...");

    if (!files.length) return;

    if (files.length > 5) {
      toast.error("Max 5 images allowed");
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
      toast.success("Images uploaded", { id: toastId });

      e.target.value = ""; //reset input
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
    }
  };

  const handleRemoveImage = (public_id: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== public_id));
  };

  // Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

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
        toast.error(data.error || "Failed to add property");
        return;
      }

      toast.success("Property added successfully!");

      setTimeout(() => {
        router.push(`/properties/${data.data._id}`);
      }, 1200);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const hasAlphabet = (value: string) => {
    return /[a-zA-Z]/.test(value);
  };

const validateForm = () => {
  if (!form.title.trim()) {
    toast.error("Title is required");
    return false;
  }

  if (!hasAlphabet(form.title)) {
    toast.error("Title must contain letters");
    return false;
  }

  if (form.title.length < 5) {
    toast.error("Title must be at least 5 characters");
    return false;
  }

  if (!form.description.trim()) {
    toast.error("Description is required");
    return false;
  }

  if (!hasAlphabet(form.description)) {
    toast.error("Description must contain letters");
    return false;
  }

  if (form.description.length < 20) {
    toast.error("Description must be at least 20 characters");
    return false;
  }

  if (!form.price) {
    toast.error("Price is required");
    return false;
  }

  if (Number(form.price) <= 0) {
    toast.error("Price must be greater than 0");
    return false;
  }

  if (!form.city.trim()) {
    toast.error("City is required");
    return false;
  }

  if (!hasAlphabet(form.city)) {
    toast.error("City must contain letters");
    return false;
  }

  if (!form.category) {
    toast.error("Please select a category");
    return false;
  }

  if (images.length === 0) {
    toast.error("Upload at least one image");
    return false;
  }

  return true;
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

        <button
          disabled={loading}
          className={`px-4 py-2 text-white ${
            loading ? "bg-gray-400" : "bg-black"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}