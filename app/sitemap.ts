import { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { cities } from "@/lib/cities";
import { posts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/packages",
    "/visa-services",
    "/about",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const cityPages = cities.map((c) => ({
    url: `${site.url}/areas/${c.slug}`,
    lastModified: new Date(),
  }));

  const postPages = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticPages, ...cityPages, ...postPages];
}
