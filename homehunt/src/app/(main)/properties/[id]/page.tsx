import Image from "next/image";
import Link from "next/link";

async function getProperty(id: string) {
  const res = await fetch(`http://localhost:3000/api/properties/${id}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function PropertyDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProperty(id);
  const property = data?.data;

  if (!property) {
    return <p className="p-6">Property not found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      
      {/* Back */}
      <Link href="/properties" className="text-blue-600 mb-4 inline-block">
        ← Back to Properties
      </Link>

      {/* Image */}
      <div className="w-full h-100 relative mb-6">
        <Image
          src={property.images?.[0]?.url}
          alt="property"
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Details */}
      <h1 className="text-3xl font-bold mb-2">
        {property.title}
      </h1>

      <p className="text-gray-600 mb-2">
        {property.location?.city}
      </p>

      <p className="text-xl font-semibold mb-4">
        ₹ {property.price.toLocaleString("en-IN")}
      </p>

      <div className="mb-4">
        <span className="bg-gray-200 px-3 py-1 rounded">
          {property.category}
        </span>
      </div>

      <p className="text-gray-700 leading-relaxed">
        {property.description}
      </p>
    </div>
  );
}