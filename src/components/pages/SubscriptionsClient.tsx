"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BellRing, Check, CheckCheck, CircleCheck, MessageCircle, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CITIES, INTENTS, PROPERTY_TYPES, formatDate, formatEUR, type Intent } from "@/data/properties";
import type { PaymentMethod, PlanId } from "@/data/demo";
import { budgetOptions } from "@/lib/search";
import { Checkbox, Chip, FieldError, Input, Label, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import CheckoutModal from "@/components/payments/CheckoutModal";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-white p-5 sm:p-7">
      <h2 className="flex items-center gap-3 text-xl font-bold text-navy sm:text-2xl">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy font-sans text-sm font-semibold text-white">{n}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function SubscriptionsClient() {
  const params = useSearchParams();
  const { settings, subscription, subscribeAlerts, role, setRole } = useApp();
  const toast = useToast();

  const [intent, setIntent] = useState<Intent>("Rent");
  const [cities, setCities] = useState<string[]>(["Berlin"]);
  const [types, setTypes] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState("");
  const [plan, setPlan] = useState<PlanId>(params.get("plan") === "monthly" ? "monthly" : "quarterly");
  const [whatsapp, setWhatsapp] = useState("+49 151 2345 6789");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const price = plan === "monthly" ? settings.monthlyPrice : settings.quarterlyPrice;
  const saving = Math.round((1 - settings.quarterlyPrice / 3 / settings.monthlyPrice) * 100);
  const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const proceed = () => {
    const e: Record<string, string> = {};
    if (cities.length === 0) e.cities = "Choose at least one city.";
    if (whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "Enter a valid WhatsApp number including country code.";
    if (!consent) e.consent = "WhatsApp alerts need your consent.";
    setErrors(e);
    if (Object.keys(e).length === 0) setCheckoutOpen(true);
  };

  const onPaid = (transactionId: string, method: PaymentMethod) => {
    subscribeAlerts(
      { plan, intent, cities, types, maxBudget: maxBudget ? Number(maxBudget) : null, whatsapp, transactionId },
      method,
      price,
    );
    if (role === "Guest") {
      setRole("Tenant");
      toast("Signed in as demo tenant", "info");
    }
    setEditing(false);
  };

  const preview = `New ${types[0] ?? "home"} ${intent === "Buy" ? "for sale" : intent === "Share" ? "to share" : "to rent"} in ${cities[0] ?? "Berlin"}: 2 rooms, 68 m², ${intent === "Buy" ? "€489.000" : "€1.420 / month"}. Verified landlord. View: ulivger.com/p/48213`;

  // Stay on the form while checkout is open so its success screen isn't unmounted mid-flow.
  if (subscription && !editing && !checkoutOpen) {
    return (
      <div className="mx-auto max-w-2xl rounded-card border border-line bg-white p-6 text-center sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-verified-soft">
          <CircleCheck className="h-9 w-9 text-verified" />
        </span>
        <h2 className="mt-5 text-3xl font-bold text-navy">Your WhatsApp alerts are active</h2>
        <p className="mt-2 text-slate-600">
          We will message {subscription.whatsapp} as soon as a matching listing is approved.
        </p>
        <dl className="mt-8 divide-y divide-line rounded-card border border-line text-left">
          {[
            ["Plan", `${subscription.plan === "monthly" ? "Monthly" : "Quarterly"}, since ${formatDate(subscription.startedAt)}`],
            ["Looking to", subscription.intent],
            ["Cities", subscription.cities.join(", ")],
            ["Property types", subscription.types.length ? subscription.types.join(", ") : "All types"],
            ["Max budget", subscription.maxBudget ? formatEUR(subscription.maxBudget) : "No limit"],
            ["Transaction", subscription.transactionId],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:justify-between">
              <dt className="text-slate-500">{k}</dt>
              <dd className="font-semibold text-navy sm:text-right">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" onClick={() => setEditing(true)}>
            Change preferences
          </Button>
          <Link href="/search" className="inline-flex h-11 items-center justify-center rounded-btn bg-sun px-5 font-semibold text-navy hover:bg-sun-dark">
            Browse current listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
      <div className="min-w-0 space-y-5">
        <Step n={1} title="What should we look for?">
          <div className="space-y-6">
            <div>
              <Label>Looking to</Label>
              <div className="grid max-w-sm grid-cols-3 gap-1 rounded-btn bg-sand p-1">
                {INTENTS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={intent === i}
                    onClick={() => {
                      setIntent(i);
                      setMaxBudget("");
                    }}
                    className={`h-9 rounded-[7px] text-sm font-medium transition ${intent === i ? "bg-white text-navy shadow-sm" : "text-slate-600 hover:text-navy"}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Cities</Label>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <Chip key={c} selected={cities.includes(c)} onClick={() => setCities(toggle(cities, c))}>
                    {c}
                  </Chip>
                ))}
              </div>
              <FieldError>{errors.cities}</FieldError>
            </div>
            <div>
              <Label>Property types</Label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <Chip key={t} selected={types.includes(t)} onClick={() => setTypes(toggle(types, t))}>
                    {t}
                  </Chip>
                ))}
              </div>
              <p className="mt-2 text-sm text-slate-500">Leave empty to hear about every type.</p>
            </div>
            <div className="max-w-sm">
              <Label htmlFor="alert-budget">Max budget</Label>
              <Select id="alert-budget" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)}>
                <option value="">No limit</option>
                {budgetOptions(intent).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Step>

        <Step n={2} title="Choose your plan">
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Plan">
            {(
              [
                { id: "monthly", name: "Monthly", price: settings.monthlyPrice, note: "Billed every month. Cancel anytime." },
                { id: "quarterly", name: "Quarterly", price: settings.quarterlyPrice, note: `Billed every 3 months.${saving > 0 ? ` Save ${saving}%.` : ""}` },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={plan === p.id}
                onClick={() => setPlan(p.id)}
                className={`relative rounded-card border-2 p-5 text-left transition ${plan === p.id ? "border-navy bg-sand/50" : "border-line hover:border-slate-300"}`}
              >
                {p.id === "quarterly" && <span className="absolute right-4 top-4 rounded-md bg-sun px-2 py-0.5 text-xs font-semibold text-navy">Best value</span>}
                <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${plan === p.id ? "border-navy bg-navy" : "border-slate-300"}`}>
                  {plan === p.id && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
                </span>
                <p className="mt-4 font-semibold text-navy">{p.name}</p>
                <p className="mt-1 font-display text-3xl font-bold tracking-tight text-navy">{formatEUR(p.price, true)}</p>
                <p className="mt-1 text-sm text-slate-500">{p.note}</p>
              </button>
            ))}
          </div>
        </Step>

        <Step n={3} title="Connect WhatsApp">
          <div className="space-y-5">
            <div className="max-w-sm">
              <Label htmlFor="whatsapp">WhatsApp number</Label>
              <Input id="whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              <FieldError>{errors.whatsapp}</FieldError>
            </div>
            <div className="rounded-card bg-sand p-4">
              <Checkbox
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                label="I agree to receive property alerts from UFT Living Germany on WhatsApp."
                description="Up to 5 messages a day. Reply STOP at any time to unsubscribe. We never share your number with publishers."
              />
              <FieldError>{errors.consent}</FieldError>
            </div>
          </div>
        </Step>
      </div>

      <aside>
        <div className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-card border border-line bg-white p-5 shadow-soft sm:p-6">
            <p className="text-sm font-medium text-slate-500">Summary</p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="font-display text-2xl font-bold text-navy">{plan === "monthly" ? "Monthly" : "Quarterly"} alerts</p>
              <p className="font-display text-2xl font-bold text-navy">{formatEUR(price, true)}</p>
            </div>
            <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-[15px] text-slate-600">
              <li className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-navy" />{intent} in {cities.length ? cities.join(", ") : "no city selected"}</li>
              <li className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-navy" />{types.length ? types.join(", ") : "All property types"}</li>
              <li className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-navy" />{maxBudget ? `Up to ${formatEUR(Number(maxBudget))}` : "Any budget"}</li>
            </ul>
            <Button variant="primary" size="lg" className="mt-6 w-full" onClick={proceed}>
              <BellRing className="h-4 w-4" /> Continue to payment
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" /> GDPR compliant. Cancel anytime.
            </p>
          </div>

          <div className="rounded-card bg-navy p-5 text-white">
            <p className="flex items-center gap-2 text-sm font-medium text-white/70">
              <MessageCircle className="h-4 w-4 text-sun" /> Example alert
            </p>
            <div className="mt-3 rounded-[12px] rounded-tl-sm bg-white p-3.5 text-[14px] leading-relaxed text-navy">
              <p className="font-semibold">UFT Living Germany</p>
              <p className="mt-1">{preview}</p>
              <p className="mt-1.5 flex items-center justify-end gap-1 text-xs text-slate-400">
                09:41 <CheckCheck className="h-3.5 w-3.5 text-steel" />
              </p>
            </div>
          </div>
        </div>
      </aside>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        amount={price}
        productName={`WhatsApp alerts, ${plan === "monthly" ? "Monthly" : "Quarterly"}`}
        productDetail={`${intent} in ${cities.join(", ")}`}
        onPaid={onPaid}
        successTitle="Alerts activated"
        successText="Your first matching listings will arrive on WhatsApp shortly."
        successCta="Done"
      />
    </div>
  );
}
