"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { formatPrice, type Property } from "@/data/properties";

export interface PropertyMapProps {
  properties: Property[];
  className?: string;
  /** Show a ~400m circle around the listing instead of an exact pin (detail page privacy). */
  approximate?: boolean;
}

const GERMANY_CENTER: [number, number] = [51.1657, 10.4515];

// Leaflet's default marker images don't resolve through the bundler, so draw a price pin instead.
const priceIcon = (label: string) =>
  L.divIcon({
    className: "",
    html: `<span style="display:inline-block;transform:translate(-50%,-100%);white-space:nowrap;background:#0B1F3A;color:#fff;font:600 12px/1 var(--font-figtree),sans-serif;padding:6px 8px;border-radius:8px;box-shadow:0 4px 12px rgb(11 31 58/.3);border:2px solid #fff">${label}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -30],
  });

const shortPrice = (p: Property) =>
  p.price >= 1_000_000 ? `€${(p.price / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M` : p.price >= 10_000 ? `€${Math.round(p.price / 1000)}k` : `€${p.price.toLocaleString("de-DE")}`;

function FitBounds({ properties, approximate }: { properties: Property[]; approximate: boolean }) {
  const map = useMap();
  useEffect(() => {
    const fit = () => {
      // The container can still be unsized when the lazily loaded map mounts, which makes
      // fitBounds jump to max zoom. Re-measure first, and refit if the container resizes.
      map.invalidateSize();
      if (properties.length === 0) {
        map.setView(GERMANY_CENTER, 6);
      } else if (properties.length === 1) {
        map.setView([properties[0].lat, properties[0].lng], approximate ? 14 : 13);
      } else {
        map.fitBounds(L.latLngBounds(properties.map((p) => [p.lat, p.lng])), { padding: [48, 48], maxZoom: 13 });
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map, properties, approximate]);
  return null;
}

export default function PropertyMap({ properties, className = "h-96", approximate = false }: PropertyMapProps) {
  return (
    <div className={`relative isolate overflow-hidden rounded-card border border-line ${className}`}>
      <MapContainer center={GERMANY_CENTER} zoom={6} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds properties={properties} approximate={approximate} />
        {approximate
          ? properties.map((p) => (
              <Circle
                key={p.id}
                center={[p.lat, p.lng]}
                radius={400}
                pathOptions={{ color: "#0B1F3A", weight: 2, fillColor: "#F2B705", fillOpacity: 0.25 }}
              />
            ))
          : properties.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={priceIcon(shortPrice(p))}>
                <Popup>
                  <Link href={`/property/${p.id}`} className="block w-52 text-navy! no-underline">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt="" className="mb-2 h-28 w-full rounded-lg object-cover" />
                    <span className="block text-sm font-semibold leading-snug">{p.title}</span>
                    <span className="block text-xs text-slate-500">
                      {p.locality}, {p.city}
                    </span>
                    <span className="mt-1 block text-sm font-bold">{formatPrice(p)}</span>
                  </Link>
                </Popup>
              </Marker>
            ))}
      </MapContainer>
    </div>
  );
}
