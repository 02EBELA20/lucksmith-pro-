// app/page.tsx
import Link from "next/link";
import SEOHead from "../components/SEOHead";
import IntakeForm from "../components/IntakeForm";
import { BRAND, DEFAULT_DESC, PHONE_E164, titleTemplate } from "../lib/seo";
import citiesRaw from "../data/cities.json";

// 1) robust slugger (never crashes)
const slugify = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

// 2) normalize cities.json to string[]
function normalizeCities(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  // case A: ["Great Neck", "Jamaica", ...]
  if (input.every((x) => typeof x === "string")) return input as string[];

  // case B: [{name:"..."}, {city:"..."}, ...]
  return input
    .map((item: any) => item?.name ?? item?.city ?? item?.label ?? item?.title ?? item?.town ?? item?.slug)
    .filter((v: any) => typeof v === "string" && v.trim().length > 0) as string[];
}

const cities = normalizeCities(citiesRaw);

export default function HomePage() {
  return (
    <>
      <SEOHead
        title={titleTemplate(`${BRAND} — Near you`)}
        description={DEFAULT_DESC}
        phone={PHONE_E164}
      />

      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 mt-8">
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700 px-6 py-8 sm:px-8 sm:py-10 text-white shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {BRAND} — <span className="text-cyan-300">Near you</span>
          </h1>

          <p className="mt-2 text-slate-300">
            Fast, reliable 24/7 locksmith. Tap the form below — we’ll auto-fill your
            location and call you back in minutes.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${PHONE_E164}`} className="btn btn-primary">
              Call {PHONE_E164.replace("+1", "+1 ")}
            </a>
            <a href="#request" className="btn">
              Request Service
            </a>
          </div>
        </div>
      </section>

      {/* Request Service – მთავარზე პირდაპირ */}
      <section id="request" className="mx-auto w-full max-w-5xl px-4 sm:px-6 mt-8">
        <div className="rounded-2xl bg-white shadow-lg border border-slate-200 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">
            Request Service
          </h2>
          <IntakeForm />
        </div>
      </section>

      {/* Areas We Serve – ქვემოთ, ჩამხსნელი */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 mt-10 mb-14">
        <details className="rounded-2xl bg-slate-100 border border-slate-200 p-4 sm:p-6">
          <summary className="cursor-pointer text-slate-800 font-semibold">
            Areas We Serve
          </summary>

          <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-slate-700">
            {cities.map((city) => {
              const path = `/${slugify(city)}`;
              return (
                <Link key={path} href={path} className="hover:underline">
                  {city} Locksmith
                </Link>
              );
            })}
          </div>

          {cities.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No cities loaded. Check <code>data/cities.json</code> format.
            </p>
          ) : null}
        </details>
      </section>
    </>
  );
}
