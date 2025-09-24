/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/locations/:slug", destination: "/:slug", permanent: true },
    ];
  },
};
export default nextConfig;
