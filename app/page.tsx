"use client";

import React from "react";
import IntakeForm from "../components/IntakeForm";
import JsonLd from "../components/JsonLd";
import SEOHead from "../components/SEOHead";
import { BRAND, PHONE_DISPLAY, PHONE_E164, SITE_URL } from "../lib/seo";

export default function HomePage() {
  // fallback-ები — თუ .env-ში არ გაქვს მნიშვნელობები
  const phoneE164 = PHONE_E164 || "+19127690262";
  const phoneDisplay = PHONE_DISPLAY || "+1 (912) 769-0262";
  const telHref = `tel:${phoneE164}`;

  return (
    <>
      {/* SEO meta + structured data */}
      <SEOHead
        title="LocksmithPro Express — Brooklyn & NY — 24/7 Locksmith"
        description="LocksmithPro Express — fast, reliable 24/7 locksmith service in Brooklyn & NY. Call for lockouts, rekeying, lock change, and car keys."
        url={SITE_URL}
        phone={phoneDisplay}
        locality="Brooklyn"
        region="NY"
      />

      <div className="space-y-6 sm:space-y-8">
        <JsonLd url={SITE_URL} />

        {/* HERO */}
        <section className="card-dark p-5 sm:p-8 shadow-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
            {BRAND} — <span className="text-cyan-300">Brooklyn &amp; NY</span>
          </h1>

          <p className="mt-2 text-white/80 text-sm sm:text-base">
            Fast, reliable locksmith services available 24/7 in Brooklyn &amp; NY.
            Call for lockouts, rekeying, lock changes, and car keys.
          </p>

          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-3">
            <a href={telHref} className="btn btn-primary w-full sm:w-auto" aria-label={`Call ${phoneDisplay}`}>
              Call {phoneDisplay}
            </a>

            <a href="#request" className="btn btn-ghost w-full sm:w-auto">Request Service</a>
          </div>
        </section>

        {/* WHY US */}
        <section className="card p-5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Why Choose {BRAND}?</h2>
          <ul className="mt-3 sm:mt-4 grid gap-2 sm:gap-3 text-slate-800 text-sm sm:text-base md:grid-cols-2">
            <li>🚪 <strong>24/7 Emergency</strong> — Always open, always ready.</li>
            <li>🔑 <strong>Car, Home & Commercial</strong> — Any lock, any time.</li>
            <li>⚡ <strong>Fast Response</strong> — We arrive within minutes.</li>
            <li>🛠️ <strong>Licensed Professionals</strong> — Trusted locksmiths.</li>
            <li>💲 <strong>Upfront Pricing</strong> — No hidden fees.</li>
          </ul>
        </section>

        {/* SERVICES */}
        <section className="card p-5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Our Locksmith Services</h2>
          <div className="mt-3 sm:mt-4 grid gap-2 text-slate-800 text-sm sm:text-base md:grid-cols-2">
            <div>• Car Lockout Service</div>
            <div>• House Lockout Service</div>
            <div>• Lock Rekeying</div>
            <div>• Lock Replacement & Installation</div>
            <div>• Car Key Replacement & Programming</div>
            <div>• Commercial Locksmith Services</div>
          </div>
        </section>

        {/* FORM */}
        <section id="request" className="card p-5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Request Service</h2>
          <p className="text-xs sm:text-sm text-slate-600">Leave your info — we’ll call you back in minutes.</p>
          <IntakeForm />
        </section>
      </div>
    </>
  );
}
