"use client";

import IntakeForm from "../../components/IntakeForm";
import JsonLd from "../../components/JsonLd";
import { BRAND, PHONE_DISPLAY, PHONE_E164, SITE_URL } from "../../lib/seo";

export default function CityPage({ params }: { params: { city: string } }) {
  const niceCity = params.city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const telHref = `tel:${PHONE_E164}`;

  return (
    <div className="space-y-10">
      <JsonLd city={niceCity} url={`${SITE_URL}/${params.city}`} />

      <section className="card-dark p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          {BRAND} in <span className="text-cyan-300">{niceCity}</span>
        </h1>
        <p className="mt-2 text-white/80">
          Fast, reliable locksmith services available 24/7 in {niceCity}. Call for lockouts, rekeying, lock changes, and car keys.
        </p>
        <a href={telHref} className="btn btn-primary mt-5">Call {PHONE_DISPLAY}</a>
      </section>

      <section className="card p-8">
        <h2 className="text-xl font-bold text-slate-900">Request Service</h2>
        <p className="text-sm muted">Leave your info — we’ll call you back in minutes.</p>
        <IntakeForm initialCity={niceCity} />
      </section>
    </div>
  );
}
