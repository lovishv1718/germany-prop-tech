import type { Metadata } from "next";
import { Suspense } from "react";
import SubscriptionsClient from "@/components/pages/SubscriptionsClient";
import PageIntro from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "WhatsApp property alerts",
  description:
    "Get new verified listings in Berlin, Munich, Hamburg, Frankfurt, Cologne and Stuttgart on WhatsApp the moment they go live. Monthly or quarterly plans.",
};

export default function SubscriptionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <PageIntro
        className="mb-10"
        note="WhatsApp alerts"
        lead="Hear about new places"
        highlight="first"
        description="Tell us what you are looking for. We send matching listings to WhatsApp within a minute of approval."
      />
      <Suspense fallback={<div className="h-[640px] animate-pulse rounded-card bg-sand" />}>
        <SubscriptionsClient />
      </Suspense>
    </div>
  );
}
