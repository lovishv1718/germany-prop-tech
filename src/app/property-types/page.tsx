import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import { PROPERTY_TYPES } from "@/data/properties";

export const metadata: Metadata = { title: "Property Types | UFT Living Germany" };

export default function PropertyTypesPage() {
  return (
    <ComingSoon
      icon={LayoutGrid}
      eyebrow="Property Types"
      title="Every kind of space, in one place"
      description="From studios and flat shares to office floors and event halls."
      planned={[
        "A visual card for each property type",
        "Live listing counts per type",
        "Jump straight to filtered search results",
        "Guides for tenants, buyers and flatmates",
      ]}
    >
      <div className="flex flex-wrap gap-2">
        {PROPERTY_TYPES.map((type) => (
          <span key={type} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-navy shadow-soft">
            {type}
          </span>
        ))}
      </div>
    </ComingSoon>
  );
}
