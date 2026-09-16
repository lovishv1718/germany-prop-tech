"use client";

import dynamic from "next/dynamic";
import type { PropertyMapProps } from "./PropertyMap";

// Leaflet touches `window` on import, so every map is client-only.
export const PropertyMap = dynamic<PropertyMapProps>(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />,
});
