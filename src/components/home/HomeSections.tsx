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
import { Highlight, ScriptNote } from "@/components/ui/Scribble";

export function SectionHeading({
  title,
  note,
  description,
  action,
  light = false,
}: {
  /** A plain title, or [lead, highlighted word] to draw the brush underline under the last word. */
  title: string | [string, string];
  note?: string;
  description?: string;
  action?: { href: string; label: string };
  light?: boolean;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {note && <ScriptNote className={`mb-1 -rotate-2 text-2xl ${light ? "text-sun" : "text-steel"}`}>{note}</ScriptNote>}
        <h2 className={`text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl ${light ? "text-white" : "text-navy"}`}>
          {typeof title === "string" ? (
            title
          ) : (
            <>
              {title[0]} <Highlight>{title[1]}</Highlight>
            </>
          )}
        </h2>
        {description && <p className={`mt-4 text-lg ${light ? "text-white/70" : "text-slate-600"}`}>{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-btn border border-line bg-white px-4 font-semibold text-navy transition hover:shadow-card sm:self-auto"
        >
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
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
      <SectionHeading
        title={["Verified", "this week"]}
        note="Fresh and checked"
        description="New listings from publishers whose identity and ownership we have checked."
        action={{ href: "/search?verified=1", label: "See all verified" }}
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
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          title={["Every kind of", "space"]}
          note="Homes to offices"
          description="From a room in a Berlin flat share to an office floor in Frankfurt."
          action={{ href: "/property-types", label: "Browse all types" }}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {PROPERTY_TYPES.map((type) => {
            const count = counts.get(type) ?? 0;
            return (
              <Link
                key={type}
                href={`/search?type=${encodeURIComponent(type)}`}
                className="group overflow-hidden rounded-card border border-line bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="aspect-[3/2] overflow-hidden rounded-[10px]">
                  <Photo src={TYPE_IMAGES[type]} alt="" className="h-full w-full transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-2 px-2 pb-1.5 pt-3">
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
            <div>
              <ScriptNote className="text-xl text-sun">Not sure yet?</ScriptNote>
              <p className="mt-1 font-display text-2xl font-bold leading-tight">
                All <LiveListingCount /> live listings
              </p>
            </div>
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
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        title={["Popular", "cities"]}
        note="Where people are moving"
        description="Live listing counts across Germany's six biggest rental markets."
        action={{ href: "/search?view=map", label: "Explore the map" }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((city, i) => {
          const count = published.filter((p) => p.city === city).length;
          return (
            <Link
              key={city}
              href={`/search?city=${city}`}
              className={`group relative block overflow-hidden rounded-[18px] bg-navy shadow-card ${
                i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : i === CITIES.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""
              }`}
            >
              <Photo
                src={CITY_IMAGES[city]}
                alt={city}
                className={`w-full transition duration-700 group-hover:scale-105 ${
                  i === 0 ? "aspect-[16/10] lg:h-full lg:aspect-auto" : i === CITIES.length - 1 ? "aspect-[16/10] sm:aspect-[21/9] lg:aspect-[16/5]" : "aspect-[16/10]"
                }`}
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-card bg-white/95 px-4 py-3 shadow-float backdrop-blur">
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
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-10 overflow-hidden rounded-[22px] bg-navy px-6 py-10 text-white shadow-float sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/90">
            <MessageCircle className="h-4 w-4 text-sun" /> WhatsApp alerts
          </span>
          <h2 className="mt-5 text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            Be the <Highlight>first</Highlight> to hear about new places.
          </h2>
          <ScriptNote className="mt-3 -rotate-2 text-2xl text-sun">Good flats go in hours</ScriptNote>
          <p className="mt-4 max-w-lg text-lg text-white/70">
            Get matching listings on WhatsApp the moment they are approved, before the viewings fill up.
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
                variant={plan.highlight ? "primary" : "ghost"}
                className={`mt-6 ${plan.highlight ? "" : "border border-white/30 text-white hover:bg-white/10"}`}
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
