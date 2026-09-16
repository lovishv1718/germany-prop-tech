import type { Metadata } from "next";
import AddPropertyForm from "@/components/dashboard/AddPropertyForm";

export const metadata: Metadata = {
  title: "Add a property",
  description: "List a property on UFT Living Germany in five steps: details, location, price and amenities, photos and review.",
};

export default function AddPropertyPage() {
  return <AddPropertyForm />;
}
