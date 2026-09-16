"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { useApp, usePublishedListings } from "@/context/AppContext";
import {
  CITIES,
  CITY_IMAGES,
  CITY_STATE,
  COMMERCIAL_TYPES,
  PROPERTY_TYPES,
  TYPE_IMAGES,
  formatEUR,
} from "@/data/properties";
import PropertyCard from "@/components/property/PropertyCard";
import Photo from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Button";

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-navy sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-lg text-slate-600">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-navy">
          {action.label}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function LiveListingCount() {
  const published = usePublishedListings();
  return <>{published.length}</>;
}

export function VerifiedThisWeek() {
  const published = usePublishedListings();
  const latest = useMemo(
    () => published.filter((p) => p.verified).sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, 6),
    [published],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        title="Verified this week"
        description="Fresh listings from publishers whose identity and ownership we have checked."
        action={{ href: "/search?verified=1", label: "See all verified listings" }}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}

export function PropertyTypeGrid() {
  const published = usePublishedListings();
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    published.forEach((p) => map.set(p.type, (map.get(p.type) ?? 0) + 1));
    return map;
  }, [published]);

  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          title="Every kind of space"
          description="From a room in a Berlin flat share to an office floor in Frankfurt."
          action={{ href: "/property-types", label: "Browse property types" }}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {PROPERTY_TYPES.map((type) => {
            const count = counts.get(type) ?? 0;
            return (
              <Link
                key={type}
                href={`/search?type=${encodeURIComponent(type)}`}
                className="group overflow-hidden rounded-card bg-white transition hover:shadow-lift"
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <Photo src={TYPE_IMAGES[type]} alt="" className="h-full w-full transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-2 px-3.5 py-3 sm:px-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy">{type}</p>
                    <p className="text-sm text-slate-500">
                      {count} {count === 1 ? "listing" : "listings"}
                      {COMMERCIAL_TYPES.includes(type) && <span className="hidden sm:inline"> · Commercial</span>}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-navy" />
                </div>
              </Link>
            );
          })}
          <Link
            href="/search"
            className="flex flex-col justify-between rounded-card bg-navy p-5 text-white transition hover:bg-navy-800"
          >
            <p className="font-display text-2xl font-bold leading-tight">
              All <LiveListingCount /> live listings
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-sun">
              Open search <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PopularCities() {
  const published = usePublishedListings();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading title="Popular cities" description="Live listing counts across Germany's six biggest rental markets." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((city, i) => {
          const count = published.filter((p) => p.city === city).length;
          return (
            <Link
              key={city}
              href={`/search?city=${city}`}
              className={`group relative block overflow-hidden rounded-card bg-navy ${i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}
            >
              <Photo
                src={CITY_IMAGES[city]}
                alt={city}
                className={`w-full transition duration-700 group-hover:scale-105 ${i === 0 ? "aspect-[16/10] lg:h-full lg:aspect-auto" : "aspect-[16/10]"}`}
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-[10px] bg-white px-4 py-3">
                <div>
                  <p className="font-display text-lg font-bold leading-tight text-navy">{city}</p>
                  <p className="text-sm text-slate-500">{CITY_STATE[city]}</p>
                </div>
                <p className="text-right text-sm text-slate-600">
                  <span className="block font-display text-xl font-bold leading-none text-navy">{count}</span>
                  {count === 1 ? "listing" : "listings"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function AlertsCta() {
  const { settings } = useApp();
  const monthlyEquivalent = settings.quarterlyPrice / 3;
  const saving = Math.round((1 - monthlyEquivalent / settings.monthlyPrice) * 100);

  const plans = [
    { id: "monthly", name: "Monthly", price: settings.monthlyPrice, note: "Cancel anytime", highlight: false },
    { id: "quarterly", name: "Quarterly", price: settings.quarterlyPrice, note: saving > 0 ? `Save ${saving}% versus monthly` : "Billed every 3 months", highlight: true },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 overflow-hidden rounded-card bg-navy px-6 py-10 text-white sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-sm font-medium text-white/90">
            <MessageCircle className="h-4 w-4 text-sun" /> WhatsApp alerts
          </span>
          <h2 className="mt-5 text-3xl font-bold sm:text-[42px] sm:leading-[1.1]">Be the first to hear about new places.</h2>
          <p className="mt-4 max-w-lg text-lg text-white/70">
            Good flats in Munich go in hours. Get matching listings on WhatsApp the moment they are approved.
          </p>
          <ul className="mt-6 space-y-2.5 text-white/85">
            {["Alerts by city, type and budget", "Instant delivery, usually under 60 seconds", "Pause or cancel from WhatsApp"].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-sun" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-card p-6 ${plan.highlight ? "bg-white text-navy" : "bg-white/5 ring-1 ring-inset ring-white/15"}`}
            >
              <p className="font-semibold">{plan.name}</p>
              <p className="mt-3 font-display text-4xl font-bold tracking-tight">{formatEUR(plan.price, true)}</p>
              <p className={`mt-1 text-sm ${plan.highlight ? "text-slate-500" : "text-white/60"}`}>{plan.note}</p>
              <ButtonLink
                href={`/subscriptions?plan=${plan.id}`}
                variant={plan.highlight ? "primary" : "outline"}
                className={`mt-6 ${plan.highlight ? "" : "border-white/25 bg-transparent text-white hover:bg-white/10"}`}
              >
                Choose {plan.name.toLowerCase()}
              </ButtonLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
