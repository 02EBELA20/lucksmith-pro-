// components/SEOHead.jsx
import React from "react";
import Head from "next/head";
import { BRAND } from "../lib/seo";

export default function SEOHead({
  title = `${BRAND} — 24/7 Locksmith`,
  description = "Fast 24/7 locksmith services. Call now.",
  url = "https://www.locksmith-pro.org",
  image = `${url}/og-image.jpg`,
  phone,
  street = "Service area",
  locality = "Brooklyn",
  region = "NY",
  postalCode = "11784",
  country = "US",
  latitude = 40.8215,
  longitude = -73.0558,
  geoRadiusMeters = 72420
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND,
    url,
    logo: `${url}/logo.png`,
    image,
    telephone: phone || undefined,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: locality,
      addressRegion: region,
      postalCode,
      addressCountry: country
    },
    openingHours: "Mo-Su 00:00-23:59",
    sameAs: [],
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude,
        longitude
      },
      geoRadius: geoRadiusMeters
    }
  };

  return (
    <Head>
      <meta charSet="utf-8" />
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="robots" content="index, follow" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}
