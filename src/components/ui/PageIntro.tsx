import { Highlight, ScriptNote } from "./Scribble";

interface PageIntroProps {
  note?: string;
  /** Text before the highlighted word. */
  lead: string;
  highlight: string;
  /** Optional text after the highlighted word. */
  tail?: string;
  description?: React.ReactNode;
  className?: string;
  size?: "lg" | "md";
}

/** Page header in the hero style: handwritten note, extra-bold headline with a brush underline, and a lead paragraph. */
export default function PageIntro({ note, lead, highlight, tail, description, className = "", size = "lg" }: PageIntroProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {note && <ScriptNote className="mb-2 -rotate-2 text-2xl text-steel">{note}</ScriptNote>}
      <h1
        className={`font-extrabold tracking-[-0.035em] text-navy ${
          size === "lg" ? "text-[42px] leading-[1.02] sm:text-[64px]" : "text-[34px] leading-[1.05] sm:text-5xl"
        }`}
      >
        {lead} <Highlight>{highlight}</Highlight>
        {tail ? ` ${tail}` : null}
      </h1>
      {description && <p className="mt-5 text-lg leading-relaxed text-slate-600 sm:text-xl">{description}</p>}
    </div>
  );
}
