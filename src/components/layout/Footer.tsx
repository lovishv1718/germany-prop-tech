import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Logo, NAV_LINKS } from "./nav";
import { CITIES } from "@/data/properties";

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed text-slate-400">
            Rent, buy and share verified properties across Germany. One trusted marketplace for tenants, owners,
            agents and partners.
          </p>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Verified listings, GDPR compliant
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Cities</h3>
          <ul className="space-y-2.5 text-sm">
            {CITIES.map((city) => (
              <li key={city}>
                <Link href={`/search?city=${city}`} className="hover:text-accent">
                  Properties in {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Friedrichstraße 68, 10117 Berlin
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              +49 30 1234 5678
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              hello@ulivger.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} UFT Living Germany · ulivger.com</p>
          <p className="flex gap-4">
            <span>Impressum</span>
            <span>Datenschutz</span>
            <span>AGB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
