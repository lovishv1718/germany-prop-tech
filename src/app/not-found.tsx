import Link from "next/link";
import { ArrowLeft, MapPinOff, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-accent-dark">
        <MapPinOff className="h-7 w-7" />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-accent-dark">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">This address doesn&apos;t exist</h1>
      <p className="mt-4 text-slate-600">The page may have moved, or the listing is no longer available.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 font-semibold text-white shadow-soft hover:bg-navy-light"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 font-semibold text-navy hover:bg-slate-50"
        >
          <Search className="h-4 w-4" /> Search properties
        </Link>
      </div>
    </section>
  );
}
