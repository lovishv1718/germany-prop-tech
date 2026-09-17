import type { Metadata } from "next";
import { Suspense } from "react";
import SubscriptionsClient from "@/components/pages/SubscriptionsClient";

export const metadata: Metadata = {
  title: "WhatsApp property alerts",
  description:
    "Get new verified listings in Berlin, Munich, Hamburg, Frankfurt, Cologne and Stuttgart on WhatsApp the moment they go live. Monthly or quarterly plans.",
};

export default function SubscriptionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold text-navy sm:text-6xl">Hear about new places first</h1>
        <p className="mt-5 text-lg text-slate-600 sm:text-xl">
          Tell us what you are looking for. We send matching listings to WhatsApp within a minute of approval.
        </p>
      </div>
      <Suspense fallback={<div className="h-[640px] animate-pulse rounded-card bg-sand" />}>
        <SubscriptionsClient />
      </Suspense>
    </div>
  );
}
