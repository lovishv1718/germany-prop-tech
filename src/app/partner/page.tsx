import type { Metadata } from "next";
import { Handshake } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Partner With Us | UFT Living Germany" };

export default function PartnerPage() {
  return (
    <ComingSoon
      icon={Handshake}
      eyebrow="Partner With Us"
      title="Grow with Germany's trusted property marketplace"
      description="For agencies, developers, relocation services and referral partners."
      planned={[
        "Partner programme tiers and benefits",
        "Referral commission overview",
        "Partner application form",
        "Success stories from agencies and landlords",
      ]}
    />
  );
}
