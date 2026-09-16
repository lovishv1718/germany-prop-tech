import Link from "next/link";
import { ArrowLeft, CheckCircle2, type LucideIcon } from "lucide-react";

interface ComingSoonProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  planned: string[];
  children?: React.ReactNode;
}

/** Placeholder shell for sections that are designed but not yet built in the prototype. */
export default function ComingSoon({ icon: Icon, eyebrow, title, description, planned, children }: ComingSoonProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-3xl">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent-dark">
          <Icon className="h-6 w-6" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-accent-dark">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg text-slate-600">{description}</p>
      </div>

      {children && <div className="mt-10">{children}</div>}

      <div className="mt-10 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 sm:p-8">
        <p className="text-sm font-semibold text-navy">Coming in the next build</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {planned.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
    </section>
  );
}
