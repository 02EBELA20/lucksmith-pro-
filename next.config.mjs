// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/locations/:slug', destination: '/:slug', permanent: true },
    ];
  },
  // build რუტინისთვის ყველაფერი სტანდარტული
};
export default nextConfig;
