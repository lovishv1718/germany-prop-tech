/** Hand-drawn accents used across headlines: a yellow brush underline, a sketched arrow and script notes. */

export function Swoosh({ className = "", color = "#F2B705" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" className={className}>
      <path d="M4 17C58 8 128 4 206 6c34 1 62 4 90 9" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/** Wraps a word with the brush underline, e.g. <Highlight>Germany</Highlight>. */
export function Highlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      <span className="relative z-10">{children}</span>
      <Swoosh className="absolute -bottom-[0.14em] left-[-2%] z-0 h-[0.3em] w-[104%]" />
    </span>
  );
}

export function SketchArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 34" fill="none" aria-hidden="true" className={className}>
      <path d="M60 9C44 2 22 5 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 21l1.5-10M7 21l10-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ScriptNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-script leading-[1.05] ${className}`}>{children}</p>;
}
