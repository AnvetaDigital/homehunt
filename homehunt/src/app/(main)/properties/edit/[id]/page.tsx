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

  useEffect(() => {
    if(!params?.id) return;

    fetchData();
  }, [params.id]);

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
    } catch (err) {
      console.error("Fetch error: ", err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`/api/properties/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title,
        price: Number(form.price),
        location: { city: form.city },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error);
      return;
    }

    alert("Updated!");
    router.push("/properties");
    router.refresh();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 w-full"
        />

        <button className="bg-black text-white px-4 py-2">Update</button>
      </form>
    </div>
  );
}
