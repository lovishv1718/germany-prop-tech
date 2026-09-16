"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import Photo from "@/components/ui/Photo";

function Lightbox({ images, index, onIndex, onClose, title }: { images: string[]; index: number; onIndex: (i: number) => void; onClose: () => void; title: string }) {
  const prev = useCallback(() => onIndex((index - 1 + images.length) % images.length), [index, images.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % images.length), [index, images.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex animate-fade-in flex-col bg-navy-950/95 text-white" role="dialog" aria-modal="true" aria-label={`${title} photos`}>
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-sm text-white/70">
          <span className="font-semibold text-white">
            {index + 1} / {images.length}
          </span>
          <span className="ml-3 hidden sm:inline">{title}</span>
        </p>
        <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-btn hover:bg-white/10" aria-label="Close photos">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={images[index]} src={images[index]} alt={`${title}, photo ${index + 1}`} className="max-h-full max-w-full animate-fade-in rounded-lg object-contain" />
        <button type="button" onClick={prev} className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:left-6" aria-label="Previous photo">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button type="button" onClick={next} className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:right-6" aria-label="Next photo">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => onIndex(i)}
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
            className={`h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition ${i === index ? "ring-sun" : "opacity-60 ring-transparent hover:opacity-100"}`}
          >
            <Photo src={src} alt="" className="h-full w-full" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const photos = images.length >= 4 ? images.slice(0, 4) : [...images, ...images, ...images, ...images].slice(0, 4);

  return (
    <>
      <div className="relative grid grid-cols-3 gap-2 sm:h-[460px] sm:grid-cols-4 sm:grid-rows-2">
        {photos.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
            className={`group overflow-hidden bg-sand ${
              i === 0
                ? "col-span-3 aspect-[4/3] rounded-card sm:col-span-2 sm:row-span-2 sm:aspect-auto"
                : i === 1
                  ? "aspect-square rounded-[10px] sm:col-span-2 sm:aspect-auto sm:rounded-card"
                  : "aspect-square rounded-[10px] sm:aspect-auto sm:rounded-card"
            }`}
          >
            <Photo src={src} alt={`${title}, photo ${i + 1}`} eager={i === 0} className="h-full w-full transition duration-500 group-hover:scale-[1.03]" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-2 rounded-btn bg-white px-3 text-sm font-semibold text-navy shadow-soft hover:bg-sand sm:bottom-4 sm:right-4"
        >
          <Images className="h-4 w-4" />
          View all {photos.length} photos
        </button>
      </div>
      {openIndex !== null && <Lightbox images={photos} index={openIndex} onIndex={setOpenIndex} onClose={() => setOpenIndex(null)} title={title} />}
    </>
  );
}
