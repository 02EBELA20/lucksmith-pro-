import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.locksmith-pro.org";
const cities = JSON.parse(
  readFileSync(resolve(process.cwd(), "data", "cities.json"), "utf-8")
);

const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

function url(loc) {
  return `
  <url>
    <loc>${loc}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`;
}

const staticUrls = [`${SITE_URL}/`, `${SITE_URL}/thanks`];
const cityUrls = cities.map((c) => `${SITE_URL}/${slug(c)}`);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...cityUrls].map(url).join("\n")}
</urlset>`.trim();

const out = resolve(process.cwd(), "public", "sitemap.xml");
writeFileSync(out, xml, "utf-8");
console.log(`✅ sitemap.xml generated → ${out} (${staticUrls.length + cityUrls.length} urls)`);
