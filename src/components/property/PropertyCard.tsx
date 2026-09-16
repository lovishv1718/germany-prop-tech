"use client";

import Link from "next/link";
import { BedDouble, Heart, MapPin, Ruler } from "lucide-react";
import { bedroomsLabel, formatEUR, PERIOD_LABEL, type Property } from "@/data/properties";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/components/ui/Toast";
import { IntentBadge, VerifiedBadge } from "@/components/ui/Badge";
import Photo from "@/components/ui/Photo";

export function SaveButton({ propertyId, className = "" }: { propertyId: string; className?: string }) {
  const { savedIds, toggleSaved } = useApp();
  const toast = useToast();
  const saved = savedIds.includes(propertyId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toast(toggleSaved(propertyId) ? "Saved to your shortlist" : "Removed from your shortlist", "info");
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/95 text-navy shadow-soft transition hover:scale-105 ${className}`}
    >
      <Heart className={`h-[18px] w-[18px] ${saved ? "fill-red-500 text-red-500" : ""}`} strokeWidth={2.2} />
    </button>
  );
}

export default function PropertyCard({ property: p, eager = false }: { property: Property; eager?: boolean }) {
  const beds = bedroomsLabel(p);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-white transition hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Photo
          src={p.images[0]}
          alt={p.title}
          eager={eager}
          className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
        />
        <IntentBadge intent={p.intent} className="absolute left-3 top-3 shadow-sm" />
        <SaveButton propertyId={p.id} className="absolute right-3 top-3 z-10" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="font-display text-[22px] font-bold leading-none tracking-tight text-navy">
          {formatEUR(p.price)}
          {PERIOD_LABEL[p.pricePeriod] && (
            <span className="ml-1 font-sans text-sm font-medium tracking-normal text-slate-500">{PERIOD_LABEL[p.pricePeriod]}</span>
          )}
        </p>
        <h3 className="mt-2.5 font-sans text-base font-semibold leading-snug tracking-normal text-navy">
          <Link href={`/property/${p.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {p.locality}, {p.city}
        </p>

        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-700">
          <li className="font-medium">{p.type}</li>
          {beds && (
            <li className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-slate-400" />
              {beds}
            </li>
          )}
          <li className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-slate-400" />
            {p.sizeSqm} m²
          </li>
        </ul>

        <div className="min-h-4 flex-1" />
        <div className="flex items-center justify-between gap-2 border-t border-line pt-3.5">
          <span className="text-sm text-slate-500">
            Listed by <span className="font-medium text-slate-700">{p.publisherType}</span>
          </span>
          {p.verified && <VerifiedBadge />}
        </div>
      </div>
    </article>
  );
}
