"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Building, Clock, Eye, Inbox, LayoutDashboard, MessageSquare, Pause, Play, Plus, Reply } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DEMO_PUBLISHER, formatDate, formatPrice } from "@/data/properties";
import type { Enquiry } from "@/data/demo";
import DashboardShell, { EmptyState, Panel, StatCard, TableWrap, type DashNavItem } from "./DashboardShell";
import Photo from "@/components/ui/Photo";
import Modal from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/Badge";
import { Button, ButtonLink, buttonClass } from "@/components/ui/Button";
import { Label, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";

function ReplyModal({ enquiry, propertyTitle, onClose }: { enquiry: Enquiry | null; propertyTitle: string; onClose: () => void }) {
  const { replyToEnquiry } = useApp();
  const toast = useToast();
  const [reply, setReply] = useState("");

  if (!enquiry) return null;
  const firstName = enquiry.name.split(" ")[0];

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim().length < 2) return;
    replyToEnquiry(enquiry.id, reply.trim());
    toast(`Reply sent to ${firstName}`);
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Reply to ${enquiry.name}`}
      description={propertyTitle}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="reply-form" variant="navy" disabled={reply.trim().length < 2}>
            <Reply className="h-4 w-4" /> Send reply
          </Button>
        </>
      }
    >
      <form id="reply-form" onSubmit={send} className="space-y-4">
        <div className="rounded-btn bg-sand px-4 py-3">
          <p className="text-sm text-slate-500">
            {enquiry.email} · {enquiry.phone} · {formatDate(enquiry.createdAt)}
          </p>
          <p className="mt-1.5 text-[15px] text-slate-700">{enquiry.message}</p>
        </div>
        {enquiry.reply && (
          <p className="text-sm text-slate-500">
            Previous reply: <span className="text-slate-700">{enquiry.reply}</span>
          </p>
        )}
        <div>
          <Label htmlFor="reply-text">Your reply</Label>
          <Textarea
            id="reply-text"
            rows={5}
            autoFocus
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={`Hi ${firstName}, thanks for your interest. Would a viewing on Thursday at 18:00 work for you?`}
          />
        </div>
      </form>
    </Modal>
  );
}

export default function PublisherDashboard() {
  const { listings, enquiries, togglePaused } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [replyTo, setReplyTo] = useState<Enquiry | null>(null);

  const mine = useMemo(() => listings.filter((l) => l.publisherId === DEMO_PUBLISHER.id), [listings]);
  const mineById = useMemo(() => new Map(mine.map((l) => [l.id, l])), [mine]);
  const myEnquiries = useMemo(() => enquiries.filter((e) => mineById.has(e.propertyId)), [enquiries, mineById]);

  const active = mine.filter((l) => l.status === "Published" && !l.paused).length;
  const pending = mine.filter((l) => l.status === "Pending").length;
  const views = mine.reduce((sum, l) => sum + l.views, 0);
  const newEnquiries = myEnquiries.filter((e) => e.status === "New").length;

  const nav: DashNavItem[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "properties", label: "My properties", icon: Building, badge: mine.length },
    { key: "enquiries", label: "Enquiries", icon: MessageSquare, badge: newEnquiries },
    { key: "add", label: "Add property", icon: Plus, href: "/dashboard/publisher/new" },
  ];

  const show = (key: string) => tab === "overview" || tab === key;

  return (
    <DashboardShell
      role="Publisher"
      nav={nav}
      active={tab}
      onSelect={setTab}
      title="Your listings"
      subtitle={`${DEMO_PUBLISHER.name}, verified landlord since February 2026`}
      actions={
        <ButtonLink href="/dashboard/publisher/new" variant="primary">
          <Plus className="h-4 w-4" /> Add property
        </ButtonLink>
      }
    >
      {tab === "overview" && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard label="Active listings" value={active} detail={`${mine.length} in total`} icon={Building} />
          <StatCard label="Pending review" value={pending} detail="Usually approved within 24h" icon={Clock} />
          <StatCard label="Enquiries" value={myEnquiries.length} detail={`${newEnquiries} awaiting reply`} icon={Inbox} />
          <StatCard label="Views" value={views.toLocaleString("de-DE")} detail="Last 30 days" icon={Eye} />
        </div>
      )}

      <div className="space-y-8">
        {show("properties") && (
          <Panel title="My properties">
            {mine.length === 0 ? (
              <EmptyState icon={Building} title="No properties yet" text="Add your first property and we will review it within 24 hours." />
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="text-right">Views</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Photo src={p.images[0]} alt="" className="h-12 w-16 shrink-0 rounded-lg" />
                          <div className="min-w-0">
                            <p className="max-w-[240px] truncate font-semibold text-navy">{p.title}</p>
                            <p className="text-slate-500">
                              {p.locality}, {p.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap font-medium text-navy">{formatPrice(p)}</td>
                      <td>
                        <StatusBadge status={p.paused ? "Paused" : p.status} />
                        {p.status === "Rejected" && p.rejectReason && <p className="mt-1 max-w-[220px] text-xs leading-snug text-red-700">{p.rejectReason}</p>}
                        {p.status === "Pending" && <p className="mt-1 text-xs text-slate-500">Submitted {formatDate(p.listedAt)}</p>}
                      </td>
                      <td className="text-right tabular-nums text-slate-700">{p.views.toLocaleString("de-DE")}</td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <Link href={`/property/${p.id}`} className={buttonClass("outline", "sm")}>
                            <Eye className="h-4 w-4" /> View
                          </Link>
                          {p.status === "Published" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-[92px]"
                              onClick={() => {
                                togglePaused(p.id);
                                toast(p.paused ? `${p.title} is live again` : `${p.title} is paused and hidden from search`, "info");
                              }}
                            >
                              {p.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                              {p.paused ? "Resume" : "Pause"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            )}
          </Panel>
        )}

        {show("enquiries") && (
          <Panel title="Enquiries">
            {myEnquiries.length === 0 ? (
              <EmptyState icon={Inbox} title="No enquiries yet" text="When tenants contact you about a listing, their messages appear here." />
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Property</th>
                    <th>Message</th>
                    <th>Received</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myEnquiries.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <p className="font-semibold text-navy">{e.name}</p>
                        <p className="text-slate-500">{e.email}</p>
                      </td>
                      <td className="max-w-[180px] truncate text-slate-700">{mineById.get(e.propertyId)?.title}</td>
                      <td>
                        <p className="line-clamp-2 max-w-[280px] text-slate-600">{e.message}</p>
                      </td>
                      <td className="whitespace-nowrap text-slate-500">{formatDate(e.createdAt, { day: "numeric", month: "short" })}</td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          {e.status === "Replied" && <span className="rounded-md bg-steel-soft px-2 py-0.5 text-xs font-semibold text-steel">Replied</span>}
                          <Button variant={e.status === "New" ? "navy" : "outline"} size="sm" onClick={() => setReplyTo(e)}>
                            <Reply className="h-4 w-4" /> Reply
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            )}
          </Panel>
        )}
      </div>

      <ReplyModal key={replyTo?.id} enquiry={replyTo} propertyTitle={replyTo ? mineById.get(replyTo.propertyId)?.title ?? "" : ""} onClose={() => setReplyTo(null)} />
    </DashboardShell>
  );
}
