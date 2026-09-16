"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Ban,
  BadgeCheck,
  Building,
  Check,
  ClipboardCheck,
  CreditCard,
  Flag,
  Handshake,
  LayoutDashboard,
  MessageCircle,
  RefreshCw,
  Settings as SettingsIcon,
  Unlock,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatDate, formatEUR, formatPrice, type Property } from "@/data/properties";
import { PARTNERS, PAYMENTS, PLATFORM_TOTALS, REJECT_REASONS, REVENUE_MONTHS, REVENUE_SOURCES, USERS, WHATSAPP_TEMPLATES } from "@/data/demo";
import DashboardShell, { EmptyState, Panel, StatCard, TableWrap, type DashNavItem } from "./DashboardShell";
import Photo from "@/components/ui/Photo";
import Modal from "@/components/ui/Modal";
import { Button, buttonClass } from "@/components/ui/Button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";

const pill = (tone: "green" | "amber" | "red" | "slate") =>
  `inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
    { green: "bg-verified-soft text-[#0b7a6e]", amber: "bg-sun-soft text-[#8a6400]", red: "bg-red-50 text-red-700", slate: "bg-slate-100 text-slate-600" }[tone]
  }`;

function RejectModal({ listing, onClose }: { listing: Property | null; onClose: () => void }) {
  const { rejectListing } = useApp();
  const toast = useToast();
  const [reason, setReason] = useState(REJECT_REASONS[0]);
  const [note, setNote] = useState("");

  if (!listing) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    rejectListing(listing.id, note.trim() ? `${reason}. ${note.trim()}` : reason);
    toast(`${listing.title} was rejected. The publisher has been notified.`, "info");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Reject listing"
      description={listing.title}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="reject-form" variant="danger">
            <X className="h-4 w-4" /> Reject listing
          </Button>
        </>
      }
    >
      <form id="reject-form" onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="reject-reason">Reason</Label>
          <Select id="reject-reason" value={reason} onChange={(e) => setReason(e.target.value)}>
            {REJECT_REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="reject-note">Note to publisher (optional)</Label>
          <Textarea id="reject-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Please upload current photos of the living room and kitchen." />
        </div>
        <p className="text-sm text-slate-500">The publisher sees this reason in their dashboard and can resubmit.</p>
      </form>
    </Modal>
  );
}

function SettingsPanel() {
  const { settings, updateSettings } = useApp();
  const toast = useToast();
  const [values, setValues] = useState({
    unlockPrice: String(settings.unlockPrice),
    monthlyPrice: String(settings.monthlyPrice),
    quarterlyPrice: String(settings.quarterlyPrice),
  });
  const [error, setError] = useState("");

  const fields: { key: keyof typeof values; label: string; hint: string }[] = [
    { key: "unlockPrice", label: "Contact unlock price", hint: "Charged once per property, access for 30 days" },
    { key: "monthlyPrice", label: "WhatsApp alerts, monthly", hint: "Recurring every month" },
    { key: "quarterlyPrice", label: "WhatsApp alerts, quarterly", hint: "Recurring every 3 months" },
  ];

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, Number(v.replace(",", "."))])) as Record<keyof typeof values, number>;
    if (Object.values(parsed).some((n) => !(n > 0) || n > 999)) {
      setError("Prices must be between 0.01 and 999 EUR.");
      return;
    }
    setError("");
    updateSettings({ unlockPrice: Math.round(parsed.unlockPrice * 100) / 100, monthlyPrice: Math.round(parsed.monthlyPrice * 100) / 100, quarterlyPrice: Math.round(parsed.quarterlyPrice * 100) / 100 });
    toast("Pricing saved. New prices are live across the site.");
  };

  return (
    <Panel title="Pricing settings">
      <form onSubmit={save} className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-3">
          {fields.map(({ key, label, hint }) => (
            <div key={key}>
              <Label htmlFor={key}>{label}</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                <Input id={key} inputMode="decimal" className="pl-8" value={values[key]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
              </div>
              <p className="mt-1.5 text-sm text-slate-500">{hint}</p>
            </div>
          ))}
        </div>
        <FieldError>{error}</FieldError>
        <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Prices include 19% VAT. Changes apply to new purchases only.</p>
          <Button type="submit" variant="navy">
            Save pricing
          </Button>
        </div>
      </form>
    </Panel>
  );
}

export default function AdminDashboard() {
  const { listings, payments, reports, approveListing } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [rejecting, setRejecting] = useState<Property | null>(null);

  const pending = useMemo(() => listings.filter((l) => l.status === "Pending").sort((a, b) => b.listedAt.localeCompare(a.listedAt)), [listings]);
  const active = listings.filter((l) => l.status === "Published" && !l.paused).length;
  const sessionRevenue = payments.reduce((sum, p) => sum + (p.status === "Succeeded" ? p.amount : 0), 0);
  const sessionUnlocks = payments.filter((p) => p.product === "Contact unlock").length;

  const months = REVENUE_MONTHS.map((m, i) => (i === REVENUE_MONTHS.length - 1 ? { ...m, amount: m.amount + sessionRevenue } : m));
  const maxMonth = Math.max(...months.map((m) => m.amount));
  const thisMonth = months[months.length - 1].amount;
  const allPayments = [...payments, ...PAYMENTS];

  const nav: DashNavItem[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "approvals", label: "Approvals", icon: ClipboardCheck, badge: pending.length },
    { key: "users", label: "Users", icon: Users },
    { key: "payments", label: "Payments", icon: CreditCard },
    { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { key: "partners", label: "Partners", icon: Handshake },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ];

  const approve = (l: Property) => {
    approveListing(l.id);
    toast(`Approved. ${l.title} is now live in search.`);
  };

  const approvalQueue = (
    <Panel
      title="Approval queue"
      action={pending.length > 0 ? <span className={pill("amber")}>{pending.length} waiting</span> : <span className={pill("green")}>All clear</span>}
    >
      {pending.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No listings waiting" text="New submissions from publishers will appear here for review." />
      ) : (
        <ul className="divide-y divide-line">
          {pending.map((l) => (
            <li key={l.id} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <Photo src={l.images[0]} alt="" className="h-16 w-20 shrink-0 rounded-[10px]" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-navy">{l.title}</p>
                  <p className="text-sm text-slate-500">
                    {l.type} · {l.locality}, {l.city} · {formatPrice(l)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {l.publisherName} ({l.publisherType}) · submitted {formatDate(l.listedAt, { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={`/property/${l.id}`} className={buttonClass("outline", "sm")}>
                  View
                </Link>
                <Button variant="outline" size="sm" onClick={() => setRejecting(l)} className="text-red-700 hover:border-red-200 hover:bg-red-50">
                  <X className="h-4 w-4" /> Reject
                </Button>
                <Button variant="navy" size="sm" onClick={() => approve(l)}>
                  <Check className="h-4 w-4" /> Approve
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );

  const titles: Record<string, [string, string]> = {
    overview: ["Platform overview", "September 2026, month to date"],
    approvals: ["Approvals", "Review new listings before they go live"],
    users: ["Users", `${PLATFORM_TOTALS.users.toLocaleString("de-DE")} registered accounts`],
    payments: ["Payments", "Contact unlocks, subscriptions and partner fees"],
    whatsapp: ["WhatsApp alerts", "Meta-approved message templates and delivery"],
    partners: ["Partners", "Listing feeds and API integrations"],
    settings: ["Settings", "Platform pricing"],
  };

  return (
    <DashboardShell role="Admin" nav={nav} active={tab} onSelect={setTab} title={titles[tab][0]} subtitle={titles[tab][1]}>
      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            <StatCard label="Users" value={PLATFORM_TOTALS.users.toLocaleString("de-DE")} detail="+312 this month" icon={Users} />
            <StatCard label="Active listings" value={active} detail={`${listings.length} total`} icon={Building} />
            <StatCard label="Pending approvals" value={pending.length} detail={pending.length ? "Oldest waiting under 24h" : "Queue is clear"} icon={ClipboardCheck} />
            <StatCard label="Revenue this month" value={formatEUR(thisMonth)} detail="+14% vs same point in August" icon={Wallet} />
            <StatCard label="Contact unlocks" value={(PLATFORM_TOTALS.contactUnlocksThisMonth + sessionUnlocks).toLocaleString("de-DE")} detail={sessionUnlocks ? `${sessionUnlocks} in this session` : "This month"} icon={Unlock} />
            <StatCard label="Open reports" value={PLATFORM_TOTALS.openReports + reports.length} detail={reports.length ? `${reports.length} new in this session` : "2 marked urgent"} icon={Flag} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Panel title="Revenue, last 6 months">
              <div className="p-5">
                <div className="flex h-56 items-end gap-3 sm:gap-5" role="img" aria-label="Monthly revenue bar chart">
                  {months.map((m, i) => {
                    const current = i === months.length - 1;
                    return (
                      <div key={m.month} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <span className={`text-xs font-semibold tabular-nums ${current ? "text-navy" : "text-slate-500"}`}>€{(m.amount / 1000).toFixed(1).replace(".", ",")}k</span>
                        <div
                          className={`w-full max-w-14 rounded-t-md transition-colors ${current ? "bg-sun" : "bg-navy group-hover:bg-navy-800"}`}
                          style={{ height: `${Math.max(4, (m.amount / maxMonth) * 100)}%` }}
                          title={`${m.month}: ${formatEUR(m.amount)}`}
                        />
                        <span className="text-sm text-slate-500">{m.month}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-sm bg-sun" /> September is month to date
                </p>
              </div>
            </Panel>

            <Panel title="Revenue by source">
              <ul className="space-y-4 p-5">
                {REVENUE_SOURCES.map((s) => (
                  <li key={s.source}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-navy">{s.source}</span>
                      <span className="tabular-nums text-slate-600">
                        {formatEUR(thisMonth * s.share)} <span className="text-slate-400">· {Math.round(s.share * 100)}%</span>
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand">
                      <div className="h-full rounded-full bg-steel" style={{ width: `${s.share * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {approvalQueue}
        </div>
      )}

      {tab === "approvals" && approvalQueue}

      {tab === "users" && (
        <Panel title="Recent users">
          <TableWrap>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>City</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.email}>
                  <td>
                    <p className="flex items-center gap-1.5 font-semibold text-navy">
                      {u.name} {u.verified && <BadgeCheck className="h-4 w-4 text-verified" aria-label="Verified" />}
                    </p>
                    <p className="text-slate-500">{u.email}</p>
                  </td>
                  <td className="text-slate-700">{u.role}</td>
                  <td className="text-slate-700">{u.city}</td>
                  <td className="whitespace-nowrap text-slate-500">{formatDate(u.joined)}</td>
                  <td>
                    <span className={pill(u.status === "Active" ? "green" : u.status === "Suspended" ? "red" : "amber")}>
                      {u.status === "Suspended" && <Ban className="h-3 w-3" />}
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>
      )}

      {tab === "payments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            <StatCard label="Volume this month" value={formatEUR(thisMonth)} icon={Wallet} />
            <StatCard label="This session" value={formatEUR(sessionRevenue, true)} detail={`${payments.length} payments`} icon={CreditCard} />
            <StatCard label="Refund rate" value="1.8%" detail="Industry avg. 3.2%" icon={RefreshCw} />
          </div>
          <Panel title="Recent payments">
            <TableWrap>
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Method</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allPayments.map((p) => (
                  <tr key={p.id} className={p.session ? "bg-sun-soft/40" : ""}>
                    <td>
                      <p className="font-mono text-xs font-semibold text-navy">{p.id}</p>
                      <p className="text-slate-500">{p.session ? "This session" : formatDate(p.createdAt, { day: "numeric", month: "short" })}</p>
                    </td>
                    <td className="text-slate-700">{p.customer}</td>
                    <td className="text-slate-700">{p.product}</td>
                    <td className="text-slate-700">{p.method}</td>
                    <td className="text-right font-semibold tabular-nums text-navy">{formatEUR(p.amount, true)}</td>
                    <td>
                      <span className={pill(p.status === "Succeeded" ? "green" : p.status === "Refunded" ? "slate" : "red")}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </div>
      )}

      {tab === "whatsapp" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            <StatCard label="Active subscribers" value="2.914" detail="61% on quarterly" icon={Users} />
            <StatCard label="Messages sent (30d)" value="28.861" icon={MessageCircle} />
            <StatCard label="Avg. delivery time" value="42s" detail="From listing approval" icon={RefreshCw} />
          </div>
          <Panel title="Message templates">
            <TableWrap>
              <thead>
                <tr>
                  <th>Template</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="text-right">Sent</th>
                  <th>Delivered</th>
                  <th>Read</th>
                </tr>
              </thead>
              <tbody>
                {WHATSAPP_TEMPLATES.map((t) => (
                  <tr key={t.name}>
                    <td>
                      <p className="font-mono text-[13px] font-semibold text-navy">{t.name}</p>
                      <p className="text-slate-500">{t.languages}</p>
                    </td>
                    <td className="text-slate-700">{t.category}</td>
                    <td>
                      <span className={pill(t.status === "Approved" ? "green" : "amber")}>{t.status}</span>
                    </td>
                    <td className="text-right tabular-nums text-slate-700">{t.sent.toLocaleString("de-DE")}</td>
                    {[t.delivered, t.read].map((v, i) => (
                      <td key={i} className="min-w-[120px]">
                        {t.sent ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                              <div className={`h-full rounded-full ${i === 0 ? "bg-verified" : "bg-steel"}`} style={{ width: `${v}%` }} />
                            </div>
                            <span className="w-11 text-right tabular-nums text-slate-600">{v.toLocaleString("de-DE")}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">No sends yet</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </div>
      )}

      {tab === "partners" && (
        <Panel title="Integrations">
          <TableWrap>
            <thead>
              <tr>
                <th>Partner</th>
                <th>Method</th>
                <th className="text-right">Listings</th>
                <th>Last sync</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {PARTNERS.map((p) => (
                <tr key={p.name}>
                  <td className="font-semibold text-navy">{p.name}</td>
                  <td className="text-slate-700">{p.method}</td>
                  <td className="text-right tabular-nums text-slate-700">{p.listings}</td>
                  <td className="whitespace-nowrap text-slate-500">{p.lastSync}</td>
                  <td>
                    <span className={pill(p.status === "Healthy" ? "green" : p.status === "Delayed" ? "amber" : "red")}>{p.status}</span>
                    {p.status === "Error" && <p className="mt-1 text-xs text-red-700">Feed returned HTTP 401. Credentials expired.</p>}
                  </td>
                  <td className="text-right">
                    <Button variant="outline" size="sm" onClick={() => toast(`Sync started for ${p.name}`, "info")}>
                      <RefreshCw className="h-4 w-4" /> Sync now
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>
      )}

      {tab === "settings" && <SettingsPanel />}

      <RejectModal key={rejecting?.id} listing={rejecting} onClose={() => setRejecting(null)} />
    </DashboardShell>
  );
}
