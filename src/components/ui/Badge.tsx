import { BadgeCheck } from "lucide-react";
import type { Intent, ListingStatus } from "@/data/properties";

const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap";

const INTENT_STYLES: Record<Intent, string> = {
  Rent: "bg-sun text-navy",
  Buy: "bg-steel text-white",
  Share: "bg-white text-navy ring-1 ring-inset ring-navy/15",
};

const INTENT_LABEL: Record<Intent, string> = { Rent: "For rent", Buy: "For sale", Share: "Share" };

export function IntentBadge({ intent, className = "" }: { intent: Intent; className?: string }) {
  return <span className={`${base} ${INTENT_STYLES[intent]} ${className}`}>{INTENT_LABEL[intent]}</span>;
}

export function VerifiedBadge({ className = "", label = "Verified" }: { className?: string; label?: string }) {
  return (
    <span className={`${base} bg-verified-soft text-[#0b7a6e] ${className}`}>
      <BadgeCheck className="h-3.5 w-3.5 text-verified" strokeWidth={2.4} />
      {label}
    </span>
  );
}

const STATUS_STYLES: Record<ListingStatus | "Paused", string> = {
  Draft: "bg-slate-100 text-slate-600",
  Pending: "bg-sun-soft text-[#8a6400]",
  Published: "bg-steel-soft text-steel",
  Rejected: "bg-red-50 text-red-700",
  Paused: "bg-slate-100 text-slate-600",
};

export function StatusBadge({ status, label }: { status: ListingStatus | "Paused"; label?: string }) {
  return <span className={`${base} ${STATUS_STYLES[status]}`}>{label ?? status}</span>;
}

export function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`${base} bg-sand font-medium text-slate-700 ${className}`}>{children}</span>;
}
