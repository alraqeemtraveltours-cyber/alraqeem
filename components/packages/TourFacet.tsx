import Link from "next/link";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import LastUpdated from "@/components/LastUpdated";
import { getSettings } from "@/lib/settingsStore";
import { site, mapsLink } from "@/lib/site";
import { waHref, telHref } from "@/lib/settings";

export type FacetDest = { name: string; href: string; tag: string; note: string };
export type Facet = {
  slug: string;
  eyebrow: string;
  h1: string;
  heading: string;
  intro: string;
  quoteMessage: string;
  quoteLabel: string;
  ctaTitle: string;
  ctaSubtitle: string;
  destsHeading: string;
  destinations: FacetDest[];
  faqs: { q: string; a: string }[];
};

// Shared renderer for a tours theme facet, a real collection page that groups
// the destinations we already serve by a theme. No new destination data.
export default async function TourFacet({ facet }: { facet: Facet }) {
  const settings = await getSettings();
  const url = `${site.url}/tours/${facet.slug}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: facet.h1,
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Tours", item: `${site.url}/tours` },
          { "@type": "ListItem", position: 3, name: facet.eyebrow, item: url },
        ],
      },
      {
        "@type": "ItemList",
        name: `${facet.eyebrow} destinations`,
        itemListElement: facet.destinations.map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: d.name,
          url: `${site.url}${d.href}`,
        })),
      },
    ],
  };

  const quoteHref = waHref(settings.whatsapp, facet.quoteMessage);

  return (
    <>
      <JsonLd data={graph} />

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-site py-16 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-slate-300"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/tours" className="hover:text-white">
              Tours
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{facet.eyebrow}</span>
          </nav>
          <LastUpdated tone="dark" className="mt-3" />
          <h1 className="mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-4xl">
            {facet.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {facet.intro}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange"
            >
              {facet.quoteLabel}
            </a>
            <a
              href={telHref(settings.phone)}
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              Call {settings.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">{facet.eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
            {facet.destsHeading}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facet.destinations.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="group flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
                  {d.tag}
                </span>
                <h3 className="mt-3 font-display text-xl text-brand-blue-deep">
                  {d.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {d.note}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange-dark group-hover:text-brand-orange">
                  See the {d.name} tour
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <p className="eyebrow">Questions and answers</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
            {facet.eyebrow}, answered
          </h2>
          <FaqAccordion items={facet.faqs} />
        </div>
      </section>

      <CtaBand
        title={facet.ctaTitle}
        subtitle={facet.ctaSubtitle}
        officeHref={mapsLink()}
      />
    </>
  );
}
