// filename: app/[city]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata, BRAND, PHONE_DISPLAY, PHONE_E164 } from '../../lib/seo';
import JsonLd from '../../components/JsonLd';
import IntakeForm from '../../components/IntakeForm';
import fs from 'fs'; // <- დავამატეთ fs
import path from 'path'; // <- დავამატეთ path

// --- START OF FIX ---
// JSON ფაილის წაკითხვა საიმედო გზით
const citiesFilePath = path.join(process.cwd(), 'data', 'cities.json');
const citiesJson = fs.readFileSync(citiesFilePath, 'utf8');
const cities: { slug: string, name: string }[] = JSON.parse(citiesJson);
// --- END OF FIX ---

const getCityBySlug = (slug: string) => cities.find(c => c.slug === slug);

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  const cityName = city ? city.name : params.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const title = `${cityName} Locksmith - 24/7 Emergency Service | ${BRAND}`;
  const description = `Need a locksmith in ${cityName}, NY? ${BRAND} offers fast 24/7 car, home, and business lockout services. Call ${PHONE_DISPLAY} for immediate help in ${cityName}!`;
  const canonicalPath = `/${params.city}`;
  
  return generatePageMetadata(title, description, canonicalPath);
}

export const dynamicParams = false;

export default function CityPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city);
  const cityName = city!.name;

  return (
    <>
      <JsonLd city={cityName} />
      
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Your Local Locksmith in <span className="text-cyan-300">{cityName}, NY</span>
        </h1>
        <p className="mt-3 text-lg text-slate-300 max-w-3xl mx-auto">
          Locked out of your car, home, or office in {cityName}? Our expert mobile locksmiths provide fast, reliable 24/7 emergency services right to your location.
        </p>
        <div className="mt-8">
            <a href={`tel:${PHONE_E164}`} className="btn btn-primary text-lg">
              Call Now for Help in {cityName}
            </a>
        </div>
      </section>
      
      <section className="mt-12">
        <div className="rounded-2xl card-dark p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Services in {cityName}</h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <h3 className="font-semibold text-lg text-cyan-300">Emergency Car Lockout</h3>
              <p>Keys locked in your car? We provide damage-free unlocking services for all vehicle makes and models throughout {cityName}.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-cyan-300">Residential Locksmith</h3>
              <p>From house lockouts to lock changes and rekeying, we ensure your {cityName} home is secure.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-cyan-300">Commercial Locksmith</h3>
              <p>Protect your business with high-security locks, master key systems, and emergency access services for your {cityName} office or storefront.</p>
            </div>
             <div>
              <h3 className="font-semibold text-lg text-cyan-300">24/7 Availability</h3>
              <p>We are available around the clock. Day or night, you can count on us for any lock-related emergency in {cityName}.</p>
            </div>
          </div>
        </div>
      </section>

       <section id="request" className="mx-auto w-full max-w-5xl mt-12 scroll-mt-20">
        <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Get a Quote for {cityName}</h2>
          <IntakeForm initialCity={cityName} />
        </div>
      </section>

      <section className="mt-12 text-center">
          <Link href="/" className="text-cyan-300 hover:underline">
            &larr; Back to all service areas
          </Link>
      </section>
    </>
  );
}