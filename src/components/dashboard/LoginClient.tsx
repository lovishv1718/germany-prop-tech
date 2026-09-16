"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Shield, UserRound } from "lucide-react";
import { dashboardPath, useApp, type Role } from "@/context/AppContext";
import { DEMO_PUBLISHER, DEMO_TENANT } from "@/data/properties";
import { useToast } from "@/components/ui/Toast";
import { ButtonLink } from "@/components/ui/Button";

const ACCOUNTS: { role: Exclude<Role, "Guest">; icon: typeof UserRound; name: string; email: string; points: string[] }[] = [
  {
    role: "Tenant",
    icon: UserRound,
    name: DEMO_TENANT.name,
    email: DEMO_TENANT.email,
    points: ["Saved properties", "Enquiries and replies", "Unlocked contacts"],
  },
  {
    role: "Publisher",
    icon: KeyRound,
    name: DEMO_PUBLISHER.name,
    email: DEMO_PUBLISHER.email,
    points: ["Listings and approval status", "Add a property in 5 steps", "Reply to enquiries"],
  },
  {
    role: "Admin",
    icon: Shield,
    name: "Operations team",
    email: "ops@ulivger.com",
    points: ["Approval queue", "Revenue and payments", "Users, WhatsApp, partners, settings"],
  },
];

export default function LoginClient() {
  const { role, setRole } = useApp();
  const router = useRouter();
  const toast = useToast();

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-navy sm:text-5xl">Welcome back</h1>
        <p className="mt-4 text-lg text-slate-600">
          This prototype has three demo accounts. Pick one to sign in and open its dashboard. No password needed.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {ACCOUNTS.map(({ role: r, icon: Icon, name, email, points }) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRole(r);
              toast(`Signed in as demo ${r.toLowerCase()}`);
              router.push(dashboardPath(r));
            }}
            className={`group flex flex-col rounded-card border bg-white p-6 text-left transition hover:border-navy hover:shadow-lift ${role === r ? "border-navy" : "border-line"}`}
          >
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-btn bg-navy text-sun">
                <Icon className="h-5 w-5" />
              </span>
              {role === r && <span className="rounded-md bg-sand px-2 py-0.5 text-xs font-semibold text-navy">Signed in</span>}
            </div>
            <p className="mt-5 font-display text-2xl font-bold text-navy">{r}</p>
            <p className="mt-1 text-sm text-slate-500">
              {name} · {email}
            </p>
            <ul className="mt-5 space-y-2 border-t border-line pt-5 text-[15px] text-slate-600">
              {points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-navy">
              Continue as {r.toLowerCase()}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-3 rounded-card bg-sand p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600">Just looking? You can browse and save properties without an account.</p>
        <ButtonLink href="/search" variant="outline">
          Browse as guest
        </ButtonLink>
      </div>
    </section>
  );
}
