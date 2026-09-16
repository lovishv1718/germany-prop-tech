"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Eye, Home, RotateCcw, Shield, Sparkles, UserRound } from "lucide-react";
import { ROLES, useApp, type Role } from "@/context/AppContext";

const ROLE_META: Record<Role, { icon: typeof Eye; hint: string }> = {
  Guest: { icon: Eye, hint: "Browse without an account" },
  Tenant: { icon: UserRound, hint: "Save, enquire, book viewings" },
  Publisher: { icon: Home, hint: "List and manage properties" },
  Admin: { icon: Shield, hint: "Moderate listings and users" },
};

export default function RoleSwitcher() {
  const { role, setRole, resetDemo } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <div className="absolute bottom-14 right-0 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-lift">
          <p className="px-3 pb-2 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            View the demo as
          </p>
          {ROLES.map((r) => {
            const { icon: Icon, hint } = ROLE_META[r];
            const active = r === role;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  active ? "bg-accent-soft" : "hover:bg-slate-50"
                }`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    active ? "bg-accent text-white" : "bg-slate-100 text-navy"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-navy">{r}</span>
                  <span className="block truncate text-xs text-slate-500">{hint}</span>
                </span>
                {active && <Check className="h-4 w-4 text-accent-dark" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              resetDemo();
              setOpen(false);
            }}
            className="mt-1 flex w-full items-center gap-2 border-t border-slate-100 px-3 pb-1.5 pt-3 text-xs font-medium text-slate-500 hover:text-navy"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset demo data
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-navy py-2.5 pl-3 pr-4 text-sm font-medium text-white shadow-lift ring-1 ring-white/10 transition hover:bg-navy-light"
      >
        <Sparkles className="h-4 w-4 text-accent" />
        <span>Demo: switch role</span>
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold">{role}</span>
      </button>
    </div>
  );
}
