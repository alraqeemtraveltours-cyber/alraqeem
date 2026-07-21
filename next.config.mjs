/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Hide the development only Next.js indicator, the small circular button that
  // sat bottom left over the footer copyright in dev. It is development only and
  // never rendered on the production site, so this just keeps the preview clean.
  devIndicators: false,
  async headers() {
    return [
      {
        // Content-hashed build assets (/_next/static/*) never change under the
        // same URL, so they are safe to cache for a year and skip revalidation.
        // Vercel already sets this, but declaring it here makes the immutable
        // contract explicit and portable to any host, and keeps Googlebot from
        // re-fetching JS/CSS it already has.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Canonical host. The site is served from the bare apex
      // (site.url = https://alraqeem.com.pk) and every page already emits a
      // canonical to it, yet www still returned its own 200s, so Google saw two
      // crawlable copies of the whole site. Fold every www request onto the
      // apex with a single permanent 301 so only one host is ever crawled or
      // indexed. Must stay first so it applies before the path redirects below.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.alraqeem.com.pk" }],
        destination: "https://alraqeem.com.pk/:path*",
        permanent: true,
      },
      // SILO migration. Every old flat /packages URL 301s to exactly one new
      // silo URL, one hop, no chains. The old Dubai pillar URL also folds in.
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
      // Travel agency in a city pages replaced by the Umrah city pages. Each old
      // /areas page 301s to its new Umrah city page, one hop, no chains, so the
      // ranking and links carry over and there is one page per city, not two.
      {
        source: "/areas/islamabad",
        destination: "/umrah/umrah-packages-islamabad",
        statusCode: 301,
      },
      {
        source: "/areas/lahore",
        destination: "/umrah/umrah-packages-lahore",
        statusCode: 301,
      },
      {
        source: "/areas/rawalpindi",
        destination: "/umrah/umrah-packages-rawalpindi",
        statusCode: 301,
      },
      {
        source: "/areas/peshawar",
        destination: "/umrah/umrah-packages-peshawar",
        statusCode: 301,
      },
      {
        source: "/areas/charsadda",
        destination: "/umrah/umrah-packages-charsadda",
        statusCode: 301,
      },
      {
        source: "/areas/tangi",
        destination: "/umrah/umrah-packages-tangi",
        statusCode: 301,
      },
      {
        source: "/areas/shabqadar",
        destination: "/umrah/umrah-packages-shabqadar",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
