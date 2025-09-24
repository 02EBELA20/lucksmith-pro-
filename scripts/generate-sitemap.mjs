// scripts/generate-sitemap.mjs
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import cities from "../data/cities.json" assert { type: "json" };
import { SITE_URL } from "../lib/seo.js";

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

const out = resolve(process.cwd(), "public", "sitemap.xml");
writeFileSync(out, xml, "utf-8");
console.log(`✅ sitemap.xml generated (${staticUrls.length + cityUrls.length} URLs) → ${out}`);
