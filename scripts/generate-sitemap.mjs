--- filename: scripts/generate-sitemap.mjs ---
import fs from 'fs';
import path from 'path';
import cities from '../data/cities.json' assert { type: 'json' };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locksmith-pro.org';
const PUBLIC_DIR = path.resolve('public');

function generateSitemap() {
  const urls = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'weekly' },
    ...cities.map(city => ({
      loc: `${SITE_URL}/${city.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),
  ];

  const sitemapContent = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
    <url>
      <loc>${url.loc}</loc>
      <priority>${url.priority}</priority>
      <changefreq>${url.changefreq}</changefreq>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
  `).join('\n  ')}
</urlset>
  `.trim();

  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`✅ Sitemap generated with ${urls.length} URLs at ${sitemapPath}`);
}

function ensureRobotsTxt() {
  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  let robotsContent = '';

  if (fs.existsSync(robotsPath)) {
    robotsContent = fs.readFileSync(robotsPath, 'utf8');
  }

  const sitemapLine = `Sitemap: ${sitemapUrl}`;

  if (robotsContent.includes('Sitemap:')) {
    robotsContent = robotsContent.replace(/Sitemap:.*$/, sitemapLine);
  } else {
    robotsContent = `${robotsContent.trim()}\n${sitemapLine}`;
  }
  
  // Ensure basic rules exist
  if (!robotsContent.includes('User-agent:')) {
     robotsContent = `User-agent: *\nAllow: /\nDisallow: /api/\n\n${robotsContent}`;
  }

  fs.writeFileSync(robotsPath, robotsContent.trim());
  console.log(`✅ robots.txt updated at ${robotsPath}`);
}

try {
    generateSitemap();
    ensureRobotsTxt();
} catch (error) {
    console.error("❌ Error generating sitemap or robots.txt:", error);
    process.exit(1);
}