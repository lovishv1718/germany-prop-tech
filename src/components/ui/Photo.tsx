"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** Plain <img> (static export, remote + data URLs) with a graceful fallback so a bad URL never shows a broken image. */
export default function Photo({ src, alt, className = "", eager = false }: PhotoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div className={`grid place-items-center bg-sand text-slate-400 ${className}`} role="img" aria-label={alt}>
        <ImageOff className="h-6 w-6" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  );
}
