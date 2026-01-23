import IntakeForm from "../../components/IntakeForm";
import JsonLd from "../../components/JsonLd";
import SEOHead from "../../components/SEOHead";
import CallButton from "../../components/CallButton";
import Link from "next/link";
import { BRAND, PHONE_DISPLAY, PHONE_E164, SITE_URL, titleTemplate } from "../../lib/seo";
import cities from "../../data/cities.json" assert { type: "json" };

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const human = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const dynamicParams = false;        // მხოლოდ გენერირებული ქალაქები
export const revalidate = 60 * 60 * 24;    // ISR: 24სთ

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}


const FAQ = [
  { q: "How fast can you arrive?", a: "We usually arrive within 20–30 minutes in typical traffic." },
  { q: "Do you replace or rekey locks?", a: "We do both. Rekey when hardware is fine; replace when damaged or for upgrades." },
  { q: "Can you make car keys if I lost all keys?", a: "Yes. We cut and program many car keys on-site. Availability depends on make/model/year." },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const slugCity = params.city;
  const niceCity = human(slugCity);
  const telHref = `tel:${PHONE_E164}`;
  const pageUrl = `${SITE_URL}/${slugCity}`;

  return (
    <div className="space-y-10">
      <SEOHead
        title={titleTemplate(`${BRAND} in ${niceCity}`)}
        description={`24/7 locksmith in ${niceCity}. Car & house lockouts, rekey, lock change, car keys. Call ${PHONE_DISPLAY}.`}
        url={pageUrl}
        phone={PHONE_DISPLAY}
        locality={niceCity}
        region="NY"
      />
      <JsonLd city={niceCity} url={pageUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <nav className="text-sm">
        <Link href="/" className="link">← Back to Home</Link>
      </nav>

      <section className="card-dark p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          {BRAND} in <span className="text-cyan-300">{niceCity}</span>
        </h1>
        <p className="mt-2 text-white/80">
          Fast, reliable locksmith services available 24/7 in {niceCity}. Call for lockouts, rekeying, lock changes, and car keys.
        </p>
        <CallButton href={telHref} className="btn btn-primary mt-5">
          Call {PHONE_DISPLAY}
        </CallButton>
      </section>

      <section className="card p-8">
        <h2 className="text-xl font-bold text-slate-900">Locksmith Services in {niceCity}</h2>
        <ul className="mt-3 grid gap-2 text-slate-800 text-sm md:grid-cols-2">
          <li>• House & Apartment Lockout</li>
          <li>• Car Lockout (all makes & models)</li>
          <li>• Lock Rekeying</li>
          <li>• Lock Replacement & Installation</li>
          <li>• Car Key Replacement & Programming</li>
          <li>• Commercial / Storefront Locks</li>
        </ul>
      </section>

      <section className="card p-8">
        <h2 className="text-xl font-bold text-slate-900">Local Coverage</h2>
        <p className="text-slate-700 text-sm">
          We serve neighborhoods around {niceCity}, including nearby roads and landmarks.
          In most cases we can arrive within 20–30 minutes.
        </p>
      </section>

      <section id="request" className="card p-8">
        <h2 className="text-xl font-bold text-slate-900">Request Service</h2>
        <p className="text-sm muted">Leave your info — we’ll call you back in minutes.</p>
        <IntakeForm initialCity={niceCity} />
      </section>
    </div>
  );
}
