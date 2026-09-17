import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo, NAV_LINKS } from "./nav";
import { ScriptNote } from "@/components/ui/Scribble";
import { CITIES } from "@/data/properties";

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div className="max-w-sm space-y-5">
          <Logo light />
          <p className="text-[15px] leading-relaxed">
            Rent, buy and share verified homes and commercial spaces across Germany. Every publisher is checked
            before a listing goes live.
          </p>
          <ScriptNote className="-rotate-2 text-2xl text-sun">More than just a place. A new chapter.</ScriptNote>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">Explore</h3>
          <ul className="space-y-2.5 text-[15px]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-sun">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className="hover:text-sun">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">Cities</h3>
          <ul className="space-y-2.5 text-[15px]">
            {CITIES.map((city) => (
              <li key={city}>
                <Link href={`/search?city=${city}`} className="hover:text-sun">
                  {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">Contact</h3>
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sun" />
              Friedrichstraße 68, 10117 Berlin
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-sun" />
              +49 30 1234 5678
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-sun" />
              hello@ulivger.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 UFT Living Germany · ulivger.com</p>
          <p className="flex gap-5">
            <span>Impressum</span>
            <span>Privacy</span>
            <span>Terms</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
