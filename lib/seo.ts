// lib/seo.js
export const BRAND = "LocksmithPro Express";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.locksmith-pro.org";

// phone: display (human) + e164 (click-to-call)
// შეგიძლია შეცვალო .env-ში NEXT_PUBLIC_PHONE_DISPLAY / NEXT_PUBLIC_PHONE_E164
export const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+1 (917) 769-0262";
export const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE_E164 || "+19177690262";

export const DEFAULT_LOCALITY = "Brooklyn";
export const DEFAULT_REGION = "NY";
export const POSTAL_CODE = "11784";

export const DEFAULT_DESC =
  "LocksmithPro Express — fast, reliable 24/7 locksmith: car & house lockouts, rekeying, lock change, key replacement. Call now.";

export const CITIES = [
  "hempstead",
  "huntington",
  "islip",
  "mineola",
  "babylon",
  "freeport",
  "valley-stream"
];

export function titleTemplate(title) {
  return title ? `${title} | ${BRAND}` : `${BRAND} — 24/7 Emergency Locksmith`;
}

export function cityPretty(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
