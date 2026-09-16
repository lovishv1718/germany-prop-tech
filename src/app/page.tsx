"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, MapPin } from "lucide-react";
import { useApp, usePublishedListings } from "@/context/AppContext";
import { CITIES } from "@/data/properties";

// Temporary landing page: confirms the layout, mock data and role context are wired up.
export default function HomePage() {
  const { role, listings } = useApp();
  const published = usePublishedListings();

  const stats = [
    { label: "Total listings", value: listings.length, icon: Building2 },
    { label: "Published", value: published.length, icon: BadgeCheck },
    { label: "Cities", value: CITIES.length, icon: MapPin },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-dark">
        Viewing as {role}
      </p>
      <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
        Rent, buy and share properties across Germany.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Verified homes, rooms and commercial spaces in {CITIES.join(", ")}.
      </p>
      <Link
        href="/search"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-accent-dark"
      >
        Start searching <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
            <Icon className="h-6 w-6 text-accent" />
            <p className="mt-4 text-3xl font-bold text-navy">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
