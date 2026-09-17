"use client";

import { useState } from "react";
import { CircleCheck, Send } from "lucide-react";
import { Checkbox, FieldError, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const INTEGRATIONS = ["REST API", "OpenImmo XML feed", "CSV upload", "Not sure yet"];

export default function PartnerForm() {
  const toast = useToast();
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    type: "Real estate agency",
    volume: "50 to 250",
    integration: "REST API",
    message: "",
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.company.trim().length < 2) next.company = "Enter your company name.";
    if (form.name.trim().length < 2) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid work email.";
    if (!consent) next.consent = "Please accept so we can contact you.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSent(true);
    toast("Application received. Our partnerships team will reply within 2 working days.");
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-card border border-line bg-white px-6 py-14 text-center">
        <CircleCheck className="h-12 w-12 text-verified" />
        <h3 className="mt-5 text-2xl font-bold text-navy">Thanks, {form.name.split(" ")[0]}</h3>
        <p className="mt-2 max-w-md text-slate-600">
          We have received the application for {form.company}. A partner manager will email {form.email} within 2 working days with sandbox API keys and next steps.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
          Submit another application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5 rounded-card border border-line bg-white p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-company">Company</Label>
          <Input id="p-company" value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Spree Homes GmbH" />
          <FieldError>{errors.company}</FieldError>
        </div>
        <div>
          <Label htmlFor="p-name">Your name</Label>
          <Input id="p-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Anna Becker" />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="p-email">Work email</Label>
          <Input id="p-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="anna@company.de" />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="p-phone">Phone (optional)</Label>
          <Input id="p-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+49 000 000 000" />
        </div>
        <div>
          <Label htmlFor="p-type">Partner type</Label>
          <Select id="p-type" value={form.type} onChange={(e) => update("type", e.target.value)}>
            {["Real estate agency", "Property developer", "Relocation service", "Property management", "Referral partner"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="p-volume">Active listings</Label>
          <Select id="p-volume" value={form.volume} onChange={(e) => update("volume", e.target.value)}>
            {["Fewer than 50", "50 to 250", "250 to 1,000", "More than 1,000"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700">Preferred integration</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {INTEGRATIONS.map((i) => (
            <label key={i} className={`flex cursor-pointer items-center justify-center rounded-btn border px-3 py-2.5 text-center text-sm font-medium transition ${form.integration === i ? "border-navy bg-navy text-white" : "border-line text-slate-700 hover:border-slate-300"}`}>
              <input type="radio" name="integration" value={i} checked={form.integration === i} onChange={() => update("integration", i)} className="sr-only" />
              {i}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <Label htmlFor="p-message">Anything we should know? (optional)</Label>
        <Textarea id="p-message" rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="We currently publish on ImmoScout24 and our own website." />
      </div>
      <div>
        <Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} label="I agree that UFT Living Germany may contact me about the partner programme." />
        <FieldError>{errors.consent}</FieldError>
      </div>
      <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
        <Send className="h-4 w-4" /> Apply to partner
      </Button>
    </form>
  );
}
