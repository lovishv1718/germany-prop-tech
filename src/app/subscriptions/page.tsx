import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Subscriptions | UFT Living Germany" };

export default function SubscriptionsPage() {
  return (
    <ComingSoon
      icon={CreditCard}
      eyebrow="Subscriptions"
      title="Plans for tenants and publishers"
      description="Simple monthly plans that unlock priority listings, verified badges and direct contact."
      planned={[
        "Plan comparison for tenants and publishers",
        "Monthly and yearly billing toggle",
        "Mock checkout flow (no real payments)",
        "Plan badge shown on your profile",
      ]}
    />
  );
}
