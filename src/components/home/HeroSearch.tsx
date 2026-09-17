"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BedDouble, Euro, House, MapPin, Search, Tag, UsersRound, type LucideIcon } from "lucide-react";
import { CITIES, PROPERTY_TYPES, type City, type Intent, type PropertyType } from "@/data/properties";
import { BED_OPTIONS, budgetOptions, filtersToQuery } from "@/lib/search";
import { Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const TABS: { intent: Intent; icon: LucideIcon }[] = [
  { intent: "Rent", icon: House },
  { intent: "Buy", icon: Tag },
  { intent: "Share", icon: UsersRound },
];

export default function HeroSearch() {
  const router = useRouter();
  const [intent, setIntent] = useState<Intent>("Rent");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = filtersToQuery({
      intent,
      city: (city || null) as City | null,
      type: (type || null) as PropertyType | null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      beds: beds ? Number(beds) : null,
    });
    router.push(`/search?${query}`);
  };

  const label = "mb-1.5 block text-sm font-medium text-slate-600";

  return (
    <form onSubmit={submit} className="rounded-card border border-line/80 bg-white p-4 shadow-float sm:p-5">
      <div role="tablist" aria-label="What are you looking for?" className="flex gap-1.5">
        {TABS.map(({ intent: i, icon: Icon }) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={intent === i}
            onClick={() => {
              setIntent(i);
              setMaxPrice("");
            }}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-btn text-[15px] font-semibold transition-colors sm:flex-none sm:px-5 ${
              intent === i ? "bg-navy text-white" : "text-navy hover:bg-sand"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            {i}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_176px] lg:items-end lg:gap-3.5">
        <div>
          <label htmlFor="hero-city" className={label}>
            City
          </label>
          <Select id="hero-city" icon={MapPin} value={city} onChange={(e) => setCity(e.target.value)} className="[&_select]:h-12">
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="hero-type" className={label}>
            Property type
          </label>
          <Select id="hero-type" icon={House} value={type} onChange={(e) => setType(e.target.value)} className="[&_select]:h-12">
            <option value="">Any type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="hero-budget" className={label}>
            Max budget
          </label>
          <Select id="hero-budget" icon={Euro} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="[&_select]:h-12">
            <option value="">No limit</option>
            {budgetOptions(intent).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="hero-beds" className={label}>
            Bedrooms
          </label>
          <Select id="hero-beds" icon={BedDouble} value={beds} onChange={(e) => setBeds(e.target.value)} className="[&_select]:h-12">
            <option value="">Any</option>
            {BED_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}+
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" variant="primary" className="h-12 text-base sm:col-span-2 lg:col-span-1">
          <Search className="h-5 w-5" strokeWidth={2.4} />
          Search
        </Button>
      </div>
    </form>
  );
}
