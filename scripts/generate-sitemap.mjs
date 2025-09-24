// scripts/generate-sitemap.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load cities.json
const citiesPath = resolve(__dirname, "../data/cities.json");
const cities = JSON.parse(readFileSync(citiesPath, "utf8"));

// SITE_URL env-დან (Vercel-ზე იქნება), ლოკალურად დეფოლტი:
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.locksmith-pro.org";

const slug = (c) => c.toLowerCase().replace(/\s+/g, "-");

function url(loc) {
  const lastmod = new Date().toISOString();
  return `
  <url>
    <loc>${loc}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

const staticUrls = [`${SITE_URL}/`];
const cityUrls = (cities ?? []).map((c) => `${SITE_URL}/${slug(c)}`);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...cityUrls].map(url).join("\n")}
</urlset>`.trim();

const out = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(out, xml, "utf-8");
console.log(`✅ sitemap.xml generated (${staticUrls.length + cityUrls.length} URLs) → ${out}`);
