"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, List, Map as MapIcon, SearchX, SlidersHorizontal, X } from "lucide-react";
import { usePublishedListings } from "@/context/AppContext";
import { CITIES, INTENTS, formatEUR, type Category, type City, type Intent, type PropertyType } from "@/data/properties";
import {
  BED_OPTIONS,
  SORT_OPTIONS,
  activeFilterCount,
  applyFilters,
  budgetOptions,
  filtersToQuery,
  parseFilters,
  typesForCategory,
  type SearchFilters,
  type SortKey,
} from "@/lib/search";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyMap } from "@/components/map";
import { Checkbox, Label, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Highlight, ScriptNote } from "@/components/ui/Scribble";

const INTENT_LABEL: Record<Intent, string> = { Rent: "To rent", Buy: "To buy", Share: "To share" };

export default function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const published = usePublishedListings();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const results = useMemo(() => applyFilters(published, filters), [published, filters]);
  const activeCount = activeFilterCount(filters);

  const update = (patch: Partial<SearchFilters>) => {
    const next = { ...filters, ...patch };
    const query = filtersToQuery(next);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const clearAll = () => update({ intent: null, city: null, category: null, type: null, maxPrice: null, beds: null, furnished: false, verified: false });

  const chips: { label: string; clear: Partial<SearchFilters> }[] = [
    filters.intent && { label: INTENT_LABEL[filters.intent], clear: { intent: null, maxPrice: null } },
    filters.city && { label: filters.city, clear: { city: null } },
    filters.category && !filters.type && { label: filters.category, clear: { category: null } },
    filters.type && { label: filters.type, clear: { type: null } },
    filters.maxPrice && { label: `Up to ${formatEUR(filters.maxPrice)}`, clear: { maxPrice: null } },
    filters.beds && { label: `${filters.beds}+ bedrooms`, clear: { beds: null } },
    filters.furnished && { label: "Furnished", clear: { furnished: false } },
    filters.verified && { label: "Verified only", clear: { verified: false } },
  ].filter(Boolean) as { label: string; clear: Partial<SearchFilters> }[];

  const headingLead = [filters.type ?? (filters.category ? `${filters.category} properties` : "Properties"), filters.intent ? INTENT_LABEL[filters.intent].toLowerCase() : null, "in"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="flex flex-col gap-2">
        <ScriptNote className="mb-1 -rotate-2 text-2xl text-steel">Verified homes. Safer stays.</ScriptNote>
        <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-[-0.035em] text-navy sm:text-5xl">
          {headingLead} <Highlight>{filters.city ?? "Germany"}</Highlight>
        </h1>
        <p className="text-slate-600" aria-live="polite">
          <span className="font-semibold text-navy">{results.length}</span> {results.length === 1 ? "property" : "properties"} match your search
        </p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="search-filters"
            className="flex h-11 w-full items-center justify-between rounded-btn border border-line bg-white px-4 font-semibold text-navy lg:hidden"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-sun px-1.5 text-xs text-navy">{activeCount}</span>}
            </span>
            <ChevronDown className={`h-4 w-4 transition ${filtersOpen ? "rotate-180" : ""}`} />
          </button>

          <div
            id="search-filters"
            className={`${filtersOpen ? "mt-3 block" : "hidden"} space-y-5 rounded-[16px] border border-line/80 bg-white p-5 shadow-card lg:sticky lg:top-24 lg:mt-0 lg:block`}
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-bold text-navy">Filters</p>
              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="text-sm font-medium text-steel underline-offset-2 hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <div>
              <Label>Looking to</Label>
              <div className="grid grid-cols-4 gap-1 rounded-btn bg-sand p-1">
                {[null, ...INTENTS].map((i) => (
                  <button
                    key={i ?? "any"}
                    type="button"
                    aria-pressed={filters.intent === i}
                    onClick={() => update({ intent: i, maxPrice: null })}
                    className={`h-8 rounded-[7px] text-sm font-medium transition ${filters.intent === i ? "bg-white text-navy shadow-sm" : "text-slate-600 hover:text-navy"}`}
                  >
                    {i ?? "Any"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="f-city">City</Label>
              <Select id="f-city" value={filters.city ?? ""} onChange={(e) => update({ city: (e.target.value || null) as City | null })}>
                <option value="">All cities</option>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="f-category">Category</Label>
              <Select
                id="f-category"
                value={filters.category ?? ""}
                onChange={(e) => update({ category: (e.target.value || null) as Category | null, type: null, beds: e.target.value === "Commercial" ? null : filters.beds })}
              >
                <option value="">Residential and commercial</option>
                <option>Residential</option>
                <option>Commercial</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="f-type">Property type</Label>
              <Select id="f-type" value={filters.type ?? ""} onChange={(e) => update({ type: (e.target.value || null) as PropertyType | null })}>
                <option value="">Any type</option>
                {typesForCategory(filters.category).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="f-price">Max price</Label>
              <Select id="f-price" value={filters.maxPrice ?? ""} onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : null })}>
                <option value="">No limit</option>
                {budgetOptions(filters.intent).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>

            {filters.category !== "Commercial" && (
              <div>
                <Label>Bedrooms</Label>
                <div className="grid grid-cols-5 gap-1 rounded-btn bg-sand p-1">
                  {[null, ...BED_OPTIONS].map((b) => (
                    <button
                      key={b ?? "any"}
                      type="button"
                      aria-pressed={filters.beds === b}
                      onClick={() => update({ beds: b })}
                      className={`h-8 rounded-[7px] text-sm font-medium transition ${filters.beds === b ? "bg-white text-navy shadow-sm" : "text-slate-600 hover:text-navy"}`}
                    >
                      {b ? `${b}+` : "Any"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 border-t border-line pt-5">
              <Checkbox label="Furnished only" checked={filters.furnished} onChange={(e) => update({ furnished: e.target.checked })} />
              <Checkbox label="Verified publishers only" checked={filters.verified} onChange={(e) => update({ verified: e.target.checked })} />
            </div>

            <Button variant="navy" className="w-full lg:hidden" onClick={() => setFiltersOpen(false)}>
              Show {results.length} {results.length === 1 ? "result" : "results"}
            </Button>
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-h-9 flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => update(chip.clear)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-btn bg-sand pl-3 pr-2 text-sm font-medium text-navy hover:bg-line"
                >
                  {chip.label}
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Select aria-label="Sort results" value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className="w-full sm:w-52">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
              <div className="flex h-11 shrink-0 rounded-btn border border-line bg-white p-1" role="group" aria-label="View">
                {(["list", "map"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={filters.view === mode}
                    onClick={() => update({ view: mode })}
                    className={`flex items-center gap-1.5 rounded-[7px] px-3 text-sm font-medium transition ${filters.view === mode ? "bg-navy text-white" : "text-slate-600 hover:text-navy"}`}
                  >
                    {mode === "list" ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
                    {mode === "list" ? "List" : "Map"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            {results.length === 0 ? (
              <div className="flex flex-col items-center rounded-card border border-dashed border-slate-300 px-6 py-16 text-center">
                <SearchX className="h-10 w-10 text-slate-400" strokeWidth={1.6} />
                <h2 className="mt-4 text-2xl font-bold text-navy">No properties match these filters</h2>
                <p className="mt-2 max-w-md text-slate-600">
                  Try removing a filter or widening your budget. New listings are approved every day.
                </p>
                <Button variant="primary" className="mt-6" onClick={clearAll}>
                  Clear all filters
                </Button>
              </div>
            ) : filters.view === "map" ? (
              <PropertyMap properties={results} className="h-[70vh] min-h-[420px]" />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p, i) => (
                  <PropertyCard key={p.id} property={p} eager={i < 3} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
