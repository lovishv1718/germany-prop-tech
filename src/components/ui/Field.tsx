import type { ComponentProps } from "react";
import { Check, ChevronDown } from "lucide-react";

const control =
  "w-full rounded-btn border border-line bg-white px-3.5 text-[15px] text-navy placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-navy focus:outline-none focus:ring-2 focus:ring-sun/40 disabled:bg-sand";

export function Label({ children, htmlFor, className = "" }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={`mb-1.5 block text-sm font-medium text-slate-700 ${className}`}>
      {children}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-red-600">{children}</p>;
}

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input className={`${control} h-11 ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <textarea className={`${control} min-h-28 py-2.5 leading-relaxed ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }: ComponentProps<"select">) {
  return (
    <div className={`relative ${className}`}>
      <select className={`${control} h-11 cursor-pointer appearance-none pr-9`} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

export function Checkbox({ label, description, className = "", ...props }: ComponentProps<"input"> & { label: React.ReactNode; description?: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 ${className}`}>
      <span className="relative mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
        <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded-[5px] border border-slate-300 bg-white checked:border-navy checked:bg-navy" {...props} />
        <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      <span className="text-[15px] leading-snug text-slate-700">
        {label}
        {description && <span className="mt-0.5 block text-sm text-slate-500">{description}</span>}
      </span>
    </label>
  );
}

/** Pill-style toggle used for amenities, cities and similar multi-select chips. */
export function Chip({ selected, children, className = "", ...props }: ComponentProps<"button"> & { selected: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex h-9 items-center gap-1.5 rounded-btn border px-3 text-sm font-medium transition-colors ${
        selected ? "border-navy bg-navy text-white" : "border-line bg-white text-slate-700 hover:border-slate-300"
      } ${className}`}
      {...props}
    >
      {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      {children}
    </button>
  );
}
