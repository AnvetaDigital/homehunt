"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return(
      <div className="flex items-center gap-4">
        <img
          src={session.user?.image || ""}
          className="w-8 h-8 rounded-full"
        />
        <p className="text-sm">{session.user?.name}</p>

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
      Login with Google
    </button>
  );
}