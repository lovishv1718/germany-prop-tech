import type { Metadata } from "next";
import TenantDashboard from "@/components/dashboard/TenantDashboard";

export const metadata: Metadata = {
  title: "Tenant dashboard",
  description: "Your saved properties, enquiries and unlocked publisher contacts on UFT Living Germany.",
};

export default function TenantDashboardPage() {
  return <TenantDashboard />;
}
