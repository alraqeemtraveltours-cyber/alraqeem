import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { liveDestinations, type Destination } from "@/lib/destinations";
import { packageHrefBySlug } from "@/lib/packages";
import { site } from "@/lib/site";

// One reusable, data driven directory block, two columns, international and
// Pakistan, each a list of descriptive destination links plus a View more link
// to its sub hub. Drop it on the homepage and the tours pillar. Links only to
// live pages, roadmap entries are omitted, never a dead link.
const columns: {
  title: string;
  category: "international" | "pakistan";
  more: string;
  moreLabel: string;
}[] = [
  {
    title: "International Tour Packages",
    category: "international",
    more: "/tours/international-tours",
    moreLabel: "Explore all international destinations",
  },
  {
    title: "Tour Packages in Pakistan",
    category: "pakistan",
    more: "/tours/pakistan",
    moreLabel: "Explore all Pakistan destinations",
  },
];

function itemList(name: string, dests: Destination[]) {
  return {
    "@type": "ItemList",
    name,
    itemListElement: dests.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.name,
      url: `${site.url}${packageHrefBySlug(d.slug)}`,
    })),
  };
}

export default function DestinationDirectory({
  eyebrow = "Destinations",
  heading = "Where we take you",
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const intl = liveDestinations("international");
  const pak = liveDestinations("pakistan");

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      itemList("International tour destinations from Pakistan", intl),
      itemList("Pakistan tour destinations", pak),
    ],
  };

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <JsonLd data={graph} />
        <p className="eyebrow text-center">{eyebrow}</p>
        <h2 className="mt-2 text-center font-display text-2xl text-brand-blue-deep sm:text-3xl">
          {heading}
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {columns.map((col) => {
            const dests = col.category === "international" ? intl : pak;
            return (
              <div
                key={col.category}
                className="flex flex-col rounded-3xl border border-black/5 bg-paper p-6 shadow-card sm:p-8"
              >
                <h3 className="font-display text-lg text-brand-blue-deep">
                  {col.title}
                </h3>
                <div className="gold-rule mt-3" />
                <ul className="mt-4 grid flex-1 grid-cols-1 gap-x-6 sm:grid-cols-2">
                  {dests.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={packageHrefBySlug(d.slug)}
                        className="flex min-h-[44px] items-center gap-2 border-b border-black/5 text-sm font-medium text-brand-blue-deep transition hover:text-brand-orange-dark"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 text-brand-orange-dark"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                        {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={col.more}
                  className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-brand-orange/40 bg-brand-orange/5 px-4 text-sm font-semibold text-brand-orange-dark transition hover:bg-brand-orange/10"
                >
                  {col.moreLabel}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
