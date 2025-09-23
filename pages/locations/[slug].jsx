// pages/locations/[slug].jsx
import React from "react";
import SEOHead from "../../components/SEOHead";

const LOCATIONS = {
  "selden": {
    title: "Locksmith in Selden — LocksmithPro Express",
    description: "24/7 locksmith service in Selden: lockouts, rekeying, lock changes. Call +1 (912) 769-0262.",
    locality: "Selden"
  },
  "long-island": {
    title: "Locksmith in Long Island — LocksmithPro Express",
    description: "24/7 locksmith coverage across Long Island. Call +1 (912) 769-0262.",
    locality: "Long Island"
  },
  "brooklyn": {
    title: "Locksmith in Brooklyn — LocksmithPro Express",
    description: "24/7 locksmiths serving Brooklyn. Call +1 (912) 769-0262.",
    locality: "Brooklyn"
  }
};

export default function LocationPage({ slug, data }) {
  if (!data) {
    return (
      <>
        <SEOHead title="Location not found" description="Location not found" />
        <main style={{ padding: 40 }}>
          <h1>Location not found</h1>
          <p>The location you requested doesn't exist.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={data.title}
        description={data.description}
        locality={data.locality}
        url={`https://www.locksmith-pro.org/locations/${slug}`}
      />
      <main style={{ padding: 40 }}>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const slugs = Object.keys(LOCATIONS);
  return {
    paths: slugs.map(s => ({ params: { slug: s } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const data = LOCATIONS[params.slug] || null;
  return { props: { slug: params.slug, data } };
}
