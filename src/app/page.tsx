import type { Metadata } from "next";
import { BadgeCheck, Building2, ClipboardCheck, Flag, Handshake, KeyRound, LockKeyhole, Search, ShieldCheck, UserRound } from "lucide-react";
import HeroSearch from "@/components/home/HeroSearch";
import {
  AlertsCta,
  LiveListingCount,
  PopularCities,
  PropertyTypeGrid,
  SectionHeading,
  VerifiedThisWeek,
} from "@/components/home/HomeSections";
import Photo from "@/components/ui/Photo";
import { HERO_IMAGE } from "@/data/properties";

export const metadata: Metadata = {
  title: { absolute: "UFT Living Germany | Find your next place in Germany" },
  description:
    "Rent, buy or share verified apartments, houses, rooms and commercial spaces in Berlin, Munich, Hamburg, Frankfurt, Cologne and Stuttgart.",
};

const AUDIENCES = [
  {
    icon: Search,
    title: "Tenants",
    steps: ["Search verified listings by city, type and budget", "Unlock the publisher's contact for €4.99", "Enquire, view and move in"],
  },
  {
    icon: KeyRound,
    title: "Landlords",
    steps: ["List your property in five short steps", "We verify ownership before it goes live", "Answer enquiries from one dashboard"],
  },
  {
    icon: Building2,
    title: "Agents",
    steps: ["Publish your full portfolio with photos", "Track views and enquiries per listing", "Feature listings when you need reach"],
  },
  {
    icon: Handshake,
    title: "Partners",
    steps: ["Connect by REST API or OpenImmo feed", "Listings sync automatically every hour", "Earn attribution on every conversion"],
  },
];

const TRUST = [
  {
    icon: BadgeCheck,
    title: "Verified publishers",
    text: "Landlords and agents confirm their identity and right to let or sell before we mark them verified.",
  },
  {
    icon: ClipboardCheck,
    title: "Manual review",
    text: "Every new listing is checked by our team for accurate photos, pricing and address details.",
  },
  {
    icon: Flag,
    title: "Report a listing",
    text: "Something looks wrong? Report it in two clicks and we respond within 24 hours.",
  },
  {
    icon: LockKeyhole,
    title: "GDPR compliant",
    text: "Your data stays in the EU. Contact details are only shared when you choose to unlock them.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit items-center gap-2 rounded-md bg-verified-soft px-2.5 py-1 text-sm font-medium text-[#0b7a6e]">
              <ShieldCheck className="h-4 w-4 text-verified" />
              <span>
                <LiveListingCount /> verified listings live today
              </span>
            </p>
            <h1 className="mt-5 text-[44px] font-extrabold leading-[1.02] text-navy sm:text-6xl lg:text-[76px]">
              Find your next place in Germany
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600 sm:text-xl">
              Apartments, houses, rooms and commercial spaces from verified landlords, agents and flatmates in six cities.
            </p>
          </div>
          <div className="relative hidden lg:block">
            <Photo src={HERO_IMAGE} alt="Bright living room in a Berlin apartment" eager className="h-full max-h-[440px] w-full rounded-card" />
            <div className="absolute -left-6 bottom-8 flex items-center gap-3 rounded-card bg-white px-4 py-3 shadow-lift">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-sun text-navy">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">Katrin H., landlord in Berlin</p>
                <p className="text-sm text-slate-500">Found a tenant in 6 days</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 lg:-mt-4">
            <HeroSearch />
          </div>
        </div>
      </section>

      <VerifiedThisWeek />
      <PropertyTypeGrid />
      <PopularCities />

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading title="How it works" description="One marketplace, built for everyone involved in finding a place." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map(({ icon: Icon, title, steps }) => (
              <div key={title} className="rounded-card border border-line p-6">
                <span className="grid h-11 w-11 place-items-center rounded-btn bg-sand text-navy">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-navy">{title}</h3>
                <ol className="mt-4 space-y-3">
                  {steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-[15px] leading-snug text-slate-600">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy text-xs font-semibold text-white">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-20">
        <AlertsCta />
      </div>

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading title="Built on trust" description="Renting and buying involves real money. We take that seriously." />
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className={`h-7 w-7 ${title === "Verified publishers" ? "text-verified" : "text-navy"}`} strokeWidth={1.8} />
                <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
