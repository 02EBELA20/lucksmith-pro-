// app/page.tsx
import Link from "next/link";
import cities from "../data/cities.json" assert { type: "json" };
import { BRAND, PHONE_E164, PHONE_DISPLAY } from "../lib/seo";

function slugify(city: string) {
  return city.toLowerCase().replace(/\s+/g, "-");
}

export const dynamic = "force-static"; // უსაფრთხოდ დაიპრერენდეროს

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-10">
      {/* Hero */}
      <section className="rounded-2xl bg-slate-800/60 text-white p-6 sm:p-8 shadow">
        <h1 className="text-3xl sm:text-4xl font-bold">
          {BRAND} — <span className="text-cyan-400">Near you</span>
        </h1>
        <p className="mt-2 text-slate-300">
          Fast, reliable 24/7 locksmith service. Tap to call or open your local
          page and send a request.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`tel:${PHONE_E164}`} className="btn btn-primary">
            Call {PHONE_DISPLAY}
          </a>
          <Link href="/selden" className="btn">
            Open Selden page
          </Link>
        </div>
      </section>

      {/* Areas we serve */}
      <section className="mt-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Areas We Serve</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6">
          {cities.map((name: string) => (
            <Link
              key={name}
              href={`/${slugify(name)}`}
              className="text-slate-700 hover:text-slate-900 hover:underline"
            >
              {name} Locksmith
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
