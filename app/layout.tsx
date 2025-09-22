import "./globals.css";
import type { Metadata } from "next";
import { BRAND, DEFAULT_DESC, SITE_URL, PHONE_DISPLAY, PHONE_E164 } from "../lib/seo";

function brandInitials(name: string) {
  const letters = name.split(/\s+/).map(w => w[0]).join("").toUpperCase();
  return letters.length <= 3 ? letters : letters.slice(0,3);
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND} — 24/7 Emergency Locksmith`,
  description: DEFAULT_DESC,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${BRAND} — 24/7 Emergency Locksmith`,
    description: DEFAULT_DESC,
    url: SITE_URL,
    siteName: BRAND,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const telHref = `tel:${PHONE_E164}`;
  const initials = brandInitials(BRAND);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-900">
        {/* კომპაქტური Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
            
            {/* ლოგო + ბრენდი */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 text-white grid place-items-center font-bold shadow">
                {initials}
              </div>
              <span className="text-sm sm:text-base font-semibold">{BRAND}</span>
            </div>

            {/* Call ღილაკი */}
            <a href={telHref} className="btn btn-primary text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1.5 sm:py-2">
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 text-xs text-white/70 text-center">
          © {new Date().getFullYear()} {BRAND}. Mobile locksmith service. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
