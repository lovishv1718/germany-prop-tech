"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
] as const;

/** German flag drawn in CSS (no emoji, no image), marking the market the site serves. */
function GermanFlag() {
  return (
    <span className="flex h-4 w-4 shrink-0 flex-col overflow-hidden rounded-full ring-1 ring-black/10" aria-hidden="true">
      <span className="flex-1 bg-black" />
      <span className="flex-1 bg-[#DD0000]" />
      <span className="flex-1 bg-[#FFCE00]" />
    </span>
  );
}

export default function LanguageSwitcher() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Language: English"
        className="flex h-10 items-center gap-2 rounded-btn border border-line bg-white px-3 text-sm font-medium text-navy transition hover:border-slate-300"
      >
        <GermanFlag />
        EN
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-44 animate-pop-in rounded-card border border-line bg-white p-1.5 shadow-float">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setOpen(false);
                if (lang.code === "DE") toast("Deutsche Version folgt in Kürze. The German version is coming soon.", "info");
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-navy hover:bg-sand"
            >
              <span className="w-6 text-xs font-semibold text-slate-400">{lang.code}</span>
              <span className="flex-1">{lang.label}</span>
              {lang.code === "EN" && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
