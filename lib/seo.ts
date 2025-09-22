export const BRAND = "LocksmithPro Express";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE_E164 || "";
export const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY || "";

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

export function titleTemplate(title?: string) {
  return title ? `${title} | ${BRAND}` : `${BRAND} — 24/7 Emergency Locksmith`;
}

export function cityPretty(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
