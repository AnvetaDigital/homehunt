"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p className="w-7 h-7">
          {session.user?.name || ""}
        </p>
        
        <Link href="/properties/add">
          <button className="bg-green-600 text-white px-3 py-1 rounded">
            + Add Property
          </button>
        </Link>

        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Login
    </button>
  );
}