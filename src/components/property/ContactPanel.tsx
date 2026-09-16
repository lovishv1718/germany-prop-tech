"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarClock, Flag, Heart, LockKeyhole, Mail, MessageSquare, Phone, Share2, ShieldCheck, UserRound } from "lucide-react";
import { useApp, useUnlock } from "@/context/AppContext";
import { DEMO_TENANT, formatDate, formatEUR, PERIOD_LABEL, type Property } from "@/data/properties";
import { REPORT_REASONS, type PaymentMethod } from "@/data/demo";
import { useToast } from "@/components/ui/Toast";
import { VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox, FieldError, Input, Label, Textarea } from "@/components/ui/Field";
import Modal from "@/components/ui/Modal";
import CheckoutModal from "@/components/payments/CheckoutModal";
import { copyText } from "@/lib/clipboard";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function EnquiryModal({ property, open, onClose }: { property: Property; open: boolean; onClose: () => void }) {
  const { addEnquiry } = useApp();
  const toast = useToast();
  // People are addressed by first name; agencies and partners by their company name.
  const greeting = ["Landlord", "Flatmate", "Referral"].includes(property.publisherType)
    ? property.publisherName.split(" ")[0]
    : property.publisherName;
  const [form, setForm] = useState({
    name: DEMO_TENANT.name,
    email: DEMO_TENANT.email,
    phone: DEMO_TENANT.phone,
    message: `Hello ${greeting}, I'm interested in "${property.title}". Is it still available, and when could I arrange a viewing?`,
  });
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.message.trim().length < 10) {
      setError("Please add your name, a valid email and a short message.");
      return;
    }
    if (!consent) {
      setError("Please agree to share your details with the publisher.");
      return;
    }
    addEnquiry({ propertyId: property.id, ...form });
    toast(`Enquiry sent to ${greeting}. Track replies in your tenant dashboard.`);
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send an enquiry"
      description={`To ${property.publisherName} about ${property.title}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="enquiry-form" variant="navy">
            <MessageSquare className="h-4 w-4" /> Send enquiry
          </Button>
        </>
      }
    >
      <form id="enquiry-form" onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="enq-name">Full name</Label>
            <Input id="enq-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="enq-phone">Phone</Label>
            <Input id="enq-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div>
          <Label htmlFor="enq-email">Email</Label>
          <Input id="enq-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="enq-message">Message</Label>
          <Textarea id="enq-message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} label="Share my name, email and phone with this publisher" />
        <FieldError>{error}</FieldError>
      </form>
    </Modal>
  );
}

function ReportModal({ property, open, onClose }: { property: Property; open: boolean; onClose: () => void }) {
  const { addReport } = useApp();
  const toast = useToast();
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addReport({ propertyId: property.id, reason, details });
    toast("Report received. Our trust team reviews every report within 24 hours.");
    setDetails("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Report this listing"
      description="Reports are confidential. The publisher will not see who reported them."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="report-form" variant="danger">
            <Flag className="h-4 w-4" /> Submit report
          </Button>
        </>
      }
    >
      <form id="report-form" onSubmit={submit} className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium text-slate-700">What is wrong with this listing?</legend>
          {REPORT_REASONS.map((r) => (
            <label key={r} className={`flex cursor-pointer items-center gap-3 rounded-btn border px-3.5 py-3 text-[15px] transition ${reason === r ? "border-navy bg-sand" : "border-line hover:border-slate-300"}`}>
              <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="h-4 w-4 accent-[#0B1F3A]" />
              {r}
            </label>
          ))}
        </fieldset>
        <div>
          <Label htmlFor="report-details">Details (optional)</Label>
          <Textarea id="report-details" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Anything that helps us investigate" />
        </div>
      </form>
    </Modal>
  );
}

export default function ContactPanel({ property }: { property: Property }) {
  const { role, setRole, settings, savedIds, toggleSaved, unlockContact, enquiries } = useApp();
  const unlock = useUnlock(property.id);
  const toast = useToast();
  const [modal, setModal] = useState<"guest" | "checkout" | "enquiry" | "report" | null>(null);
  const saved = savedIds.includes(property.id);
  const lastEnquiry = enquiries.find((e) => e.propertyId === property.id && e.mine);

  const startUnlock = () => setModal(role === "Guest" ? "guest" : "checkout");

  const share = async () => {
    const url = window.location.href;
    toast((await copyText(url)) ? "Link copied to clipboard" : `Copy this link: ${url}`, "info");
  };

  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-soft sm:p-6">
      <p className="font-display text-3xl font-bold tracking-tight text-navy">
        {formatEUR(property.price)}
        {PERIOD_LABEL[property.pricePeriod] && <span className="ml-1.5 font-sans text-base font-medium tracking-normal text-slate-500">{PERIOD_LABEL[property.pricePeriod]}</span>}
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy font-display text-base font-bold text-sun">{initials(property.publisherName)}</span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy">{property.publisherName}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">{property.publisherType}</span>
            {property.verified && <VerifiedBadge label="Verified publisher" />}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {unlock ? (
          <>
            <a href={`tel:${property.publisherPhone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-btn border border-line px-3.5 py-3 hover:bg-sand">
              <Phone className="h-4 w-4 text-slate-500" />
              <span className="font-semibold text-navy">{property.publisherPhone}</span>
            </a>
            <a href={`mailto:${property.publisherEmail}`} className="flex items-center gap-3 rounded-btn border border-line px-3.5 py-3 hover:bg-sand">
              <Mail className="h-4 w-4 text-slate-500" />
              <span className="truncate font-semibold text-navy">{property.publisherEmail}</span>
            </a>
            <p className="flex items-start gap-2 rounded-btn bg-verified-soft px-3 py-2.5 text-sm text-[#0b7a6e]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
              <span>
                <span className="font-semibold">Access granted, valid 30 days.</span> Until {formatDate(unlock.expiresAt)} · {unlock.transactionId}
              </span>
            </p>
          </>
        ) : (
          <>
            {/* Placeholder values only: the real contact details are not rendered until unlocked. */}
            <div className="flex items-center gap-3 rounded-btn border border-line px-3.5 py-3" aria-hidden="true">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="select-none font-semibold text-navy blur-[5px]">+49 176 4821 9930</span>
            </div>
            <div className="flex items-center gap-3 rounded-btn border border-line px-3.5 py-3" aria-hidden="true">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="select-none font-semibold text-navy blur-[5px]">contact@publisher.de</span>
            </div>
            <Button variant="primary" size="lg" className="w-full" onClick={startUnlock}>
              <LockKeyhole className="h-4 w-4" />
              Unlock contact details for {formatEUR(settings.unlockPrice, true)}
            </Button>
            <p className="text-center text-xs text-slate-500">One-time payment. Access for 30 days.</p>
          </>
        )}
      </div>

      <Button variant="navy" className="mt-3 w-full" onClick={() => setModal("enquiry")}>
        <MessageSquare className="h-4 w-4" /> Send enquiry
      </Button>
      {lastEnquiry && (
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-500">
          <CalendarClock className="h-4 w-4" />
          You enquired on {formatDate(lastEnquiry.createdAt)}
          {lastEnquiry.status === "Replied" && <span className="font-medium text-navy">· Replied</span>}
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={saved}
          onClick={() => toast(toggleSaved(property.id) ? "Saved to your shortlist" : "Removed from your shortlist", "info")}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
          {saved ? "Saved" : "Save"}
        </Button>
        <Button variant="ghost" size="sm" onClick={share}>
          <Share2 className="h-4 w-4" /> Share
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setModal("report")}>
          <Flag className="h-4 w-4" /> Report
        </Button>
      </div>

      <Modal
        open={modal === "guest"}
        onClose={() => setModal(null)}
        title="Sign in to unlock contacts"
        description="Contact details are only available to signed-in tenants, so publishers know who is calling."
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-card bg-sand p-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sun">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-navy">{DEMO_TENANT.name}</p>
              <p className="text-sm text-slate-500">Demo tenant account</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              setRole("Tenant");
              toast("Signed in as demo tenant");
              setModal("checkout");
            }}
          >
            Continue as demo tenant
          </Button>
          <p className="text-center text-sm text-slate-500">
            Or <Link href="/login" className="font-medium text-navy underline underline-offset-2">choose another demo account</Link>
          </p>
        </div>
      </Modal>

      <CheckoutModal
        open={modal === "checkout"}
        onClose={() => setModal(null)}
        amount={settings.unlockPrice}
        productName="Contact unlock"
        productDetail={`${property.title}, ${property.locality}`}
        onPaid={(txId: string, method: PaymentMethod) => unlockContact(property.id, method, txId)}
        successTitle="Contact details unlocked"
        successText={`You can now call or email ${property.publisherName} for the next 30 days.`}
        successCta="Show contact details"
      />
      <EnquiryModal key={property.id} property={property} open={modal === "enquiry"} onClose={() => setModal(null)} />
      <ReportModal property={property} open={modal === "report"} onClose={() => setModal(null)} />
    </div>
  );
}
