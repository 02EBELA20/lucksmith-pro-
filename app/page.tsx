// filename: app/page.tsx
import Link from "next/link";
import IntakeForm from "../components/IntakeForm";
import JsonLd from "../components/JsonLd";
import SmartHero from "../components/SmartHero";
import fs from 'fs'; // <- დავამატეთ fs
import path from 'path'; // <- დავამატეთ path

// --- START OF FIX ---
// უფრო საიმედო გზა JSON ფაილის წასაკითხად სერვერულ კომპონენტში
const citiesFilePath = path.join(process.cwd(), 'data', 'cities.json');
const citiesJson = fs.readFileSync(citiesFilePath, 'utf8');
const cities = JSON.parse(citiesJson);
// --- END OF FIX ---

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <SmartHero />

      <section id="request" className="mx-auto w-full max-w-5xl mt-12 scroll-mt-20">
        <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Request Service Online</h2>
          <p className="text-slate-600 mb-4">For non-emergencies or to schedule a service, fill out the form below. For immediate help, please call us directly.</p>
          <IntakeForm />
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl mt-12 mb-10">
        <div className="rounded-2xl card-dark p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">Serving Communities Across Long Island</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3 text-white/90">
                {cities.map((city: { slug: string, name: string }) => (
                <Link key={city.slug} href={`/${city.slug}`} className="hover:underline hover:text-cyan-300 transition-colors">
                    {city.name}
                </Link>
                ))}
            </div>
        </div>
      </section>
    </>
  );
}