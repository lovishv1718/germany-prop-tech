"use client";

import { useRouter } from "next/navigation";
import { Home, LogIn, Shield, UserRound } from "lucide-react";
import { useApp, type Role } from "@/context/AppContext";
import ComingSoon from "@/components/ComingSoon";

const DEMO_ACCOUNTS: { role: Exclude<Role, "Guest">; icon: typeof Home; hint: string }[] = [
  { role: "Tenant", icon: UserRound, hint: "Search, save and enquire" },
  { role: "Publisher", icon: Home, hint: "List and manage properties" },
  { role: "Admin", icon: Shield, hint: "Review and moderate listings" },
];

export default function LoginPage() {
  const { role, setRole } = useApp();
  const router = useRouter();

  return (
    <ComingSoon
      icon={LogIn}
      eyebrow="Login"
      title="Sign in to the demo"
      description="No password needed. Pick an account type to explore the prototype from that point of view."
      planned={[
        "Email and password sign-in screen",
        "Registration for tenants and publishers",
        "Role-based dashboards",
        "Sign out from the header",
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {DEMO_ACCOUNTS.map(({ role: r, icon: Icon, hint }) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRole(r);
              router.push("/");
            }}
            className={`rounded-card border bg-white p-6 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift ${
              role === r ? "border-navy" : "border-line"
            }`}
          >
            <span className="grid h-10 w-10 place-items-center rounded-btn bg-navy text-sun">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-semibold text-navy">Continue as {r}</p>
            <p className="text-sm text-slate-500">{hint}</p>
          </button>
        ))}
      </div>
    </ComingSoon>
  );
}
