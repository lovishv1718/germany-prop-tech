import type { Metadata } from "next";
import PublisherDashboard from "@/components/dashboard/PublisherDashboard";

export const metadata: Metadata = {
  title: "Publisher dashboard",
  description: "Manage your property listings, approval status and tenant enquiries on UFT Living Germany.",
};

export default function PublisherDashboardPage() {
  return <PublisherDashboard />;
}
