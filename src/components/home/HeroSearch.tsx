"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { CITIES, INTENTS, PROPERTY_TYPES, type City, type Intent, type PropertyType } from "@/data/properties";
import { BED_OPTIONS, budgetOptions, filtersToQuery } from "@/lib/search";
import { Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

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

  return (
    <form onSubmit={submit} className="rounded-card bg-white p-2 shadow-lift ring-1 ring-line">
      <div role="tablist" aria-label="What are you looking for?" className="flex gap-1 p-1">
        {INTENTS.map((i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={intent === i}
            onClick={() => {
              setIntent(i);
              setMaxPrice("");
            }}
            className={`h-10 flex-1 rounded-btn text-[15px] font-semibold transition-colors sm:flex-none sm:px-6 ${
              intent === i ? "bg-navy text-white" : "text-slate-600 hover:bg-sand hover:text-navy"
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.8fr_auto] lg:items-end">
        <div>
          <label htmlFor="hero-city" className="mb-1.5 block text-sm font-medium text-slate-600">
            City
          </label>
          <Select id="hero-city" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="hero-type" className="mb-1.5 block text-sm font-medium text-slate-600">
            Property type
          </label>
          <Select id="hero-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Any type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="hero-budget" className="mb-1.5 block text-sm font-medium text-slate-600">
            Max budget
          </label>
          <Select id="hero-budget" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
            <option value="">No limit</option>
            {budgetOptions(intent).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="hero-beds" className="mb-1.5 block text-sm font-medium text-slate-600">
            Bedrooms
          </label>
          <Select id="hero-beds" value={beds} onChange={(e) => setBeds(e.target.value)}>
            <option value="">Any</option>
            {BED_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}+
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" size="md" className="h-11 sm:col-span-2 lg:col-span-1 lg:px-7">
          <Search className="h-[18px] w-[18px]" strokeWidth={2.4} />
          Search
        </Button>
      </div>
    </form>
  );
}
