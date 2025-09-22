// components/SEOHead.jsx
import Head from "next/head";
import React from "react";

/**
 * SEOHead - JSON-LD for LocalBusiness + meta tags
 *
 * Edit the values below (phone, address, coords, url, image) to match your real data.
 * After saving: git add/commit/push -> Vercel will rebuild and you can validate JSON-LD
 */

export default function SEOHead({
  title = "LocksmithPro Express in Long Island (Brooklyn & NY) — 24/7 Locksmith",
  description = "LocksmithPro Express — Fast 24/7 locksmith services across Long Island: house lockouts, rekeying, lock change, car keys. Call +1 (912) 769-0262 for immediate service.",
  url = "https://www.locksmith-pro.org",            // use the version you want indexed (www preferred if that's set)
  image = "https://www.locksmith-pro.org/og-image.jpg", // make sure this file exists in /public
  phone = "+1-912-769-0262",
  street = "Your street address or Service Area",
  locality = "Selden",
  region = "NY",
  postalCode = "11784",
  country = "US",
  latitude = 40.8215,    // change to exact coords if needed
  longitude = -73.0558,  // change to exact coords if needed
  geoRadiusMeters = 72420 // ~45 miles in meters
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness`,
    "name": "LocksmithPro Express",
    "url": url,
    "logo": `${url}/logo.png`,       // ensure /public/logo.png exists
    "image": image,
    "telephone": phone,
    "priceRange": "$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": street,
      "addressLocality": locality,
      "addressRegion": region,
      "postalCode": postalCode,
      "addressCountry": country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": latitude,
        "longitude": longitude
      },
      "geoRadius": geoRadiusMeters
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/yourpage",
      "https://www.instagram.com/yourpage"
      // add other profiles (Google Business is separate)
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Locksmith Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "House lockout" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Car locksmith / car keys" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Rekeying" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Lock replacement" } }
      ]
    }
  };

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>

      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      {/* If you have site_name */}
      <meta property="og:site_name" content="LocksmithPro Express" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="robots" content="index, follow" />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}
