"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Eye, KeyRound, RotateCcw, Shield, UserRound, Repeat } from "lucide-react";
import { ROLES, useApp, type Role } from "@/context/AppContext";
import { useToast } from "@/components/ui/Toast";

const ROLE_META: Record<Role, { icon: typeof Eye; hint: string }> = {
  Guest: { icon: Eye, hint: "Browse without an account" },
  Tenant: { icon: UserRound, hint: "Save, enquire, unlock contacts" },
  Publisher: { icon: KeyRound, hint: "List and manage properties" },
  Admin: { icon: Shield, hint: "Approve listings, view revenue" },
};

export default function RoleSwitcher() {
  const { role, setRole, resetDemo } = useApp();
  const toast = useToast();
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
        <div className="absolute bottom-14 right-0 w-[min(18rem,calc(100vw-2rem))] animate-pop-in rounded-card border border-line bg-white p-2 shadow-lift">
          <p className="px-3 pb-2 pt-1.5 text-xs font-medium text-slate-500">View the prototype as</p>
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
                  toast(`Now viewing as ${r}`);
                }}
                className={`flex w-full items-center gap-3 rounded-btn px-3 py-2.5 text-left transition ${active ? "bg-sand" : "hover:bg-sand/70"}`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${active ? "bg-navy text-sun" : "bg-sand text-navy"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-navy">{r}</span>
                  <span className="block truncate text-xs text-slate-500">{hint}</span>
                </span>
                {active && <Check className="h-4 w-4 text-navy" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              resetDemo();
              setOpen(false);
              toast("Demo data reset");
            }}
            className="mt-1 flex w-full items-center gap-2 border-t border-line px-3 pb-1.5 pt-3 text-xs font-medium text-slate-500 hover:text-navy"
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
        className="flex items-center gap-2 rounded-full bg-navy py-2 pl-3.5 pr-2 text-sm font-medium text-white shadow-lift transition hover:bg-navy-800"
      >
        <Repeat className="h-4 w-4 text-sun" />
        <span className="hidden sm:inline">Demo: switch role</span>
        <span className="sm:hidden">Role</span>
        <span className="rounded-full bg-sun px-2.5 py-0.5 text-xs font-semibold text-navy">{role}</span>
      </button>
    </div>
  );
}
