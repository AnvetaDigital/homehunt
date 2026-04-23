export default function PropertyCard({property}: any){
    return (
        <div className="border rounded-lg p-4 shadow">

            <img
            src={property.images?.[0]?.url}
            alt="property"
            className="w-full h-40 object-cover rounded"
            />

            <h2 className="text-lg font-semibold mt-2">
            {property.title}
            </h2>

            <p className="text-gray-600">
            {property.location?.city}
            </p>

            <p className="font-bold mt-2">
            ₹ {property.price.toLocaleString("en-IN")}
            </p>

        </div>
    )
}