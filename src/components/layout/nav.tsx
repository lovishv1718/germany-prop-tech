import Image from "next/image";
import Link from "next/link";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/property-types", label: "Property Types" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/partner", label: "Partner With Us" },
];

/** Brand logo. The light variant (navy ink swapped for white) is for dark backgrounds like the footer. */
export function Logo({ light = false, className = "h-10" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="UFT Living Germany home">
      <Image
        src={light ? "/brand/logo-light.png" : "/brand/logo.png"}
        alt="UFT Living Germany"
        width={671}
        height={160}
        priority={!light}
        className={`w-auto ${className}`}
      />
    </Link>
  );
}
