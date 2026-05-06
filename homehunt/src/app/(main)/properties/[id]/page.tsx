import PropertyImages from "@/components/PropertyImages";
import PropertyActions from "@/components/PropertyActions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetails({ params }: Props) {
  const { id } = await params; 
console.log("ID:", id);
  const res = await fetch(
    `http://localhost:3000/api/properties/${id}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const property = data.data || data;

  if (!property || property.error) {
    return <p className="p-6">Property not found</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* TITLE + PRICE */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{property.title}</h1>
      </div>

      {/* IMAGE GALLERY */}
      <PropertyImages images={property.images} />

      {/* BASIC INFO */}
      <div className="grid grid-cols-2 gap-4">
        <p><strong>City:</strong> {property.location?.city}</p>
        <p><strong>Category:</strong> {property.category}</p>
        <p><strong>Area:</strong> {property.area || "-"} sqft</p>
           <p className="text-xl font-semibold text-black-600">
          ₹ {property.price.toLocaleString()}
        </p>
      </div>

      {/* DESCRIPTION */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{property.description}</p>
      </div>

      {/* ACTION BUTTONS */}
      <PropertyActions property={property} />
    </div>
  );
}