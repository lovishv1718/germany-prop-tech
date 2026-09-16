"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Heart, LayoutDashboard, Mail, MessageSquare, Phone, Search, Unlock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatDate, formatEUR, formatPrice, publisherShortName, type Property } from "@/data/properties";
import DashboardShell, { EmptyState, Panel, StatCard, type DashNavItem } from "./DashboardShell";
import PropertyCard from "@/components/property/PropertyCard";
import Photo from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Button";

export default function TenantDashboard() {
  const { listings, savedIds, enquiries, unlocks, subscription, settings } = useApp();
  const [tab, setTab] = useState("overview");

  const byId = new Map(listings.map((l) => [l.id, l]));
  const saved = savedIds.map((id) => byId.get(id)).filter((p): p is Property => !!p && p.status === "Published" && !p.paused);
  const myEnquiries = enquiries.filter((e) => e.mine);
  const activeUnlocks = unlocks.filter((u) => new Date(u.expiresAt) > new Date());

  const nav: DashNavItem[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "saved", label: "Saved", icon: Heart, badge: saved.length },
    { key: "enquiries", label: "Enquiries", icon: MessageSquare, badge: myEnquiries.length },
    { key: "contacts", label: "Contacts", icon: Unlock, badge: activeUnlocks.length },
    { key: "alerts", label: "WhatsApp alerts", icon: Bell, href: "/subscriptions" },
  ];

  const show = (key: string) => tab === "overview" || tab === key;

  return (
    <DashboardShell
      role="Tenant"
      nav={nav}
      active={tab}
      onSelect={setTab}
      title="Welcome back, Lukas"
      subtitle="Everything you are tracking in one place."
      actions={
        <ButtonLink href="/search" variant="primary">
          <Search className="h-4 w-4" /> Find properties
        </ButtonLink>
      }
    >
      {tab === "overview" && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard label="Saved properties" value={saved.length} icon={Heart} />
          <StatCard label="Enquiries sent" value={myEnquiries.length} detail={`${myEnquiries.filter((e) => e.status === "Replied").length} replied`} icon={MessageSquare} />
          <StatCard label="Contacts unlocked" value={activeUnlocks.length} detail="Valid for 30 days each" icon={Unlock} />
          <StatCard
            label="WhatsApp alerts"
            value={subscription ? (subscription.plan === "monthly" ? "Monthly" : "Quarterly") : "Off"}
            detail={subscription ? `Since ${formatDate(subscription.startedAt)}` : <Link href="/subscriptions" className="font-medium text-navy underline underline-offset-2">Set up alerts</Link>}
            icon={Bell}
          />
        </div>
      )}

      <div className="space-y-8">
        {show("saved") && (
          <Panel
            title="Saved properties"
            action={tab === "overview" && saved.length > 3 ? <button type="button" onClick={() => setTab("saved")} className="text-sm font-semibold text-navy">View all {saved.length}</button> : undefined}
          >
            {saved.length === 0 ? (
              <EmptyState icon={Heart} title="No saved properties yet" text="Tap the heart on any listing to keep it here." action={<ButtonLink href="/search" variant="outline" size="sm">Browse properties</ButtonLink>} />
            ) : (
              <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                {(tab === "overview" ? saved.slice(0, 3) : saved).map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </Panel>
        )}

        {show("enquiries") && (
          <Panel title="My enquiries">
            {myEnquiries.length === 0 ? (
              <EmptyState icon={MessageSquare} title="No enquiries yet" text="Send an enquiry from any property page and replies will appear here." />
            ) : (
              <ul className="divide-y divide-line">
                {myEnquiries.map((e) => {
                  const p = byId.get(e.propertyId);
                  return (
                    <li key={e.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row">
                      {p && <Photo src={p.images[0]} alt="" className="h-20 w-full shrink-0 rounded-[10px] sm:w-28" />}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {p ? (
                            <Link href={`/property/${p.id}`} className="font-semibold text-navy hover:underline">
                              {p.title}
                            </Link>
                          ) : (
                            <span className="font-semibold text-navy">Listing removed</span>
                          )}
                          <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${e.status === "Replied" ? "bg-steel-soft text-steel" : "bg-sun-soft text-[#8a6400]"}`}>
                            {e.status === "Replied" ? "Replied" : "Awaiting reply"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">
                          To {p?.publisherName ?? "publisher"} · {formatDate(e.createdAt)}
                        </p>
                        <p className="mt-2 text-[15px] text-slate-700">{e.message}</p>
                        {e.reply && (
                          <div className="mt-3 rounded-btn bg-sand px-4 py-3 text-[15px] text-slate-700">
                            <p className="mb-1 text-sm font-semibold text-navy">Reply from {p ? publisherShortName(p) : "publisher"}</p>
                            {e.reply}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        )}

        {show("contacts") && (
          <Panel title="Purchased contacts">
            {activeUnlocks.length === 0 ? (
              <EmptyState icon={Unlock} title="No unlocked contacts" text={`Unlock a publisher's phone and email for ${formatEUR(settings.unlockPrice, true)} from any property page.`} />
            ) : (
              <ul className="divide-y divide-line">
                {activeUnlocks.map((u) => {
                  const p = byId.get(u.propertyId);
                  if (!p) return null;
                  return (
                    <li key={u.transactionId} className="grid gap-4 px-5 py-5 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
                      <div className="flex min-w-0 items-center gap-3">
                        <Photo src={p.images[0]} alt="" className="h-14 w-16 shrink-0 rounded-[10px]" />
                        <div className="min-w-0">
                          <Link href={`/property/${p.id}`} className="block truncate font-semibold text-navy hover:underline">
                            {p.title}
                          </Link>
                          <p className="text-sm text-slate-500">{formatPrice(p)}</p>
                        </div>
                      </div>
                      <div className="min-w-0 text-sm">
                        <p className="font-semibold text-navy">{p.publisherName}</p>
                        <a href={`tel:${p.publisherPhone.replace(/\s/g, "")}`} className="mt-1 flex items-center gap-2 text-slate-600 hover:text-navy">
                          <Phone className="h-3.5 w-3.5" /> {p.publisherPhone}
                        </a>
                        <a href={`mailto:${p.publisherEmail}`} className="flex items-center gap-2 truncate text-slate-600 hover:text-navy">
                          <Mail className="h-3.5 w-3.5" /> {p.publisherEmail}
                        </a>
                      </div>
                      <div className="text-sm md:text-right">
                        <p className="font-medium text-navy">Valid until {formatDate(u.expiresAt)}</p>
                        <p className="font-mono text-xs text-slate-500">{u.transactionId}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        )}
      </div>
    </DashboardShell>
  );
}
