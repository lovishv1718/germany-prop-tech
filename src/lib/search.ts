import {
  CITIES,
  COMMERCIAL_TYPES,
  INTENTS,
  PROPERTY_TYPES,
  RESIDENTIAL_TYPES,
  categoryOf,
  formatEUR,
  type Category,
  type City,
  type Intent,
  type Property,
  type PropertyType,
} from "@/data/properties";

export type SortKey = "newest" | "price-asc" | "price-desc";
export type ViewMode = "list" | "map";

export interface SearchFilters {
  intent: Intent | null;
  city: City | null;
  category: Category | null;
  type: PropertyType | null;
  maxPrice: number | null;
  beds: number | null;
  furnished: boolean;
  verified: boolean;
  sort: SortKey;
  view: ViewMode;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const BED_OPTIONS = [1, 2, 3, 4];

const oneOf = <T extends string>(value: string | null, allowed: readonly T[]): T | null =>
  value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null;

const positiveInt = (value: string | null): number | null => {
  const n = Number(value);
  return value !== null && Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

export function parseFilters(params: URLSearchParams): SearchFilters {
  const type = oneOf(params.get("type"), PROPERTY_TYPES);
  return {
    intent: oneOf(params.get("intent"), INTENTS),
    city: oneOf(params.get("city"), CITIES),
    // A specific type implies its category, so the two can never contradict each other.
    category: type ? categoryOf(type) : oneOf(params.get("category"), ["Residential", "Commercial"] as const),
    type,
    maxPrice: positiveInt(params.get("maxPrice")),
    beds: positiveInt(params.get("beds")),
    furnished: params.get("furnished") === "1",
    verified: params.get("verified") === "1",
    sort: oneOf(params.get("sort"), ["newest", "price-asc", "price-desc"] as const) ?? "newest",
    view: params.get("view") === "map" ? "map" : "list",
  };
}

export function filtersToQuery(f: Partial<SearchFilters>): string {
  const q = new URLSearchParams();
  if (f.intent) q.set("intent", f.intent);
  if (f.city) q.set("city", f.city);
  if (f.category && !f.type) q.set("category", f.category);
  if (f.type) q.set("type", f.type);
  if (f.maxPrice) q.set("maxPrice", String(f.maxPrice));
  if (f.beds) q.set("beds", String(f.beds));
  if (f.furnished) q.set("furnished", "1");
  if (f.verified) q.set("verified", "1");
  if (f.sort && f.sort !== "newest") q.set("sort", f.sort);
  if (f.view === "map") q.set("view", "map");
  return q.toString();
}

export function applyFilters(listings: Property[], f: SearchFilters): Property[] {
  const results = listings.filter(
    (p) =>
      (!f.intent || p.intent === f.intent) &&
      (!f.city || p.city === f.city) &&
      (!f.category || categoryOf(p.type) === f.category) &&
      (!f.type || p.type === f.type) &&
      (!f.maxPrice || p.price <= f.maxPrice) &&
      (!f.beds || p.bedrooms >= f.beds) &&
      (!f.furnished || p.furnished) &&
      (!f.verified || p.verified),
  );
  return results.sort((a, b) => {
    if (f.sort === "price-asc") return a.price - b.price;
    if (f.sort === "price-desc") return b.price - a.price;
    return b.listedAt.localeCompare(a.listedAt);
  });
}

/** Count of filters the user has narrowed by (excludes sort and view). */
export function activeFilterCount(f: SearchFilters): number {
  return [f.intent, f.city, f.category, f.type, f.maxPrice, f.beds, f.furnished || null, f.verified || null].filter(Boolean)
    .length;
}

const RENT_BUDGETS = [500, 750, 1000, 1500, 2000, 3000, 5000, 10000, 15000];
const BUY_BUDGETS = [300000, 500000, 750000, 1000000, 1500000, 2000000, 2500000];

export function budgetOptions(intent: Intent | null): { value: number; label: string }[] {
  const values = intent === "Buy" ? BUY_BUDGETS : intent ? RENT_BUDGETS : [...RENT_BUDGETS, ...BUY_BUDGETS];
  return values.map((value) => ({
    value,
    label: `Up to ${formatEUR(value)}${intent && intent !== "Buy" ? " / month" : ""}`,
  }));
}

export function typesForCategory(category: Category | null): PropertyType[] {
  return category === "Commercial" ? COMMERCIAL_TYPES : category === "Residential" ? RESIDENTIAL_TYPES : PROPERTY_TYPES;
}
