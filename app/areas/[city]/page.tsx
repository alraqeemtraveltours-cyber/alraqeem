import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCity } from "@/lib/cities";
import { getFeatured } from "@/lib/packagesStore";
import PackageCard from "@/components/PackageCard";
import SectionHeading from "@/components/SectionHeading";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import { images } from "@/lib/images";
import { site, waLink } from "@/lib/site";
import { localBusinessSchema } from "@/lib/schema";

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};
  return {
    title: `Travel Agency in ${city.name} | Umrah & Tour Packages`,
    description: city.intro,
    alternates: { canonical: `/areas/${city.slug}` },
    openGraph: { url: `/areas/${city.slug}` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();

  const featured = await getFeatured(3);
  const spotlight = featured[0];
  const supporting = featured.slice(1);
  const otherCities = cities.filter((c) => c.slug !== city.slug);

  return (
    <>
      <JsonLd data={localBusinessSchema(city)} />
      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
        <img
          src={images.kaaba}
          alt={`Umrah and Hajj travel from ${city.name}, the Holy Kaaba in Makkah`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="container-site relative">
          <p className="eyebrow text-brand-orange">{city.region}</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.1] text-white sm:text-5xl">
            {city.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-slate-200">{city.intro}</p>
          <a
            href={waLink(
              `Assalam o Alaikum, I am from ${city.name} and want to ask about your packages.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-orange mt-8"
          >
            WhatsApp Us from {city.name}
          </a>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={`Serving ${city.name}`}
              title={`How we work with ${city.name} travelers`}
            />
            <p className="leading-relaxed text-slate-600">{city.detail}</p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Our head office is at {site.address}, and every booking comes
              with WhatsApp support from inquiry to your safe return.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-7 shadow-card">
            <h2 className="text-xl">
              Popular with {city.name} clients
            </h2>
            <ul className="mt-4 space-y-3">
              {city.popular.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/packages" className="btn-blue mt-6 w-full">
              See All Packages
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-white via-paper/40 to-white py-16 sm:py-20">
        <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="container-site relative">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured"
              title={`Packages booked most from ${city.name}`}
              description={`Most requested departures from ${city.name} this month.`}
            />
            <Link href="/packages" className="btn-outline">
              Browse all packages
            </Link>
          </div>

          {spotlight ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="relative rounded-3xl border border-black/5 bg-white p-3 shadow-card">
                  <p className="pointer-events-none absolute left-6 top-6 z-10 rounded-full bg-brand-blue-deep px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Most Booked
                  </p>
                  <PackageCard pkg={spotlight} />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {supporting.map((p) => (
                  <PackageCard key={p.slug} pkg={p} />
                ))}
                {supporting.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-black/10 bg-white p-8 text-center text-sm text-slate-500">
                    More featured packages will appear here soon.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-black/10 bg-white p-10 text-center text-slate-500">
              Featured packages are being updated.
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container-site">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
            We also serve
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/areas/${c.slug}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-blue shadow-card hover:bg-brand-blue hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Planning a trip from ${city.name}?`}
        subtitle="One message gets you package options with full pricing the same day."
      />
    </>
  );
}
