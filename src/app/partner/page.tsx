import type { Metadata } from "next";
import { ArrowRight, Building2, Code, FileSpreadsheet, HardHat, Link2, Plane, UsersRound } from "lucide-react";
import PartnerForm from "@/components/pages/PartnerForm";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Partner with us",
  description:
    "Publish listings on UFT Living Germany through our REST API or OpenImmo and CSV feeds, with referral attribution and a dedicated partner manager.",
};

const STATS = [
  { value: "12.480", label: "Registered tenants and buyers" },
  { value: "6", label: "Major German cities" },
  { value: "42s", label: "Average alert delivery" },
  { value: "24h", label: "Listing review time" },
];

const PARTNER_TYPES = [
  { icon: Building2, title: "Agencies", text: "Sync your whole portfolio and receive qualified enquiries from verified tenants." },
  { icon: HardHat, title: "Developers", text: "Launch new-build projects with unit-level listings and pre-sale waiting lists." },
  { icon: Plane, title: "Relocation services", text: "Find furnished homes with Anmeldung for clients moving to Germany." },
  { icon: UsersRound, title: "Referral partners", text: "Refer landlords and earn commission on every listing that goes live." },
];

const API_SAMPLE = `POST /v1/listings
Authorization: Bearer sk_live_•••••••

{
  "external_id": "SPH-20931",
  "intent": "rent",
  "type": "2BHK",
  "city": "Berlin",
  "district": "Prenzlauer Berg",
  "price": { "amount": 1850, "period": "month" },
  "size_sqm": 78,
  "photos": ["https://cdn.partner.de/20931/1.jpg"]
}

201 Created  { "id": "ulg-4821", "status": "pending_review" }`;

export default function PartnerPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-[1.05] text-navy sm:text-6xl">Grow with Germany&apos;s verified property marketplace</h1>
            <p className="mt-5 text-lg text-slate-600 sm:text-xl">
              Connect your listings once and reach tenants, buyers and flatmates in six cities. Every enquiry comes from a signed-in, contactable person.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#apply" variant="primary" size="lg">
                Apply to partner <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="#integrations" variant="outline" size="lg">
                See integration options
              </ButtonLink>
            </div>
          </div>
          <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4">
            {STATS.map((s) => (
              <li key={s.label} className="bg-white px-5 py-6">
                <p className="font-display text-4xl font-bold tracking-tight text-navy">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="max-w-2xl text-3xl font-bold text-navy sm:text-4xl">Built for every kind of property business</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNER_TYPES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-card border border-line p-6">
              <Icon className="h-7 w-7 text-navy" strokeWidth={1.8} />
              <h3 className="mt-5 text-xl font-bold text-navy">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="integrations" className="scroll-mt-24 bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="max-w-2xl text-3xl font-bold text-navy sm:text-4xl">Three ways to connect</h2>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">Start with a CSV today and move to the API when you are ready. All methods support the same listing fields.</p>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="flex min-w-0 flex-col rounded-card bg-navy p-6 text-white sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-btn bg-white/10">
                  <Code className="h-5 w-5 text-sun" />
                </span>
                <h3 className="text-2xl font-bold">REST API</h3>
              </div>
              <p className="mt-3 text-white/70">Create, update and archive listings in real time. Webhooks tell you when a listing is approved, rejected or receives an enquiry.</p>
              <pre className="mt-6 overflow-x-auto rounded-[10px] bg-navy-950 p-4 font-mono text-[12.5px] leading-relaxed text-white/85">
                <code>{API_SAMPLE}</code>
              </pre>
            </div>

            <div className="grid gap-5">
              <div className="rounded-card bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-btn bg-sand">
                    <FileSpreadsheet className="h-5 w-5 text-navy" />
                  </span>
                  <h3 className="text-2xl font-bold text-navy">Feeds</h3>
                </div>
                <p className="mt-3 text-slate-600">
                  Point us at an OpenImmo XML or CSV feed. We sync every hour, match your photos and flag any listing that fails validation.
                </p>
              </div>
              <div className="rounded-card bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-btn bg-sand">
                    <Link2 className="h-5 w-5 text-navy" />
                  </span>
                  <h3 className="text-2xl font-bold text-navy">Attribution</h3>
                </div>
                <p className="mt-3 text-slate-600">
                  Referral links and UTM tracking credit you for every sign-up, contact unlock and subscription, with monthly commission statements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">Apply to become a partner</h2>
            <p className="mt-3 text-lg text-slate-600">Tell us a little about your business. We reply within 2 working days.</p>
            <ol className="mt-8 space-y-5">
              {[
                ["Intro call", "A 20-minute call with a partner manager to understand your portfolio."],
                ["Sandbox access", "API keys and a test environment, or a feed validation report."],
                ["Go live", "Your listings are reviewed once, then publish automatically."],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-sm font-semibold text-white">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-navy">{title}</p>
                    <p className="text-slate-600">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <PartnerForm />
        </div>
      </section>
    </>
  );
}
