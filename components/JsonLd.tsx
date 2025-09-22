export default function JsonLd({
    city,
    url
  }: {
    city?: string;
    url: string;
  }) {
    const data: any = {
      "@context": "https://schema.org",
      "@type": city ? "LocalBusiness" : "Organization",
      name: "LocksmithPro Express",
      url,
      telephone: process.env.NEXT_PUBLIC_PHONE_DISPLAY,
      sameAs: [],
      description:
        city
          ? `24/7 locksmith services in ${city}: car & house lockouts, rekey, lock change, key replacement.`
          : "24/7 emergency locksmith — car & house lockouts, rekeying, lock change, key replacement.",
      areaServed: city || undefined,
      openingHours: ["Mo-Su 00:00-23:59"],
      priceRange: "$$"
    };
  
    return (
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
    );
  }
  