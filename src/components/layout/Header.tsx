"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, UserRound, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Logo, NAV_LINKS } from "./nav";

export default function Header() {
  const pathname = usePathname();
  const { role } = useApp();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href) ? "bg-accent-soft text-accent-dark" : "text-slate-600 hover:bg-slate-50 hover:text-navy"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {role !== "Guest" && (
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
              Signed in as <span className="text-navy">{role}</span>
            </span>
          )}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-navy-light"
          >
            <UserRound className="h-4 w-4" />
            Login
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl text-navy hover:bg-slate-100 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-slate-100 bg-white px-4 pb-5 pt-2 shadow-soft lg:hidden"
          aria-label="Mobile"
          onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 text-base font-medium ${
                isActive(link.href) ? "bg-accent-soft text-accent-dark" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-base font-semibold text-white"
          >
            <UserRound className="h-4 w-4" />
            Login
          </Link>
        </nav>
      )}
    </header>
  );
}
