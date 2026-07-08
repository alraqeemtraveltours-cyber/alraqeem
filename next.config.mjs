/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Hide the development only Next.js indicator, the small circular button that
  // sat bottom left over the footer copyright in dev. It is development only and
  // never rendered on the production site, so this just keeps the preview clean.
  devIndicators: false,
  async redirects() {
    // SILO migration. Every old flat /packages URL 301s to exactly one new
    // silo URL, one hop, no chains. The old Dubai pillar URL also folds in.
    return [
      {
        source: "/packages/economy-umrah-15-days",
        destination: "/umrah/economy-15-days",
        statusCode: 301,
      },
      {
        source: "/packages/premium-umrah-21-days",
        destination: "/umrah/premium-21-days",
        statusCode: 301,
      },
      {
        source: "/packages/ramadan-umrah-special",
        destination: "/umrah/ramadan",
        statusCode: 301,
      },
      {
        source: "/packages/hajj-package",
        destination: "/hajj",
        statusCode: 301,
      },
      {
        source: "/packages/dubai-5-days",
        destination: "/tours/dubai",
        statusCode: 301,
      },
      {
        source: "/tours/dubai-tour-packages-from-pakistan",
        destination: "/tours/dubai",
        statusCode: 301,
      },
      {
        source: "/packages/turkey-7-days",
        destination: "/tours/turkey",
        statusCode: 301,
      },
      {
        source: "/packages/baku-5-days",
        destination: "/tours/baku",
        statusCode: 301,
      },
      {
        source: "/packages/malaysia-thailand-8-days",
        destination: "/tours/malaysia-thailand",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
