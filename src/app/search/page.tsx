import type { Metadata } from "next";
import { Suspense } from "react";
import SearchClient from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search properties",
  description:
    "Filter verified rentals, homes for sale, flat shares and commercial spaces across six German cities by type, budget, bedrooms and more.",
};

function SearchFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="h-10 w-72 animate-pulse rounded-btn bg-sand" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="hidden h-[520px] animate-pulse rounded-card bg-sand lg:block" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-card bg-sand" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchClient />
    </Suspense>
  );
}
