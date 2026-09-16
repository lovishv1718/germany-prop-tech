import { ArrowLeft, Check, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

interface ComingSoonProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  planned: string[];
  children?: React.ReactNode;
}

/** Placeholder shell for sections not yet built in the prototype. */
export default function ComingSoon({ icon: Icon, eyebrow, title, description, planned, children }: ComingSoonProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-3xl">
        <p className="flex items-center gap-2 text-sm font-semibold text-steel">
          <Icon className="h-4 w-4" /> {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-bold text-navy sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-slate-600">{description}</p>
      </div>
      {children && <div className="mt-10">{children}</div>}
      <div className="mt-10 rounded-card bg-sand p-6 sm:p-8">
        <p className="font-semibold text-navy">Coming in the next build</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {planned.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-slate-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <ButtonLink href="/" variant="ghost" className="mt-8 -ml-3">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </ButtonLink>
    </section>
  );
}
