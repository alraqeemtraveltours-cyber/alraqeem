import { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // API endpoints return JSON or 401s, never indexable pages. Blocking
        // them keeps crawlers off the write/read routes and saves crawl budget.
        // The trailing slash matches every real route (/api/inquiry,
        // /api/cron/keep-alive, ...); there is no bare /api page to worry about.
        "/api/",
        // React Server Component prefetch payloads. Next.js appends
        // ?_rsc=<hash> to the fetches its client router fires, and the hash
        // rotates on every deploy, so Googlebot was discovering every page ×
        // every deploy as a brand new URL and spending the bulk of the crawl
        // budget on these instead of on HTML. They are navigation data, not
        // pages, and the browser fetches them at runtime regardless of
        // robots.txt, so blocking them costs real users nothing and stops the
        // duplicate-URL explosion. The leading /* lets the param match whether
        // it is first (?_rsc=) or later (&_rsc=) in the query string.
        "/*_rsc=",
        // Note: /admin is deliberately NOT disallowed here. The admin routes
        // already carry <meta name="robots" content="noindex, nofollow"> (see
        // app/admin/layout.tsx). A Disallow would stop Googlebot from crawling
        // them and therefore from ever seeing that noindex — which is exactly
        // what produced the "Indexed, though blocked by robots.txt" report.
        // Leaving them crawlable lets the noindex take effect and the pages
        // drop out of the index naturally.
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
