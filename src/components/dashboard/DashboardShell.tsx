"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { KeyRound, Shield, UserRound } from "lucide-react";
import { useApp, type Role } from "@/context/AppContext";
import { DEMO_PUBLISHER, DEMO_TENANT } from "@/data/properties";
import { useHydrated } from "@/lib/useHydrated";
import { Button } from "@/components/ui/Button";

export interface DashNavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
}

const ROLE_PROFILE: Record<Exclude<Role, "Guest">, { name: string; detail: string; icon: LucideIcon; description: string }> = {
  Tenant: { name: DEMO_TENANT.name, detail: "Tenant account", icon: UserRound, description: "Saved properties, enquiries and unlocked contacts." },
  Publisher: { name: DEMO_PUBLISHER.name, detail: "Verified landlord", icon: KeyRound, description: "Listings, approvals and enquiries from tenants." },
  Admin: { name: "Operations team", detail: "Administrator", icon: Shield, description: "Approvals, revenue, users, partners and settings." },
};

function RoleGate({ role, children }: { role: Exclude<Role, "Guest">; children: React.ReactNode }) {
  const app = useApp();
  const hydrated = useHydrated();

  if (!hydrated) return <div className="mx-auto h-[60vh] max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8" />;
  if (app.role === role) return <>{children}</>;

  const { icon: Icon, description } = ROLE_PROFILE[role];
  return (
    <div className="mx-auto max-w-lg px-4 py-20 sm:py-28">
      <div className="rounded-card border border-line bg-white p-8 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy text-sun">
          <Icon className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-navy">This is the {role.toLowerCase()} dashboard</h1>
        <p className="mt-2 text-slate-600">
          You are viewing the prototype as <span className="font-semibold text-navy">{app.role}</span>. {description}
        </p>
        <Button variant="primary" size="lg" className="mt-6 w-full" onClick={() => app.setRole(role)}>
          Continue as demo {role.toLowerCase()}
        </Button>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium text-slate-500 hover:text-navy">
          Choose a different account
        </Link>
      </div>
    </div>
  );
}

interface DashboardShellProps {
  role: Exclude<Role, "Guest">;
  nav: DashNavItem[];
  active: string;
  onSelect?: (key: string) => void;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardShell({ role, nav, active, onSelect, title, subtitle, actions, children }: DashboardShellProps) {
  const profile = ROLE_PROFILE[role];

  const itemClass = (key: string) =>
    `flex shrink-0 items-center gap-2.5 rounded-btn px-3 py-2.5 text-[15px] font-medium transition-colors whitespace-nowrap ${
      active === key ? "bg-navy text-white" : "text-slate-600 hover:bg-sand hover:text-navy"
    }`;

  return (
    <RoleGate role={role}>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 pt-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:gap-10 lg:px-8 lg:pt-10">
        <aside className="min-w-0">
          <div className="lg:sticky lg:top-24">
            <div className="hidden items-center gap-3 border-b border-line pb-5 lg:flex">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy text-sun">
                <profile.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy">{profile.name}</p>
                <p className="text-sm text-slate-500">{profile.detail}</p>
              </div>
            </div>
            <nav aria-label={`${role} dashboard`} className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:mt-4 lg:flex-col lg:overflow-visible lg:px-0">
              {nav.map(({ key, label, icon: Icon, href, badge }) => {
                const content = (
                  <>
                    <Icon className="h-[18px] w-[18px]" />
                    <span className="flex-1">{label}</span>
                    {badge ? (
                      <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs font-semibold ${active === key ? "bg-sun text-navy" : "bg-sand text-navy"}`}>
                        {badge}
                      </span>
                    ) : null}
                  </>
                );
                return href ? (
                  <Link key={key} href={href} className={itemClass(key)}>
                    {content}
                  </Link>
                ) : (
                  <button key={key} type="button" onClick={() => onSelect?.(key)} aria-current={active === key ? "page" : undefined} className={itemClass(key)}>
                    {content}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy sm:text-4xl">{title}</h1>
              {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </div>
    </RoleGate>
  );
}

export function StatCard({ label, value, detail, icon: Icon }: { label: string; value: React.ReactNode; detail?: React.ReactNode; icon: LucideIcon }) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <Icon className="h-[18px] w-[18px] text-slate-400" />
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight text-navy">{value}</p>
      {detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-card border border-line bg-white ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 className="font-display text-lg font-bold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <Icon className="h-9 w-9 text-slate-300" strokeWidth={1.6} />
      <p className="mt-3 font-semibold text-navy">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Horizontal scroll container so wide tables never cause page-level overflow on phones. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm [&_td]:px-5 [&_td]:py-3.5 [&_td]:align-middle [&_th]:px-5 [&_th]:py-3 [&_th]:font-medium [&_th]:text-slate-500 [&_thead]:bg-sand/60 [&_tbody_tr]:border-t [&_tbody_tr]:border-line">
        {children}
      </table>
    </div>
  );
}
