--- filename: next.config.mjs ---
/** @type {import('next').NextConfig} */

// უსაფრთხოების ჰედერების მასივი
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

const nextConfig = {
  // SEO-სთვის მნიშვნელოვანი redirect-ები ძველი URL-ებიდან
  async redirects() {
    return [
      { source: '/locations/:slug', destination: '/:slug', permanent: true },
    ];
  },

  // უსაფრთხოების ჰედერები
  async headers() {
    return [
      {
        source: '/:path*', // გავრცელდეს ყველა გვერდზე
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;