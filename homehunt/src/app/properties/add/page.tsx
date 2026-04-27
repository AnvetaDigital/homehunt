"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

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
    const file = e.target.files[0];
    if (!file) return;

    console.log("Selected file:", file);

    if (file.size > 2 * 1024 * 1024) {
      alert("Max file size is 2MB");
      return;
    }

    try {
      const sigRes = await fetch("/api/cloudinary-signature", {
        method: "POST",
      });

      const sigData = await sigRes.json();
      console.log("Signature response:", sigData);

      const { timestamp, signature, apiKey, cloudName, folder } = sigData;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);


      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await uploadRes.json();
      console.log("Cloudinary response:", data);

      if (!uploadRes.ok) {
        console.error("Upload failed:", data);
        alert("Image upload failed");
        return;
      }

      if (!data.secure_url || !data.public_id) {
        console.error("Invalid Cloudinary response");
        alert("Invalid image response");
        return;
      }

      setImages((prev) => [
        ...prev,
        {
          url: data.secure_url,
          public_id: data.public_id,
        },
      ]);

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
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
      console.log("API response:", data);

      if (!res.ok) {
        alert(data.error || "Failed to add property");
        return;
      }

      alert("✅ Property added successfully!");

      setForm({
        title: "",
        description: "",
        price: "",
        city: "",
        category: "",
      });
      setImages([]);
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
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          placeholder="City"
          className="border p-2 w-full"
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        />

        <select
          className="border p-2 w-full"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}