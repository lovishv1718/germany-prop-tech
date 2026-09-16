"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useApp, dashboardPath } from "@/context/AppContext";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { Logo, NAV_LINKS } from "./nav";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useApp();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const signedIn = role !== "Guest";

  const signOut = () => {
    setRole("Guest");
    setOpen(false);
    router.push("/");
  };

  return (
    <>
      <div className="bg-navy-950 text-white/80">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs sm:px-6 sm:text-[13px] lg:px-8">
          Interactive prototype built for UFT Living Germany by <span className="font-semibold text-sun">RareDigital</span>
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative rounded-btn px-3.5 py-2 text-[15px] font-medium transition-colors ${
                  isActive(link.href) ? "text-navy" : "text-slate-600 hover:text-navy"
                }`}
              >
                {link.label}
                {isActive(link.href) && <span className="absolute inset-x-3.5 -bottom-[15px] h-0.5 rounded-full bg-sun" />}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {signedIn ? (
              <>
                <ButtonLink href={dashboardPath(role)} variant="navy" size="sm">
                  <LayoutDashboard className="h-4 w-4" />
                  {role} dashboard
                </ButtonLink>
                <button type="button" onClick={signOut} className={buttonClass("ghost", "sm")} aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <ButtonLink href="/login" variant="primary" size="sm" className="px-5">
                Login
              </ButtonLink>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-btn text-navy hover:bg-sand lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav
            className="border-t border-line bg-white px-4 pb-5 pt-2 lg:hidden"
            aria-label="Mobile"
            onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-btn px-3 py-3 text-base font-medium ${
                  isActive(link.href) ? "bg-sand text-navy" : "text-slate-700 hover:bg-sand"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-2">
              {signedIn ? (
                <>
                  <ButtonLink href={dashboardPath(role)} variant="navy">
                    <LayoutDashboard className="h-4 w-4" />
                    {role} dashboard
                  </ButtonLink>
                  <button type="button" onClick={signOut} className={buttonClass("outline")}>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <ButtonLink href="/login">Login</ButtonLink>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
