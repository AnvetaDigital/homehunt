"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ currentPage, totalPages }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className="px-4 py-2 border"
      >
        Prev
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
        className="px-4 py-2 border"
      >
        Next
      </button>
    </div>
  );
}
