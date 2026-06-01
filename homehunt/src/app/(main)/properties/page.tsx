import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import MapWrapper from "@/components/MapWrapper";
import User from "@/models/User";
import Link from "next/link";

type Props = {
  searchParams: Promise<Record<string, string>>;
};

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;

  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/properties?${query}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <>
      <Link href="/" className="mb-4 mt-3.5 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        ← Back to Home
      </Link>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Properties</h1>

        <Filters />

        <MapWrapper 
        properties={data?.data || []}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
         />
      </div>
    </>
  );
}