import type { Metadata } from "next";
import LoginClient from "@/components/dashboard/LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to UFT Living Germany as a tenant, publisher or administrator to explore the prototype dashboards.",
};

export default function LoginPage() {
  return <LoginClient />;
}
