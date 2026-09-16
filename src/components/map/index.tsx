"use client";

import dynamic from "next/dynamic";
import type { PropertyMapProps } from "./PropertyMap";

// Leaflet touches `window` on import, so every map is client-only.
export const PropertyMap = dynamic<PropertyMapProps>(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-full min-h-72 w-full animate-pulse rounded-card bg-sand" />,
});
