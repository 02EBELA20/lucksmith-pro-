import { MetadataRoute } from 'next'
import cities from '../data/cities.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locksmith-pro.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const cityUrls = cities.map((city) => ({
    url: `${SITE_URL}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...cityUrls,
  ]
}