import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackage, getPackages } from "@/lib/packagesStore";
import { formatPrice } from "@/lib/packages";
import { packageImage } from "@/lib/images";
import { CtaBand } from "@/components/Shared";
import { site, waLink, telLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return {};
  return {
    title: `${pkg.title} — ${pkg.duration}`,
    description: pkg.description,
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  const related = (await getPackages())
    .filter((p) => p.category === pkg.category && p.slug !== pkg.slug)
    .slice(0, 3);

  const quoteMsg = `Assalam o Alaikum, I want details about the "${pkg.title}" (${pkg.duration}) package.`;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={packageImage(pkg.slug, pkg.category, pkg.image)}
          alt={pkg.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="container-site relative py-20 sm:py-28">
          <nav className="flex items-center gap-2 text-sm text-slate-300">
            <Link href="/packages" className="hover:text-white">
              Packages
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{pkg.category}</span>
          </nav>
          <p className="eyebrow mt-6 text-brand-orange">{pkg.duration}</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-white sm:text-5xl">
            {pkg.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {pkg.description}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 sm:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          {/* What's included */}
          <div className="lg:col-span-2">
            <p className="eyebrow">What's included</p>
            <h2 className="mt-2 text-3xl">Package highlights</h2>
            <div className="gold-rule mt-5" />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {pkg.highlights.map((h) => (
                <li
                  key={h}
                  className="flex gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-card"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C5A253"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="text-sm leading-relaxed text-slate-700">
                    {h}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price / booking card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-3xl border border-black/5 bg-white p-7 shadow-lift">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {pkg.price === null ? "Pricing" : "Starting from"}
              </p>
              <p
                className={`font-display ${
                  pkg.price === null
                    ? "text-2xl text-brand-orange-dark"
                    : "text-4xl text-brand-blue-deep"
                }`}
              >
                {formatPrice(pkg.price)}
              </p>
              {pkg.price !== null && (
                <p className="text-sm text-slate-500">per person</p>
              )}

              <div className="rule-gradient my-6" />

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Duration</dt>
                  <dd className="font-semibold text-slate-800">
                    {pkg.duration}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Category</dt>
                  <dd className="font-semibold text-slate-800">
                    {pkg.category}
                  </dd>
                </div>
              </dl>

              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={waLink(quoteMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-orange w-full"
                >
                  Get Quote on WhatsApp
                </a>
                <a href={telLink()} className="btn-outline w-full">
                  Call {site.phone}
                </a>
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">
                Honest pricing · No hidden charges
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <div className="container-site">
            <p className="eyebrow">More to explore</p>
            <h2 className="mt-2 text-3xl">Other {pkg.category} journeys</h2>
            <div className="gold-rule mt-5" />
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/packages/${p.slug}`}
                  className="group relative flex aspect-[5/4] flex-col justify-end overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <img
                    src={packageImage(p.slug, p.category, p.image)}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 overlay-dark" />
                  <div className="relative p-5">
                    <h3 className="text-lg text-white">{p.title}</h3>
                    <p className="mt-1 font-display text-brand-orange">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
