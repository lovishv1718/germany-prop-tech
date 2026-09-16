import { ArrowLeft, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <p className="font-display text-7xl font-extrabold tracking-tight text-sun sm:text-8xl">404</p>
      <h1 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">This address doesn&apos;t exist</h1>
      <p className="mt-4 text-lg text-slate-600">The page may have moved, or the listing is no longer available.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" variant="navy">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </ButtonLink>
        <ButtonLink href="/search" variant="outline">
          <Search className="h-4 w-4" /> Search properties
        </ButtonLink>
      </div>
    </section>
  );
}
