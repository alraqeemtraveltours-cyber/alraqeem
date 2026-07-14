import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import Reviews from "@/components/Reviews";
import FaqAccordion from "@/components/FaqAccordion";
import LastUpdated from "@/components/LastUpdated";
import MobileActionBar from "@/components/packages/MobileActionBar";
import SearchInquiryWidget from "@/components/SearchInquiryWidget";
import CaptionedImage from "@/components/packages/CaptionedImage";
import { getSettings } from "@/lib/settingsStore";
import { reviewData } from "@/lib/reviews";
import { images } from "@/lib/images";
import { site, mapsLink } from "@/lib/site";
import { waHref, telHref } from "@/lib/settings";
import { travelAgencySchema } from "@/lib/schema";
import {
  getDepartureCity,
  liveDepartureCities,
  cityFaqs,
} from "@/lib/departureCities";
import { getUmrahPlus, liveUmrahPlus } from "@/lib/umrahPlus";
import UmrahPlusView from "@/components/umrah/UmrahPlusView";
import { getSeasonalUmrah, liveSeasonalUmrah } from "@/lib/seasonalUmrah";
import SeasonalUmrahView from "@/components/umrah/SeasonalUmrahView";

export function generateStaticParams() {
  return [
    ...liveDepartureCities().map((c) => ({ city: c.slug })),
    ...liveUmrahPlus().map((c) => ({ city: c.slug })),
    ...liveSeasonalUmrah().map((s) => ({ city: s.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const season = getSeasonalUmrah(slug);
  if (season && season.live) {
    return {
      title: { absolute: `${season.season} Umrah Packages from Pakistan | Al Raqeem` },
      description: `${season.season} Umrah packages from Pakistan for ${season.hijriYear}, ${season.gregorianWindow}. The Saudi Nusuk visa, hotels near the Haram, guided Ziyarat, departing Peshawar and Islamabad, quoted on inquiry.`,
      alternates: { canonical: `/umrah/${season.slug}` },
      openGraph: { url: `/umrah/${season.slug}` },
    };
  }
  const combo = getUmrahPlus(slug);
  if (combo && combo.live) {
    return {
      title: { absolute: `Umrah Plus ${combo.destination} Packages | Al Raqeem` },
      description: `Umrah Plus ${combo.destination} packages from Pakistan, the pilgrimage first, then ${combo.destination} as a heritage and leisure extension on one booking. Both visas handled, quoted on inquiry.`,
      alternates: { canonical: `/umrah/${combo.slug}` },
      openGraph: { url: `/umrah/${combo.slug}` },
    };
  }
  const c = getDepartureCity(slug);
  if (!c || !c.live) return {};
  return {
    title: { absolute: `Umrah Packages from ${c.city} | Al Raqeem` },
    description: `Umrah packages from ${c.city}, quoted on inquiry for your exact dates. ${
      c.tier === 1
        ? `Flights ${c.flightType === "direct" ? "direct" : "routed"} from ${c.airportName}`
        : `We arrange your departure from ${c.airportName} in ${c.nearestAirportCity} with pickup from ${c.city}`
    }, the Nusuk visa, hotels near the Haram, and guided Ziyarat.`,
    alternates: { canonical: `/umrah/${c.slug}` },
    openGraph: { url: `/umrah/${c.slug}` },
  };
}

// The standard package inclusions, shared across cities by design. The real
// information gain per city is the departure and service passages above.
const inclusions = [
  "The Saudi Umrah e-visa, prepared and filed through Nusuk",
  "Return flights, booked for your dates",
  "Hotels near the Haram in Makkah and Madinah",
  "Ground transport between the two holy cities",
  "Guided Ziyarat at Masjid al-Haram and Masjid an-Nabawi",
  "Room sharing to fit your group, quad, triple, or double",
];

export default async function UmrahCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const settings = await getSettings();

  // Dispatch: a seasonal Umrah, an Umrah Plus combo, or a departure city page.
  const season = getSeasonalUmrah(slug);
  if (season && season.live) {
    return <SeasonalUmrahView season={season} settings={settings} />;
  }

  const combo = getUmrahPlus(slug);
  if (combo && combo.live) {
    return <UmrahPlusView combo={combo} settings={settings} />;
  }

  const c = getDepartureCity(slug);
  if (!c || !c.live) notFound();

  const quoteMsg = `Assalam o Alaikum, I want a quote for an Umrah package from ${c.city} for my dates.`;
  const quoteHref = waHref(settings.whatsapp, quoteMsg);

  const nearby = liveDepartureCities(c.tier).filter((x) => x.slug !== c.slug).slice(0, 4);
  const otherTier = liveDepartureCities(c.tier === 1 ? 2 : 1).slice(0, 4);
  const faqs = cityFaqs(c);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Umrah", item: `${site.url}/umrah` },
          { "@type": "ListItem", position: 3, name: `Umrah from ${c.city}`, item: `${site.url}/umrah/${c.slug}` },
        ],
      },
      {
        "@type": "Service",
        serviceType: "Umrah package",
        name: `Umrah Packages from ${c.city}`,
        url: `${site.url}/umrah/${c.slug}`,
        areaServed: { "@type": "City", name: c.city },
        provider: travelAgencySchema(),
      },
    ],
  };

  return (
    <>
      <JsonLd data={graph} />

      {/* 1. Hero, quick facts, and the quote widget */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={images.heroKaaba}
          alt={`Umrah from ${c.city}, the Holy Kaaba in Masjid al-Haram`}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="container-site relative py-16 sm:py-20">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/umrah" className="hover:text-white">Umrah</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">Umrah from {c.city}</span>
          </nav>
          <p className="eyebrow mt-6 text-brand-orange">{c.region}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] text-white sm:text-5xl">
            Umrah Packages from {c.city}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-200">
            {c.tier === 1
              ? `Direct arranged departures from ${c.airportName}, the Nusuk visa, hotels near the Haram, and guided Ziyarat, quoted on inquiry for your exact dates.`
              : `We run your Umrah from ${c.city} out of ${c.airportName} in ${c.nearestAirportCity}, with pickup from ${c.city}, the Nusuk visa, and hotels near the Haram, quoted on inquiry.`}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              {c.tier === 1 ? `Airport: ${c.airportName} (${c.airportCode})` : `Nearest airport: ${c.airportName}, ${c.nearestAirportCity}`}
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              {c.flightType === "direct" ? "Direct to Jeddah and Madinah" : "Direct in season or via Karachi"}
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              Pickup from {c.city}
            </span>
          </div>
          <div className="mt-6">
            <LastUpdated tone="dark" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={quoteHref} target="_blank" rel="noopener noreferrer" className="btn-orange">
              Get a quote on WhatsApp
            </a>
            <a href={telHref(settings.phone)} className="btn border border-white/40 text-white hover:bg-white/10">
              Call {settings.phone}
            </a>
          </div>
          <div className="mt-8 max-w-3xl">
            <SearchInquiryWidget whatsapp={settings.whatsapp} />
          </div>
        </div>
      </section>

      {/* Entity intro, absorbs the travel agency in the city query while leading Umrah */}
      <section className="py-10">
        <div className="container-site max-w-3xl">
          <p className="text-base leading-relaxed text-slate-700">
            Al Raqeem Travel and Tours is a travel agency serving {c.city}, run
            from our Charsadda base in Khyber Pakhtunkhwa, with Umrah packages,
            Hajj, international tours, and visa services. Umrah leads here,{" "}
            {c.tier === 1
              ? `with direct arranged departures from ${c.airportName}`
              : `with your departure arranged from ${c.airportName} in ${c.nearestAirportCity} and pickup from ${c.city}`}
            , the Nusuk visa, hotels near the Haram, and guided Ziyarat, all
            quoted on inquiry for your exact dates.
          </p>
        </div>
      </section>

      {/* 2. Trust and social proof, high */}
      <section className="bg-paper py-12">
        <div className="container-site grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
            <p className="font-display text-base text-brand-blue-deep">Run from our Charsadda office</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Our desk arranges every {c.city} Umrah from our Khyber Pakhtunkhwa base, in person or on WhatsApp, confirmed in writing before you pay.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
            <p className="font-display text-base text-brand-blue-deep">Nusuk visa, filed for you</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Our team prepares and files the Saudi Umrah e-visa through the official{" "}
              <a href="https://www.nusuk.sa" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue underline">Nusuk platform</a>, and checks every page first.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
            <p className="font-display text-base text-brand-blue-deep">On WhatsApp, start to return</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              From the first inquiry to your safe return, our desk stays reachable, so a {c.city} pilgrim always has one point of contact.
            </p>
          </div>
        </div>
      </section>

      {/* 3 + 4. The two city specific passages, the information gain */}
      <section className="py-16 sm:py-20">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Your departure from {c.city}</p>
            <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
              {c.tier === 1 ? `Flying Umrah from ${c.airportName}` : `Reaching your flight from ${c.city}`}
            </h2>
            <div className="gold-rule mt-4" />
            <p className="mt-5 text-base leading-relaxed text-slate-600">{c.departure}</p>
            <div className="mt-6">
              <CaptionedImage caption={c.heroCaption} icon={c.tier === 1 ? "plane" : "bus"} aspect="aspect-[16/9]" />
            </div>
          </div>
          <div>
            <p className="eyebrow">Our service for {c.city}</p>
            <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
              How we handle {c.city} pilgrims
            </h2>
            <div className="gold-rule mt-4" />
            <p className="mt-5 text-base leading-relaxed text-slate-600">{c.service}</p>
            <ul className="mt-6 space-y-2.5">
              {inclusions.map((inc) => (
                <li key={inc} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-brand-orange-dark" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  {inc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Cost drivers, why the quote moves, no number */}
      <section className="bg-brand-blue-deep py-14 text-white">
        <div className="container-site">
          <p className="eyebrow text-brand-orange">What sets the price</p>
          <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">
            Why an Umrah quote from {c.city} moves
          </h2>
          <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-slate-200">
            An Umrah from {c.city} has no fixed sticker, since the airfare and the
            hotel rates update every week. The season sits highest in Ramadan and
            the holidays, the airline and the routing from {c.tier === 1 ? c.airportName : `${c.airportName} in ${c.nearestAirportCity}`} shift the fare,
            the hotel category and its distance from the Haram set much of the cost,
            and a larger group shares the transport and the guide down. Our desk
            confirms the current best price for your exact dates in writing.
          </p>
          <a href={quoteHref} target="_blank" rel="noopener noreferrer" className="btn-orange mt-6">
            Get your {c.city} quote
          </a>
        </div>
      </section>

      {/* 8. Reviews, high, gated placeholders */}
      <Reviews data={reviewData} />

      {/* 9. Trust and accreditations, gated */}
      <section className="bg-paper py-14">
        <div className="container-site grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-card">
            <p className="eyebrow">Accreditation</p>
            {(site.credentials.moraLicence || site.credentials.companyNumber) && (
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {site.credentials.moraLicence && (
                  <li>MORA Umrah operator No. {site.credentials.moraLicence}</li>
                )}
                {site.credentials.companyNumber && (
                  <li>Registration No. {site.credentials.companyNumber}</li>
                )}
              </ul>
            )}
            <p className="mt-4 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
              Official Umrah registration runs through the{" "}
              <a href="https://www.mora.gov.pk" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue underline">MORA portal</a>{" "}
              in Pakistan and the{" "}
              <a href="https://www.nusuk.sa" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue underline">Nusuk platform</a>{" "}
              in Saudi Arabia.
            </p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-card">
            <p className="eyebrow">Your consultant</p>
            {site.founder.name && (
              <>
                <p className="mt-4 font-semibold text-brand-blue-deep">
                  {site.founder.name}
                </p>
                <p className="text-xs text-slate-500">{site.founder.role}</p>
              </>
            )}
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Our desk stays with you from the first inquiry to your safe return,
              on WhatsApp and in person at the Charsadda office.
            </p>
            <Link href="/about" className="btn-outline mt-5 !py-2.5 text-sm">Meet our team</Link>
          </div>
        </div>
      </section>

      {/* 7. City tailored FAQ, above nothing but the CTA per the section order */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Questions and answers</p>
            <h2 className="mt-3 font-display text-3xl text-brand-blue-deep sm:text-4xl">
              Umrah from {c.city}, your questions
            </h2>
            <div className="gold-rule mx-auto mt-6" />
          </div>
          <FaqAccordion items={faqs} idBase={`umrah-${c.slug}`} />
        </div>
      </section>

      {/* 10. Related, the hub and nearby cities */}
      <section className="bg-paper py-14">
        <div className="container-site">
          <p className="eyebrow">More Umrah options</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
            Umrah from other cities, and the main hub
          </h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/umrah" className="rounded-full border border-brand-blue/30 bg-brand-blue/5 px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue/10">
              All Umrah packages
            </Link>
            {[...nearby, ...otherTier].map((x) => (
              <Link key={x.slug} href={`/umrah/${x.slug}`} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-brand-blue-deep hover:border-brand-orange/40 hover:text-brand-orange-dark">
                Umrah from {x.city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Ready to plan your Umrah from ${c.city}?`}
        subtitle="Tell us your dates, group size, and tier, and our desk sends a quote for your exact dates, with no hidden charges."
        officeHref={mapsLink()}
      />

      <MobileActionBar quoteHref={quoteHref} telHref={telHref(settings.phone)} />
    </>
  );
}
