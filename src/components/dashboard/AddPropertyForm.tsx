"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Building, Check, ImagePlus, LayoutDashboard, Loader, MessageSquare, Plus, Sparkles, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  AMENITY_OPTIONS,
  CITIES,
  CITY_STATE,
  COMMERCIAL_TYPES,
  DISTRICTS,
  INTENTS,
  PROPERTY_TYPES,
  formatDate,
  formatEUR,
  imagesFor,
  type City,
  type Intent,
  type PricePeriod,
  type PropertyType,
} from "@/data/properties";
import { fileToDataUrl } from "@/lib/images";
import DashboardShell, { type DashNavItem } from "./DashboardShell";
import { Button } from "@/components/ui/Button";
import { Checkbox, Chip, FieldError, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { IntentBadge } from "@/components/ui/Badge";
import Photo from "@/components/ui/Photo";
import { useToast } from "@/components/ui/Toast";

const STEPS = ["Details", "Location", "Price and amenities", "Photos", "Review"];

interface FormState {
  title: string;
  intent: Intent;
  type: PropertyType;
  description: string;
  bedrooms: string;
  sizeSqm: string;
  furnished: boolean;
  city: City | "";
  locality: string;
  street: string;
  price: string;
  availableFrom: string;
  amenities: string[];
  images: string[];
  declaration: boolean;
}

const INITIAL: FormState = {
  title: "",
  intent: "Rent",
  type: "2BHK",
  description: "",
  bedrooms: "2",
  sizeSqm: "",
  furnished: false,
  city: "",
  locality: "",
  street: "",
  price: "",
  availableFrom: "2026-11-01",
  amenities: [],
  images: [],
  declaration: false,
};

const periodFor = (intent: Intent, type: PropertyType): PricePeriod =>
  intent === "Buy" ? "total" : type === "Event Hall" ? "day" : "month";

const PRICE_LABEL: Record<PricePeriod, string> = { month: "Monthly rent (EUR)", day: "Price per day (EUR)", total: "Sale price (EUR)" };

type Errors = Partial<Record<keyof FormState, string>>;

function validate(step: number, f: FormState): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (f.title.trim().length < 8) e.title = "Give the listing a descriptive title (at least 8 characters).";
    if (f.description.trim().length < 40) e.description = "Describe the property in at least 40 characters.";
    if (!(Number(f.sizeSqm) > 0)) e.sizeSqm = "Enter the size in square metres.";
    if (!COMMERCIAL_TYPES.includes(f.type) && f.type !== "Studio" && !(Number(f.bedrooms) >= 1)) e.bedrooms = "Enter the number of bedrooms.";
  }
  if (step === 1) {
    if (!f.city) e.city = "Choose a city.";
    if (!f.locality) e.locality = "Choose a district.";
  }
  if (step === 2) {
    if (!(Number(f.price) > 0)) e.price = "Enter a price.";
    if (!f.availableFrom) e.availableFrom = "Choose a date.";
  }
  if (step === 3 && f.images.length === 0) e.images = "Add at least one photo, or use the sample photos.";
  if (step === 4 && !f.declaration) e.declaration = "Please confirm the declaration to submit.";
  return e;
}

export default function AddPropertyForm() {
  const { addListing } = useApp();
  const toast = useToast();
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setF((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const residential = !COMMERCIAL_TYPES.includes(f.type);
  const period = periodFor(f.intent, f.type);
  const district = f.city ? DISTRICTS[f.city].find((d) => d.name === f.locality) : undefined;

  const next = () => {
    const e = validate(step, f);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).slice(0, 8).map((file) => fileToDataUrl(file)));
      setF((prev) => ({ ...prev, images: [...prev.images, ...urls].slice(0, 8) }));
      setErrors((prev) => ({ ...prev, images: undefined }));
    } catch {
      toast("One of those files could not be read as an image", "error");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const submit = () => {
    const e = validate(4, f);
    setErrors(e);
    if (Object.keys(e).length > 0 || !f.city || !district) return;
    addListing({
      title: f.title.trim(),
      description: f.description.trim(),
      intent: f.intent,
      type: f.type,
      city: f.city,
      state: CITY_STATE[f.city],
      locality: f.locality,
      price: Number(f.price),
      pricePeriod: period,
      bedrooms: residential && f.type !== "Studio" ? Number(f.bedrooms) : 0,
      sizeSqm: Number(f.sizeSqm),
      furnished: f.furnished,
      amenities: f.amenities.length ? f.amenities : ["Details on request"],
      availableFrom: f.availableFrom,
      // Small offset so the approximate-location circle doesn't sit exactly on the district centre.
      lat: district.lat + 0.004,
      lng: district.lng - 0.003,
      images: f.images,
      publisherType: "Landlord",
    });
    toast("Submitted for review. Switch to Admin to approve it.");
    router.push("/dashboard/publisher");
  };

  const nav: DashNavItem[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard/publisher" },
    { key: "properties", label: "My properties", icon: Building, href: "/dashboard/publisher" },
    { key: "enquiries", label: "Enquiries", icon: MessageSquare, href: "/dashboard/publisher" },
    { key: "add", label: "Add property", icon: Plus },
  ];

  return (
    <DashboardShell role="Publisher" nav={nav} active="add" title="Add a property" subtitle="Listings are reviewed by our team before they appear in search.">
      <ol className="mb-6 hidden grid-cols-5 gap-2 md:grid" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className="min-w-0">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-navy" : "bg-line"}`} />
            <p className={`mt-2 flex items-center gap-1.5 truncate text-sm ${i === step ? "font-semibold text-navy" : i < step ? "text-slate-600" : "text-slate-400"}`}>
              {i < step ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} /> : <span className="tabular-nums">{i + 1}.</span>}
              {label}
            </p>
          </li>
        ))}
      </ol>
      <div className="mb-5 md:hidden">
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-navy transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Step {step + 1} of {STEPS.length} · <span className="font-semibold text-navy">{STEPS[step]}</span>
        </p>
      </div>

      <div className="rounded-card border border-line bg-white p-5 sm:p-8">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <Label htmlFor="title">Listing title</Label>
              <Input id="title" value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Bright 2BHK with balcony near Mauerpark" />
              <FieldError>{errors.title}</FieldError>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Listing for</Label>
                <div className="grid grid-cols-3 gap-1 rounded-btn bg-sand p-1">
                  {INTENTS.map((i) => (
                    <button key={i} type="button" aria-pressed={f.intent === i} onClick={() => set("intent", i)} className={`h-9 rounded-[7px] text-sm font-medium transition ${f.intent === i ? "bg-white text-navy shadow-sm" : "text-slate-600 hover:text-navy"}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="type">Property type</Label>
                <Select id="type" value={f.type} onChange={(e) => set("type", e.target.value as PropertyType)}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={5} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the layout, condition, neighbourhood and transport links." />
              <div className="flex justify-between">
                <FieldError>{errors.description}</FieldError>
                <p className="ml-auto mt-1.5 text-xs text-slate-400">{f.description.trim().length} characters</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {residential && f.type !== "Studio" && (
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" min={1} max={12} value={f.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
                  <FieldError>{errors.bedrooms}</FieldError>
                </div>
              )}
              <div>
                <Label htmlFor="size">Size (m²)</Label>
                <Input id="size" type="number" min={1} value={f.sizeSqm} onChange={(e) => set("sizeSqm", e.target.value)} placeholder="72" />
                <FieldError>{errors.sizeSqm}</FieldError>
              </div>
              <div className="flex items-end pb-2.5">
                <Checkbox label="Furnished" checked={f.furnished} onChange={(e) => set("furnished", e.target.checked)} />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Select
                  id="city"
                  value={f.city}
                  onChange={(e) => {
                    set("city", e.target.value as City);
                    set("locality", "");
                  }}
                >
                  <option value="">Select a city</option>
                  {CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
                <FieldError>{errors.city}</FieldError>
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Select id="district" value={f.locality} disabled={!f.city} onChange={(e) => set("locality", e.target.value)}>
                  <option value="">{f.city ? "Select a district" : "Choose a city first"}</option>
                  {f.city &&
                    DISTRICTS[f.city].map((d) => (
                      <option key={d.name}>{d.name}</option>
                    ))}
                </Select>
                <FieldError>{errors.locality}</FieldError>
              </div>
            </div>
            <div>
              <Label htmlFor="street">Street and number (optional)</Label>
              <Input id="street" value={f.street} onChange={(e) => set("street", e.target.value)} placeholder="Street and house number" />
              <p className="mt-1.5 text-sm text-slate-500">Never shown publicly. Tenants see an approximate area on the map.</p>
            </div>
            {f.city && <p className="rounded-btn bg-sand px-4 py-3 text-sm text-slate-600">State: <span className="font-medium text-navy">{CITY_STATE[f.city]}</span></p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">{PRICE_LABEL[period]}</Label>
                <Input id="price" type="number" min={1} value={f.price} onChange={(e) => set("price", e.target.value)} placeholder={period === "total" ? "650000" : "1450"} />
                <FieldError>{errors.price}</FieldError>
              </div>
              <div>
                <Label htmlFor="available">{f.intent === "Buy" ? "Handover from" : "Available from"}</Label>
                <Input id="available" type="date" value={f.availableFrom} onChange={(e) => set("availableFrom", e.target.value)} />
                <FieldError>{errors.availableFrom}</FieldError>
              </div>
            </div>
            <div>
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((a) => (
                  <Chip key={a} selected={f.amenities.includes(a)} onClick={() => set("amenities", f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a])}>
                    {a}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input ref={fileInput} type="file" accept="image/*" multiple className="sr-only" id="photos" onChange={(e) => onFiles(e.target.files)} />
              <label htmlFor="photos" className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-slate-300 px-6 py-10 text-center transition hover:border-navy hover:bg-sand/50">
                {uploading ? <Loader className="h-8 w-8 animate-spin text-slate-400" /> : <ImagePlus className="h-8 w-8 text-slate-400" strokeWidth={1.6} />}
                <span className="mt-3 font-semibold text-navy">{uploading ? "Processing photos" : "Upload photos"}</span>
                <span className="mt-1 text-sm text-slate-500">JPG or PNG, up to 8 photos. 4 or more recommended.</span>
              </label>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">No photos to hand? Use professional sample photos for this demo.</p>
              <Button variant="outline" size="sm" onClick={() => set("images", imagesFor(f.type, Math.floor(Math.random() * 12)))}>
                <Sparkles className="h-4 w-4" /> Use sample photos
              </Button>
            </div>
            <FieldError>{errors.images}</FieldError>
            {f.images.length > 0 && (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {f.images.map((src, i) => (
                  <li key={`${src.slice(-24)}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-sand">
                    <Photo src={src} alt={`Photo ${i + 1}`} className="h-full w-full" />
                    {i === 0 && <span className="absolute left-2 top-2 rounded-md bg-navy px-2 py-0.5 text-xs font-semibold text-white">Cover</span>}
                    <button
                      type="button"
                      onClick={() => set("images", f.images.filter((_, j) => j !== i))}
                      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-navy shadow-soft hover:bg-sand"
                      aria-label={`Remove photo ${i + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              {f.images[0] && <Photo src={f.images[0]} alt="" className="aspect-[4/3] w-full shrink-0 rounded-card sm:w-56" />}
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <IntentBadge intent={f.intent} />
                  <span className="rounded-md bg-sand px-2 py-0.5 text-xs font-medium text-slate-700">{f.type}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-navy">{f.title}</h2>
                <p className="mt-1 text-slate-600">
                  {f.locality}, {f.city}
                </p>
                <p className="mt-3 font-display text-2xl font-bold text-navy">
                  {formatEUR(Number(f.price))} <span className="font-sans text-sm font-medium text-slate-500">{period === "month" ? "/ month" : period === "day" ? "/ day" : ""}</span>
                </p>
              </div>
            </div>
            <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
              {[
                ["Size", `${f.sizeSqm} m²`],
                ["Bedrooms", residential ? (f.type === "Studio" ? "Studio" : f.bedrooms) : "Not applicable"],
                ["Furnishing", f.furnished ? "Furnished" : "Unfurnished"],
                [f.intent === "Buy" ? "Handover" : "Available", formatDate(f.availableFrom)],
                ["Amenities", f.amenities.length ? f.amenities.join(", ") : "None selected"],
                ["Photos", `${f.images.length} added`],
              ].map(([k, v]) => (
                <div key={k} className="bg-white px-4 py-3">
                  <dt className="text-sm text-slate-500">{k}</dt>
                  <dd className="mt-0.5 font-medium text-navy">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="line-clamp-3 text-slate-600">{f.description}</p>
            <div className="rounded-card bg-sand p-4">
              <Checkbox
                checked={f.declaration}
                onChange={(e) => set("declaration", e.target.checked)}
                label="I confirm I am the owner or authorised to list this property, and that the details and photos are accurate."
                description="False listings are removed and may lead to account suspension."
              />
              <FieldError>{errors.declaration}</FieldError>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
          {step === 0 ? (
            <Link href="/dashboard/publisher" className="inline-flex h-11 items-center justify-center gap-2 rounded-btn px-4 font-semibold text-slate-600 hover:bg-sand hover:text-navy">
              Cancel
            </Link>
          ) : (
            <Button variant="outline" onClick={back}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button variant="navy" onClick={next} disabled={uploading}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="primary" onClick={submit}>
              <Check className="h-4 w-4" strokeWidth={3} /> Submit for review
            </Button>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
