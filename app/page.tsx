// app/page.tsx
import Link from "next/link";
import SEOHead from "../components/SEOHead";
import IntakeForm from "../components/IntakeForm";
import { BRAND, DEFAULT_DESC, PHONE_E164, titleTemplate } from "../lib/seo";
import cities from "../data/cities.json"; // <- მარტივი import, assert აღარ არის

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

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
            LocksmithPro Express — <span className="text-cyan-300">Near you</span>
          </h1>
          <p className="mt-2 text-slate-300">
            Fast, reliable 24/7 locksmith. Tap the form below — we’ll auto-fill your
            location and call you back in minutes.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${PHONE_E164}`} className="btn btn-primary">
              Call {PHONE_E164.replace("+1", "+1 ")}
            </a>
            <a href="#request" className="btn">Request Service</a>
          </div>
        </div>
      </section>

      {/* Request Service – მთავარზე პირდაპირ */}
      <section id="request" className="mx-auto w-full max-w-5xl px-4 sm:px-6 mt-8">
        <div className="rounded-2xl bg-white shadow-lg border border-slate-200 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Request Service</h2>
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
            {cities.map((c: string) => (
              <Link key={c} href={`/${slug(c)}`} className="hover:underline">
                {c} Locksmith
              </Link>
            ))}
          </div>
        </details>
      </section>
    </>
  );
}
