"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { BedDouble, CalendarDays, Check, ChevronRight, Eye, Info, LayoutGrid, MapPin, Ruler, SearchX, Sofa } from "lucide-react";
import { useApp, usePublishedListings } from "@/context/AppContext";
import { DEMO_PUBLISHER, bedroomsLabel, formatDate, termsFor, type Property } from "@/data/properties";
import { useHydrated } from "@/lib/useHydrated";
import Gallery from "./Gallery";
import ContactPanel from "./ContactPanel";
import PropertyCard from "./PropertyCard";
import { PropertyMap } from "@/components/map";
import { IntentBadge, StatusBadge, Tag, VerifiedBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

function NotAvailable() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <SearchX className="h-12 w-12 text-slate-400" strokeWidth={1.6} />
      <h1 className="mt-5 text-3xl font-bold text-navy sm:text-4xl">This listing is not available</h1>
      <p className="mt-3 text-lg text-slate-600">It may have been let, sold or paused by the publisher, or it is still waiting for review.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/search" variant="primary">
          Browse available properties
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-5 w-64 animate-pulse rounded bg-sand" />
      <div className="mt-6 h-[320px] animate-pulse rounded-card bg-sand sm:h-[460px]" />
      <div className="mt-8 h-10 w-2/3 animate-pulse rounded bg-sand" />
    </div>
  );
}

function SimilarProperties({ property }: { property: Property }) {
  const published = usePublishedListings();
  const similar = useMemo(() => {
    const score = (p: Property) => (p.city === property.city ? 2 : 0) + (p.type === property.type ? 2 : 0) + (p.intent === property.intent ? 1 : 0);
    return published
      .filter((p) => p.id !== property.id)
      .map((p) => ({ p, s: score(p) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s || b.p.listedAt.localeCompare(a.p.listedAt))
      .slice(0, 3)
      .map(({ p }) => p);
  }, [published, property]);

  if (similar.length === 0) return null;
  return (
    <section className="border-t border-line bg-sand">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold text-navy">Similar properties</h2>
          <Link href={`/search?city=${property.city}`} className="font-semibold text-navy hover:underline">
            More in {property.city}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PropertyDetail({ id }: { id: string }) {
  const { listings, role } = useApp();
  const hydrated = useHydrated();
  const property = listings.find((p) => p.id === id);

  // Listings created in the demo are prerendered under a generic title, so name the tab on the client.
  useEffect(() => {
    if (property) document.title = `${property.title}, ${property.city} | UFT Living Germany`;
  }, [property]);

  if (!property) return hydrated ? <NotAvailable /> : <DetailSkeleton />;

  const isPublic = property.status === "Published" && !property.paused;
  const canPreview = role === "Admin" || (role === "Publisher" && property.publisherId === DEMO_PUBLISHER.id);
  if (!isPublic && !canPreview) return hydrated ? <NotAvailable /> : <DetailSkeleton />;

  const beds = bedroomsLabel(property);
  const facts = [
    { icon: LayoutGrid, label: "Type", value: property.type },
    beds && { icon: BedDouble, label: "Bedrooms", value: property.bedrooms === 0 ? "Studio" : String(property.bedrooms) },
    { icon: Ruler, label: "Size", value: `${property.sizeSqm} m²` },
    { icon: Sofa, label: "Furnishing", value: property.furnished ? "Furnished" : "Unfurnished" },
    { icon: CalendarDays, label: "Available", value: formatDate(property.availableFrom, { day: "numeric", month: "short" }) },
  ].filter(Boolean) as { icon: typeof Ruler; label: string; value: string }[];

  return (
    <>
      {!isPublic && (
        <div className="border-b border-sun/40 bg-sun-soft">
          <p className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 text-sm text-[#6b4e00] sm:px-6 lg:px-8">
            <Info className="h-4 w-4 shrink-0" />
            Preview only. This listing is <StatusBadge status={property.paused ? "Paused" : property.status} /> and not visible in search.
          </p>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 overflow-hidden">
          <ol className="flex items-center gap-1.5 text-sm text-slate-500">
            <li className="shrink-0"><Link href="/" className="hover:text-navy">Home</Link></li>
            <li className="flex shrink-0 items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/search" className="hover:text-navy">Search</Link>
            </li>
            <li className="flex shrink-0 items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={`/search?city=${property.city}`} className="hover:text-navy">{property.city}</Link>
            </li>
            <li className="flex min-w-0 items-center gap-1.5 font-medium text-navy" aria-current="page">
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{property.title}</span>
            </li>
          </ol>
        </nav>

        <Gallery images={property.images} title={property.title} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <IntentBadge intent={property.intent} />
              <Tag>{property.type}</Tag>
              {property.verified && <VerifiedBadge />}
              <span className="ml-auto flex items-center gap-1.5 text-sm text-slate-500">
                <Eye className="h-4 w-4" /> {property.views.toLocaleString("de-DE")} views
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-navy sm:text-[44px]">{property.title}</h1>
            <p className="mt-3 flex items-center gap-1.5 text-lg text-slate-600">
              <MapPin className="h-5 w-5 shrink-0" />
              {property.locality}, {property.city}, {property.state}
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white px-4 py-4">
                  <dt className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Icon className="h-4 w-4" /> {label}
                  </dt>
                  <dd className="mt-1 font-semibold text-navy">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="lg:sticky lg:top-24">
              <ContactPanel property={property} />
            </div>
          </aside>

          <div className="min-w-0 space-y-12 lg:col-start-1">
            <section>
              <h2 className="text-2xl font-bold text-navy">About this property</h2>
              <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-slate-700">{property.description}</p>
              <p className="mt-4 text-sm text-slate-500">Listed {formatDate(property.listedAt)} · Reference {property.id.toUpperCase()}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy">Amenities</h2>
              <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-[16px] text-slate-700">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sand">
                      <Check className="h-4 w-4 text-navy" strokeWidth={2.5} />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy">{property.intent === "Buy" ? "Purchase terms" : "Rental terms"}</h2>
              <dl className="mt-5 divide-y divide-line rounded-card border border-line">
                {termsFor(property).map((t) => (
                  <div key={t.label} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:justify-between">
                    <dt className="text-slate-500">{t.label}</dt>
                    <dd className="font-semibold text-navy">{t.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy">Location</h2>
              <p className="mt-2 text-slate-600">
                {property.locality}, {property.city}. The exact address is shared by the publisher after you get in touch.
              </p>
              <PropertyMap properties={[property]} approximate className="mt-5 h-80" />
            </section>
          </div>
        </div>
      </div>

      <SimilarProperties property={property} />
    </>
  );
}
