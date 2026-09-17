import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "@/components/dashboard/LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to UFT Living Germany as a tenant, publisher or administrator to explore the prototype dashboards.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto h-[70vh] max-w-5xl" />}>
      <LoginClient />
    </Suspense>
  );
}
