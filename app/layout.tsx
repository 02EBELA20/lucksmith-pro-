import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

import {
  BRAND,
  DEFAULT_DESC,
  SITE_URL,
  PHONE_DISPLAY,
  PHONE_E164,
} from "../lib/seo"; // თუ შენთან სხვანაირი გზა აქვს (მაგ: "../lib/seo"), აქ შეცვალე

export const metadata: Metadata = {
  title: BRAND,
  description: DEFAULT_DESC,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: BRAND,
    description: DEFAULT_DESC,
    url: SITE_URL,
    siteName: BRAND,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND,
    description: DEFAULT_DESC,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* (Optional) Example: Google tag / scripts if you already use them */}
        {/* <Script src="..." strategy="afterInteractive" /> */}

        {children}

        {/* Footer (shows on every page) */}
        <footer
          style={{
            marginTop: "60px",
            padding: "24px 16px",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span style={{ margin: "0 10px" }}>•</span>
            <Link href="/about">About</Link>
          </div>

          <div style={{ opacity: 0.75 }}>
            <div>{BRAND}</div>
            <div>
              <a href={`tel:${PHONE_E164}`}>{PHONE_DISPLAY}</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
