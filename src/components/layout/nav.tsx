import Link from "next/link";
import { Building2 } from "lucide-react";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/property-types", label: "Property Types" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/partner", label: "Partner With Us" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="UFT Living Germany home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white shadow-soft">
        <Building2 className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-navy"}`}>
        UFT Living <span className="text-accent">Germany</span>
      </span>
    </Link>
  );
}
