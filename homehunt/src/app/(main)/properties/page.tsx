import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import MapWrapper from "@/components/MapWrapper";
import User from "@/models/User";

type Props = {
  searchParams: Promise<Record<string, string>>;
};

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;

  const query = new URLSearchParams(params).toString();

  const res = await fetch(`http://localhost:3000/api/properties?${query}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>

      <Filters />

      {/* ✅ Map + List handled together */}
      <MapWrapper properties={data?.data || []} />

      <Pagination
        currentPage={data.currentPage}
        totalPages={data.totalPages}
      />
    </div>
  );
}