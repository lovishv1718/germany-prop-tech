import { BadgeCheck, Building2, FileText, MapPin, ShieldCheck, Star, UsersRound } from "lucide-react";
import HeroSearch from "./HeroSearch";
import { LiveListingCount } from "./HomeSections";
import Photo from "@/components/ui/Photo";
import { Highlight, ScriptNote, SketchArrow, Swoosh } from "@/components/ui/Scribble";
import { HERO_BACK_IMAGE, HERO_IMAGE, RATING_AVATARS, TESTIMONIAL_AVATAR } from "@/data/properties";

const TRUST = [
  { icon: ShieldCheck, title: "Verified listings", text: "Real people, real properties" },
  { icon: UsersRound, title: "Trusted landlords", text: "Agents and private owners" },
  { icon: Building2, title: "6 major cities", text: "Berlin, Munich and more" },
  { icon: FileText, title: "Transparent process", text: "No hidden fees" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-12 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.08fr] lg:gap-8">
          {/* Copy */}
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="inline-flex items-center gap-2 rounded-full bg-verified-soft px-3.5 py-1.5 text-sm font-medium text-[#0b7a6e]">
                <BadgeCheck className="h-4 w-4 fill-verified text-white" />
                <span>
                  <LiveListingCount /> verified listings live today
                </span>
              </p>
              <div className="hidden items-start gap-1.5 text-slate-500 sm:flex">
                <SketchArrow className="mt-1 h-7 w-12" />
                <ScriptNote className="text-[21px]">
                  Verified homes.
                  <br />
                  Safer stays.
                </ScriptNote>
              </div>
            </div>

            <h1 className="mt-6 text-[48px] font-extrabold leading-[0.98] tracking-[-0.035em] text-navy sm:text-[68px] lg:text-[76px] xl:text-[84px]">
              Find your
              <br />
              next place
              <br />
              in <Highlight>Germany</Highlight>
            </h1>
            <p className="mt-6 max-w-[480px] text-lg leading-relaxed text-slate-600 sm:text-[19px]">
              Apartments, houses, rooms and commercial spaces from verified landlords, agents and flatmates in six cities.
            </p>
          </div>

          {/* Photo composition */}
          <div className="relative mx-auto w-full max-w-[640px] pb-10 lg:max-w-none lg:pb-6">
            <div className="absolute -left-4 top-8 bottom-0 hidden w-[42%] overflow-hidden rounded-[18px] sm:block lg:-left-6" aria-hidden="true">
              <Photo src={HERO_BACK_IMAGE} alt="" className="h-full w-full opacity-90 saturate-[0.85]" />
              <div className="absolute inset-0 bg-canvas/35" />
            </div>

            <div className="relative ml-auto aspect-[4/3] w-full overflow-hidden rounded-[18px] shadow-float sm:w-[92%] lg:aspect-[16/11]">
              <Photo src={HERO_IMAGE} alt="Sunlit living room with plants and a city view" eager className="h-full w-full" />
              <div className="absolute bottom-4 right-4 hidden text-right text-white drop-shadow-[0_2px_6px_rgb(0_0_0_/_0.55)] sm:block">
                <ScriptNote className="text-[26px] -rotate-6">
                  More than
                  <br />
                  just a place.
                  <br />
                  A new chapter.
                </ScriptNote>
                <Swoosh className="ml-auto mt-0.5 h-2.5 w-24 -rotate-6" />
              </div>
            </div>

            <div className="absolute right-3 top-6 flex items-center gap-2.5 rounded-card bg-white/95 px-3.5 py-2.5 shadow-float backdrop-blur sm:right-6 sm:top-10">
              <MapPin className="h-5 w-5 fill-navy text-white" />
              <div>
                <p className="text-sm font-semibold text-navy">Berlin</p>
                <p className="text-xs text-slate-500">Live. Work. Belong.</p>
              </div>
            </div>

            <figure className="absolute bottom-0 left-2 flex max-w-[290px] items-start gap-3 rounded-card bg-white p-3.5 shadow-float sm:left-4 lg:-left-2 lg:bottom-2">
              <Photo src={TESTIMONIAL_AVATAR} alt="Katrin H." className="h-11 w-11 shrink-0 rounded-full" />
              <div className="min-w-0">
                <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-navy">Katrin H.</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0b7a6e]">
                    <BadgeCheck className="h-3.5 w-3.5 fill-verified text-white" /> Verified landlord
                  </span>
                </figcaption>
                <blockquote className="mt-0.5 text-sm leading-snug text-slate-700">&ldquo;Found a tenant in 6 days through UFT Living!&rdquo;</blockquote>
                <p className="mt-0.5 text-xs text-slate-500">Berlin</p>
              </div>
            </figure>
          </div>
        </div>

        <div className="relative z-10 mt-8 lg:mt-4">
          <HeroSearch />
        </div>

        {/* Trust strip */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4 lg:gap-x-3">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3">
                <Icon className="h-7 w-7 shrink-0 text-navy" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-tight text-navy">{title}</p>
                  <p className="text-[13px] leading-snug text-slate-500">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 border-line lg:border-l lg:pl-7">
            <div className="flex -space-x-3">
              {RATING_AVATARS.map((src) => (
                <Photo key={src} src={src} alt="" className="h-10 w-10 rounded-full ring-2 ring-canvas" />
              ))}
            </div>
            <div>
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sun text-sun" />
                ))}
              </div>
              <p className="mt-0.5 text-sm text-slate-600">
                <span className="font-semibold text-navy">4.8/5</span> from 500+ happy tenants
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
