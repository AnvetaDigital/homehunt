import AuthButton from "@/components/AuthButton";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">HomeHunt</h1>
      <AuthButton/>

      <Link href="/properties">
        <button className="bg-black text-white px-6 py-2 rounded">
          Browse Properties
        </button>
      </Link>
    </main>
  );
}
