import type { Metadata } from "next";
import PropertyTypesClient from "@/components/pages/PropertyTypesClient";
import PageIntro from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Property types",
  description:
    "Browse residential and commercial property types in Germany: studios, BHK apartments, houses, room and flat shares, offices, stores and event halls.",
};

export default function PropertyTypesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <PageIntro
        className="mb-14"
        note="Homes, rooms and workspaces"
        lead="Find the right kind of"
        highlight="space"
        description="Eleven property types across residential and commercial, each checked by our team before it goes live."
      />
      <PropertyTypesClient />
    </div>
  );
}
