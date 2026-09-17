"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { usePublishedListings } from "@/context/AppContext";
import { COMMERCIAL_TYPES, RESIDENTIAL_TYPES, TYPE_DESCRIPTIONS, TYPE_IMAGES, type PropertyType } from "@/data/properties";
import Photo from "@/components/ui/Photo";

const GROUPS: { title: string; category: "Residential" | "Commercial"; text: string; types: PropertyType[] }[] = [
  {
    title: "Residential",
    category: "Residential",
    text: "Homes to rent or buy, and rooms in shared flats for students and young professionals.",
    types: RESIDENTIAL_TYPES,
  },
  {
    title: "Commercial",
    category: "Commercial",
    text: "Workspaces, retail units and venues for businesses of every size.",
    types: COMMERCIAL_TYPES,
  },
];

export default function PropertyTypesClient() {
  const published = usePublishedListings();
  const counts = useMemo(() => {
    const map = new Map<PropertyType, number>();
    published.forEach((p) => map.set(p.type, (map.get(p.type) ?? 0) + 1));
    return map;
  }, [published]);

  return (
    <div className="space-y-20">
      {GROUPS.map((group) => {
        const total = group.types.reduce((sum, t) => sum + (counts.get(t) ?? 0), 0);
        return (
          <section key={group.title} aria-labelledby={`group-${group.category}`}>
            <div className="mb-8 flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id={`group-${group.category}`} className="text-3xl font-bold text-navy sm:text-4xl">
                  {group.title}
                  <span className="ml-3 align-middle font-sans text-base font-medium tracking-normal text-slate-500">{total} live listings</span>
                </h2>
                <p className="mt-2 max-w-xl text-lg text-slate-600">{group.text}</p>
              </div>
              <Link href={`/search?category=${group.category}`} className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-navy">
                All {group.title.toLowerCase()}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className={`grid gap-5 sm:grid-cols-2 ${group.types.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {group.types.map((type) => {
                const count = counts.get(type) ?? 0;
                return (
                  <Link key={type} href={count > 0 ? `/search?type=${encodeURIComponent(type)}` : "/subscriptions"} className="group flex flex-col overflow-hidden rounded-card border border-line bg-white transition hover:shadow-lift">
                    <div className="aspect-[4/3] overflow-hidden bg-sand">
                      <Photo src={TYPE_IMAGES[type]} alt="" className="h-full w-full transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-xl font-bold text-navy">{type}</h3>
                        <span className="shrink-0 text-sm font-medium text-slate-500">
                          {count} {count === 1 ? "listing" : "listings"}
                        </span>
                      </div>
                      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-600">{TYPE_DESCRIPTIONS[type]}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                        {count > 0 ? "Browse listings" : "Set up an alert"}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
