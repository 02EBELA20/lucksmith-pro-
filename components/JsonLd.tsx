type Props = { city: string; url: string };

export default function JsonLd({ city, url }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Emergency Locksmith",
    areaServed: `${city}, NY`,
    url
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
