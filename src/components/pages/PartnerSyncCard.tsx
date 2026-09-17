import { BedDouble, Check, Clock, MapPin, RefreshCw, Ruler } from "lucide-react";
import Photo from "@/components/ui/Photo";
import { IntentBadge, StatusBadge } from "@/components/ui/Badge";
import { ScriptNote } from "@/components/ui/Scribble";
import { formatEUR, imagesFor } from "@/data/properties";

const CHECKS = [
  { label: "Fields mapped", done: true },
  { label: "Photos imported", done: true },
  { label: "Manual review", done: false },
];

/** Illustration for the partner hero: how a listing looks after arriving through a partner feed. */
export default function PartnerSyncCard() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <ScriptNote className="absolute -top-9 right-2 hidden -rotate-3 text-2xl text-steel sm:block">Straight from your feed</ScriptNote>

      <div className="rounded-[20px] border border-line/80 bg-white p-4 shadow-float sm:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand text-navy">
              <RefreshCw className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy">Sample partner feed</p>
              <p className="text-xs text-slate-500">OpenImmo XML · hourly sync</p>
            </div>
          </div>
          <span className="shrink-0 text-xs text-slate-500">Just now</span>
        </div>

        <article className="mt-4 rounded-[16px] border border-line/80 bg-white p-2 shadow-card">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-sand">
            <Photo src={imagesFor("2BHK", 0)[0]} alt="Sample synced listing" className="h-full w-full" />
            <IntentBadge intent="Rent" className="absolute left-3 top-3 shadow-card" />
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-steel px-2.5 py-1 text-xs font-semibold text-white shadow-card">
              <RefreshCw className="h-3 w-3" /> Synced from partner feed
            </span>
          </div>
          <div className="px-3 pb-3 pt-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-[22px] font-bold leading-none tracking-tight text-navy">
                {formatEUR(1850)}
                <span className="ml-1 font-sans text-sm font-medium tracking-normal text-slate-500">/ month</span>
              </p>
              <StatusBadge status="Pending" label="Pending review" />
            </div>
            <h3 className="mt-2.5 font-sans text-base font-semibold leading-snug tracking-normal text-navy">2BHK with balcony</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Prenzlauer Berg, Berlin
            </p>
            <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-700">
              <li className="font-medium">2BHK</li>
              <li className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-slate-400" />2 beds
              </li>
              <li className="flex items-center gap-1.5">
                <Ruler className="h-4 w-4 text-slate-400" />78 m²
              </li>
            </ul>
          </div>
        </article>

        <ul className="mt-4 grid grid-cols-3 gap-2">
          {CHECKS.map(({ label, done }) => (
            <li
              key={label}
              className={`flex items-center justify-center gap-1.5 rounded-btn px-2 py-2 text-center text-xs font-medium ${
                done ? "bg-verified-soft text-[#0b7a6e]" : "bg-sun-soft text-[#8a6400]"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} /> : <Clock className="h-3.5 w-3.5 shrink-0" />}
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
