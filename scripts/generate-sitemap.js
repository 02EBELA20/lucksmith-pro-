// scripts/generate-sitemap.js  (ESM)
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const urls = [
  'https://www.locksmith-pro.org/',
  'https://www.locksmith-pro.org/about',
  'https://www.locksmith-pro.org/contact',
  'https://www.locksmith-pro.org/locations/selden',
  'https://www.locksmith-pro.org/locations/long-island',
  'https://www.locksmith-pro.org/locations/brooklyn'
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `
  <url>
    <loc>${u}</loc>
    <lastmod>${new Date().toISOString().slice(0,10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

const out = join(__dirname, "..", "public", "sitemap.xml");
writeFileSync(out, xml, "utf8");
console.log("sitemap written to", out);
