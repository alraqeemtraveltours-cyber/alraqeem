import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCity } from "@/lib/cities";
import { getFeatured } from "@/lib/packagesStore";
import PackageCard from "@/components/PackageCard";
import SectionHeading from "@/components/SectionHeading";
import { CtaBand } from "@/components/Shared";
import { images } from "@/lib/images";
import { site, waLink } from "@/lib/site";

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
  const otherCities = cities.filter((c) => c.slug !== city.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
        <img
          src={images.kaaba}
          alt=""
          aria-hidden="true"
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

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Featured"
            title={`Packages booked most from ${city.name}`}
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}
          </div>
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
