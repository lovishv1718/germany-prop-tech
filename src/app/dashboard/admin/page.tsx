import type { Metadata } from "next";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Approve listings and monitor revenue, users, payments, WhatsApp alerts and partner integrations on UFT Living Germany.",
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
