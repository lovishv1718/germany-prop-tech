import Link from "next/link";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/property-types", label: "Property Types" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/partner", label: "Partner With Us" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="UFT Living Germany home">
      <span
        className={`grid h-9 w-9 place-items-center rounded-[9px] font-display text-[15px] font-extrabold tracking-tight ${
          light ? "bg-sun text-navy" : "bg-navy text-sun"
        }`}
      >
        U
      </span>
      <span className={`font-display text-[17px] font-bold leading-none tracking-tight ${light ? "text-white" : "text-navy"}`}>
        UFT Living
        <span className={`block text-[12px] font-medium tracking-normal ${light ? "text-white/60" : "text-slate-500"}`}>
          Germany
        </span>
      </span>
    </Link>
  );
}
