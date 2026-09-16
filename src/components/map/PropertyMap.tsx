"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { formatPrice, type Property } from "@/data/properties";

export interface PropertyMapProps {
  properties: Property[];
  className?: string;
  /** Used when there are no properties to fit; defaults to the centre of Germany. */
  center?: [number, number];
  zoom?: number;
}

// Leaflet's default marker images don't resolve through the bundler, so use a styled div icon.
const pinIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:28px;height:28px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:#14B8A6;border:3px solid #fff;box-shadow:0 4px 12px rgb(11 31 58 / .35)"></span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap();
  useEffect(() => {
    if (properties.length === 0) return;
    const fit = () => {
      // The container can still be unsized when the lazily loaded map mounts, which makes
      // fitBounds jump to max zoom. Re-measure first, and refit if the container resizes.
      map.invalidateSize();
      if (properties.length === 1) {
        map.setView([properties[0].lat, properties[0].lng], 14);
      } else {
        map.fitBounds(L.latLngBounds(properties.map((p) => [p.lat, p.lng])), { padding: [40, 40], maxZoom: 14 });
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map, properties]);
  return null;
}

export default function PropertyMap({ properties, className = "h-96", center = [51.1657, 10.4515], zoom = 6 }: PropertyMapProps) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-100 shadow-soft ${className}`}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds properties={properties} />
        {properties.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon}>
            <Popup>
              <div className="w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
                <p className="m-0! text-sm font-semibold text-navy">{p.title}</p>
                <p className="m-0! text-xs text-slate-500">
                  {p.locality}, {p.city}
                </p>
                <p className="m-0! mt-1! text-sm font-bold text-accent-dark">{formatPrice(p)}</p>
                <Link href={`/search?city=${p.city}`} className="text-xs font-medium text-navy underline">
                  More in {p.city}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
