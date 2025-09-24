export const BRAND = "LocksmithPro Express";

export const DEFAULT_DESC =
  "24/7 emergency locksmith — car & house lockouts, rekeying, lock change, and car key replacement across Long Island.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.locksmith-pro.org";

export const PHONE_E164 =
  process.env.NEXT_PUBLIC_PHONE_E164 || "+19177690262";
export const PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+1 (917) 769-0262";

export const SERVICE_CENTER = {
  lat: Number(process.env.SERVICE_CENTER_LAT || 40.866),
  lng: Number(process.env.SERVICE_CENTER_LNG || -73.036),
};
export const SERVICE_RADIUS_MILES = Number(
  process.env.SERVICE_RADIUS_MILES || 40
);
export const SERVICE_RADIUS_METERS = Math.round(SERVICE_RADIUS_MILES * 1609.34);
export const SERVICE_STATE = process.env.SERVICE_STATE || "NY";

/** SEO title helper */
export function titleTemplate(title?: string): string {
  const t = (title ?? "").trim();
  return t ? `${t} | ${BRAND}` : `${BRAND} — 24/7 Emergency Locksmith`;
}
