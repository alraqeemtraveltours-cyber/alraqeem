import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { PageHero } from "@/components/Shared";
import { images } from "@/lib/images";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Travel Blog & Guides",
  description:
    "Umrah guides, visa requirements and Pakistan travel advice from the Al Raqeem Travel & Tours team.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Travel blog"
        title="Advice we give across the desk, written down"
        description="Umrah guides, visa requirements and Pakistan travel advice from our team."
        image={images.mountains}
      />

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Latest guides"
            title="Read before you travel"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-3xl bg-white p-7 shadow-card transition hover:shadow-lift"
              >
                <p className="text-xs font-semibold text-slate-500">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  | {post.readMinutes} min read
                </p>
                <h2 className="mt-3 text-xl leading-snug group-hover:text-brand-blue">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
                <span className="mt-auto pt-5 text-sm font-bold text-brand-orange">
                  Read the guide
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
