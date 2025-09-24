import SEOHead from "../components/SEOHead";
import SmartHero from "../components/SmartHero";
import { CITIES } from "../lib/seo"; // თუ city-ების სია lib-ში გქონდეს, შეგიძლია აქედანაც გამოიტანო
import cities from "../data/cities.json" assert { type: "json" };
import { BRAND, titleTemplate } from "../lib/seo";

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default function HomePage() {
  // იყენე data/cities.json, ან თუ გინდა, SEO lib-იდანაც შეგიძლია
  const ALL = (cities as string[]);

  return (
    <main className="space-y-10">
      <SEOHead
        title={titleTemplate("24/7 Emergency Locksmith — Long Island")}
        description="Fast, reliable locksmith services available 24/7 across Long Island. One tap to use your location and request service."
      />

      <SmartHero />

      <section className="card p-8">
        <h2 className="text-xl font-bold text-slate-900">Why Choose {BRAND}?</h2>
        <ul className="mt-3 grid gap-2 text-slate-800 text-sm md:grid-cols-2">
          <li>• 24/7 Emergency — Always open, always ready.</li>
          <li>• Fast Response — We arrive within minutes.</li>
          <li>• Licensed Professionals — Trusted locksmiths.</li>
          <li>• Car, Home & Commercial — Any lock, any time.</li>
        </ul>
      </section>

      <section id="areas" className="card p-8">
        <h2 className="text-xl font-bold text-slate-900">Areas We Serve</h2>
        <ul className="mt-3 grid gap-2 text-slate-700 text-sm md:grid-cols-3">
          {ALL.map((c) => (
            <li key={c}>
              <a className="link" href={`/${slug(c)}#request`}>{c} Locksmith</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
