"use client";

import { Search } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import { PropertyMap } from "@/components/map";
import { usePublishedListings } from "@/context/AppContext";

export default function SearchPage() {
  const published = usePublishedListings();

  return (
    <ComingSoon
      icon={Search}
      eyebrow="Search"
      title="Find your next home or workspace"
      description={`${published.length} verified listings across Germany. Full filtering by intent, type, city and budget is on the way.`}
      planned={[
        "Filters for Rent, Buy and Share",
        "Property type, city, price and size filters",
        "List and map view side by side",
        "Save searches and favourite listings",
      ]}
    >
      <PropertyMap properties={published} className="h-[28rem]" />
    </ComingSoon>
  );
}
