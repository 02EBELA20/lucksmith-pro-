// app/page.tsx
import SEOHead from "../components/SEOHead";
import SmartHero from "../components/SmartHero";
import citiesJson from "../data/cities.json";  // ← JSON, assertion არ გვჭირდება
import { BRAND, titleTemplate } from "../lib/seo";

const cities = citiesJson as string[]; // ტიპის დასაბუთება

export const metadata = {
  title: titleTemplate(`${BRAND} — 24/7 Emergency Locksmith`),
  description:
    "Fast, reliable locksmith services across Long Island. Lockouts, rekeying, lock changes, car keys. Call now.",
};

export default function HomePage() {
  return (
    <>
      <SEOHead
        title={metadata.title as string}
        description={metadata.description as string}
      />

      <SmartHero />

      <section className="card mt-6">
        <h2 className="h2 mb-3">Areas We Serve</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {cities.map((city) => (
            <li key={city}>
              <a className="link" href={`/${city.toLowerCase().replace(/\s+/g, "-")}`}>
                {city} Locksmith
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
