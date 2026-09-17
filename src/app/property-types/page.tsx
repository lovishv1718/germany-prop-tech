import type { Metadata } from "next";
import PropertyTypesClient from "@/components/pages/PropertyTypesClient";

export const metadata: Metadata = {
  title: "Property types",
  description:
    "Browse residential and commercial property types in Germany: studios, BHK apartments, houses, room and flat shares, offices, stores and event halls.",
};

export default function PropertyTypesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div className="mb-14 max-w-3xl">
        <h1 className="text-4xl font-bold text-navy sm:text-6xl">Find the right kind of space</h1>
        <p className="mt-5 text-lg text-slate-600 sm:text-xl">
          Eleven property types across residential and commercial, each checked by our team before it goes live.
        </p>
      </div>
      <PropertyTypesClient />
    </div>
  );
}
