import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    // Dev override
    const dev = (process.env.CITY_DEV_OVERRIDE || "").toLowerCase().trim();
    let city = dev;

    // Production (Vercel) — IP city
    if (!city) {
      const headerCity = (req.headers.get("x-vercel-ip-city") || "").toLowerCase().trim();
      if (headerCity) city = headerCity;
    }

    if (city) {
      const slug = city.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const url = req.nextUrl.clone();
      url.pathname = `/${slug}`;
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ["/"] };
