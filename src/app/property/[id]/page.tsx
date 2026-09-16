import type { Metadata } from "next";
import PropertyDetail from "@/components/property/PropertyDetail";
import { NEW_LISTING_SLOTS, formatPrice, properties } from "@/data/properties";

// Static export: only the seed listings and the reserved slots for demo-created listings exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...properties.map((p) => ({ id: p.id })), ...NEW_LISTING_SLOTS.map((id) => ({ id }))];
}

export async function generateMetadata({ params }: PageProps<"/property/[id]">): Promise<Metadata> {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);
  if (!property) {
    return { title: "New listing", description: "A newly submitted property on UFT Living Germany.", robots: { index: false } };
  }
  if (property.status !== "Published") {
    return { title: "Listing not available", description: "This property is not currently listed on UFT Living Germany.", robots: { index: false } };
  }
  return {
    title: `${property.title}, ${property.city}`,
    description: `${property.type} ${property.intent === "Buy" ? "for sale" : property.intent === "Share" ? "to share" : "to rent"} in ${property.locality}, ${property.city} for ${formatPrice(property)}. ${property.description}`,
    openGraph: { images: [property.images[0]] },
  };
}

export default async function PropertyPage({ params }: PageProps<"/property/[id]">) {
  const { id } = await params;
  return <PropertyDetail id={id} />;
}
