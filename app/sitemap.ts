import { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { liveDepartureCities } from "@/lib/departureCities";
import { liveUmrahPlus } from "@/lib/umrahPlus";
import { liveSeasonalUmrah } from "@/lib/seasonalUmrah";
import { liveDestinations } from "@/lib/destinations";
import { packageHrefBySlug } from "@/lib/packages";
import { tourFacets } from "@/lib/tourFacets";
import { getPosts } from "@/lib/postsStore";

type Freq = "weekly" | "monthly" | "yearly";

// Honest freshness signal. The sitemap used to stamp every URL with the build
// time (new Date()), so any deploy that changed no content still told Google
// every page had just been modified — the opposite of what lastmod is for.
// Blog posts carry their real per-post date (below). Every other page carries
// the manually maintained content-review date from site.lastUpdated ("July
// 2026"): a stable date that only advances when the content is actually
// reviewed, never on a routine deploy. If a page later gains a real per-entity
// timestamp (a DB updated_at or a git-derived date), swap it in per path here.
const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
function contentReviewDate(): Date {
  const [month, year] = site.lastUpdated.trim().toLowerCase().split(/\s+/);
  const monthIndex = MONTHS.indexOf(month);
  // Build the date in UTC so the lastmod is identical no matter which timezone
  // the build server runs in. Never fall back to new Date(): that would
  // reintroduce the build-time churn this fix exists to remove.
  return monthIndex === -1 || !/^\d{4}$/.test(year ?? "")
    ? new Date("2026-07-01T00:00:00Z")
    : new Date(Date.UTC(Number(year), monthIndex, 1));
}

// Changefreq and priority by path, the pillars highest, driven by the path so
// it stays consistent as pages are added from the data files.
function meta(path: string): { changeFrequency: Freq; priority: number } {
  if (path === "") return { changeFrequency: "weekly", priority: 1 };
  if (path === "/umrah" || path === "/hajj" || path === "/tours")
    return { changeFrequency: "weekly", priority: 0.9 };
  if (path === "/tours/international-tours" || path === "/tours/pakistan")
    return { changeFrequency: "weekly", priority: 0.8 };
  if (path.startsWith("/umrah/"))
    return { changeFrequency: "weekly", priority: 0.7 };
  if (path.startsWith("/tours/"))
    return { changeFrequency: "monthly", priority: 0.7 };
  if (path === "/packages" || path === "/visa-services" || path === "/tickets")
    return { changeFrequency: "weekly", priority: 0.6 };
  if (path === "/blog") return { changeFrequency: "weekly", priority: 0.6 };
  if (path === "/about" || path === "/contact")
    return { changeFrequency: "monthly", priority: 0.4 };
  if (path === "/terms-and-refunds" || path === "/photo-credits")
    return { changeFrequency: "yearly", priority: 0.3 };
  return { changeFrequency: "monthly", priority: 0.5 };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  // Stable singletons, the hubs, sub hubs, the Muslim friendly facet, the Umrah
  // package children, the verticals, and the site pages.
  const staticPaths = [
    "",
    "/umrah",
    "/umrah/economy-15-days",
    "/umrah/premium-21-days",
    "/umrah/ramadan",
    "/hajj",
    "/tours",
    "/tours/international-tours",
    "/tours/pakistan",
    "/tours/muslim-friendly-tours",
    "/visa-services",
    "/tickets",
    "/packages",
    "/package-calculator",
    "/about",
    "/blog",
    "/contact",
    "/terms-and-refunds",
    "/photo-credits",
  ];

  // Data driven, so a destination, facet, city, combo, or season renders in the
  // sitemap only while live, in sync with the pages, no hardcoded drift.
  const tourDestPaths = [
    ...liveDestinations("international"),
    ...liveDestinations("pakistan"),
  ].map((d) => packageHrefBySlug(d.slug));
  const facetPaths = Object.values(tourFacets).map((f) => `/tours/${f.slug}`);
  const umrahCityPaths = liveDepartureCities().map((c) => `/umrah/${c.slug}`);
  const umrahPlusPaths = liveUmrahPlus().map((c) => `/umrah/${c.slug}`);
  const seasonalPaths = liveSeasonalUmrah().map((s) => `/umrah/${s.slug}`);

  const contentUpdated = contentReviewDate();
  const pages: MetadataRoute.Sitemap = [
    ...staticPaths,
    ...tourDestPaths,
    ...facetPaths,
    ...umrahCityPaths,
    ...umrahPlusPaths,
    ...seasonalPaths,
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: contentUpdated,
    ...meta(path),
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...pages, ...postPages];
}
