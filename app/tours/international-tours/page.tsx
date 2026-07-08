import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import Reviews from "@/components/Reviews";
import FaqAccordion from "@/components/FaqAccordion";
import LastUpdated from "@/components/LastUpdated";
import SearchInquiryWidget from "@/components/SearchInquiryWidget";
import CaptionedImage from "@/components/packages/CaptionedImage";
import { getPackages } from "@/lib/packagesStore";
import { getSettings } from "@/lib/settingsStore";
import { reviewData } from "@/lib/reviews";
import { site, mapsLink } from "@/lib/site";
import { waHref, telHref } from "@/lib/settings";
import { packageHref, packageDisplayName } from "@/lib/packages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "International Tour Packages from Pakistan | Al Raqeem",
  },
  description:
    "International tour packages from Pakistan to Dubai, Turkey, Baku, Malaysia, Thailand, and Singapore. Visa, flights, hotels, and sightseeing in one booking, quoted on inquiry.",
  keywords: [
    "international tour packages from Pakistan",
    "world tour packages from Pakistan",
    "best international tour packages",
    "international tours from Peshawar",
    "international tours from Islamabad",
    "luxury international tours from Pakistan",
  ],
  alternates: { canonical: "/tours/international-tours" },
  openGraph: { url: "/tours/international-tours" },
};

const faqs = [
  {
    q: "How much is an international tour package from Pakistan?",
    a: "International tours are quoted on inquiry, since airfare and hotel rates move every week. Our desk reads the live fares for your exact dates and destination and sends the current best price on WhatsApp, with no hidden charges and no stale published number. Message us with your dates and group size for a same day quote.",
  },
  {
    q: "Which are the best international destinations from Pakistan?",
    a: "Our most booked routes are Dubai, Turkey, Baku, Malaysia, Thailand, and Singapore, plus the Malaysia with Thailand combo and the three country grand tour. Dubai and Turkey lead for first trips, Malaysia and Baku for a halal friendly family trip, and Thailand and Singapore for beaches and theme parks.",
  },
  {
    q: "Do international tour packages include the visa and flights?",
    a: "Yes. Every international package includes the visit visa and return flights, prepared and booked by our team, along with the hotels and guided sightseeing in one booking. Our desk checks every document before filing, so the visa clears without avoidable delays.",
  },
  {
    q: "Which cities do you fly international tours from?",
    a: "Our desk departs travelers from Peshawar and Islamabad for most routes, and from Karachi or Lahore where the fare and schedule suit your dates. Travelers near our Charsadda base fly from Peshawar or Islamabad, with airport pickup coordinated when you book.",
  },
  {
    q: "Are international tours halal and Muslim friendly?",
    a: "Yes. Malaysia, Turkey, Baku, and Dubai sit in Muslim countries where halal food is everywhere and prayer is easy, and our desk arranges halal meals and prayer stops on every route, including Thailand and Singapore. See our Muslim friendly tours for the halal focused list.",
  },
  {
    q: "Do you offer luxury or five star international tours?",
    a: "Yes. Our desk arranges five star hotels, private transport, and business class flights on any international route, from a facing the beach stay in Thailand to a central Marina hotel in Dubai. Tell us the comfort level you want, and we quote the upgraded trip for your dates.",
  },
  {
    q: "Are international tours good for families and honeymooners?",
    a: "Yes. Our tours suit families and honeymooners alike, with comfortable hotels, guided sightseeing, and a pace our team adjusts for children and couples. See our family tours and honeymoon tours for the curated lists, and tell our desk your group and any needs.",
  },
  {
    q: "What is the best time to travel on an international tour?",
    a: "The best window depends on the destination, from the cooler winter months in Dubai to spring and autumn in Turkey and November to February for the Far East beaches. Our desk builds the trip around comfortable weather, sensible crowds, and your budget. Tell us your preferred dates.",
  },
  {
    q: "Do you customize international tours or combine two countries?",
    a: "Yes. Our desk shapes each tour around your dates, hotel choice, and excursions, and combines destinations like Malaysia with Thailand, or all three with Singapore, in one booking. Tell us your plan, and we quote the customized or combined route for your group.",
  },
  {
    q: "Are these group departures or private trips?",
    a: "Both. Join a group departure for the friendliest price and a set itinerary, or ask our desk for a private tour with your own vehicle, guide, and pace. Tell us your group size and how you prefer to travel, and we quote the option that fits your dates.",
  },
  {
    q: "What drives the cost of an international tour?",
    a: "The airline and departure city, the travel season, the hotel star rating, and the group size set each quote, along with any optional excursions. Our desk reads them live for your dates and sends the current best price, with no hidden charges and no stale published number.",
  },
  {
    q: "How do I book and get a quote for an international tour?",
    a: "Message our desk on WhatsApp with your destination, dates, and group size, or visit our Charsadda office. We send options and a quote for your exact dates the same day, a deposit secures your seats and rooms, and the balance settles before departure, every amount confirmed in writing.",
  },
];

export default async function InternationalToursPage() {
  const packages = await getPackages();
  const settings = await getSettings();
  const international = packages
    .filter((p) => p.category === "International")
    .map((p) => ({ ...p, price: null }));

  const quoteHref = waHref(
    settings.whatsapp,
    "Assalam o Alaikum, I want a quote for an international tour package for my dates."
  );

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${site.url}/tours/international-tours`,
        url: `${site.url}/tours/international-tours`,
        name: "International Tour Packages from Pakistan",
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Tours", item: `${site.url}/tours` },
          {
            "@type": "ListItem",
            position: 3,
            name: "International Tours",
            item: `${site.url}/tours/international-tours`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "International tour destinations from Pakistan",
        itemListElement: international.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: packageDisplayName(p),
          url: `${site.url}${packageHref(p)}`,
        })),
      },
    ],
  };

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
            <span className="text-white">International Tours</span>
          </nav>
          <LastUpdated tone="dark" className="mt-3" />
          <h1 className="mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-5xl">
            International Tour Packages from Pakistan
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {site.name} is a full service Umrah, Hajj, tour, and visa agency in
            Charsadda, Khyber Pakhtunkhwa, and our international tours desk
            arranges packages from Pakistan to Dubai, Turkey, Baku, Malaysia,
            Thailand, and Singapore, with the visa, flights, hotels, and
            sightseeing in one booking, departing from Peshawar and Islamabad.
            Halal friendly routes make the trips comfortable for a family from
            Pakistan, quoted on inquiry for your dates.
          </p>
          <div className="mt-8 max-w-4xl">
            <SearchInquiryWidget whatsapp={settings.whatsapp} />
          </div>
        </div>
      </section>

      {/* Top destinations directory */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">Where we take you</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
            International destinations we serve
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
            Every destination below is a complete package, the visa, flights,
            hotels, and guided sightseeing handled by our desk from Peshawar and
            Islamabad. Choose a destination for its full itinerary, or message us
            for a custom route or a two country combo.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {international.map((p) => (
              <Link
                key={p.slug}
                href={packageHref(p)}
                className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <CaptionedImage
                  caption={`${packageDisplayName(p)} from Pakistan`}
                  icon="pin"
                  aspect="aspect-[16/9]"
                />
                <div className="flex flex-1 flex-col pt-3">
                  <h3 className="font-display text-lg text-brand-blue-deep">
                    {packageDisplayName(p)}
                  </h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">
                    {p.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange-dark group-hover:text-brand-orange">
                    {packageDisplayName(p)} from Pakistan
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deep coverage prose */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <p className="eyebrow">Plan your trip abroad</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
            International tours from Pakistan, handled end to end
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-700">
            <p>
              Al Raqeem arranges international tours for travelers who want the
              visa, flights, hotels, and sightseeing in one booking rather than a
              trip stitched together from a dozen websites. Our desk in Charsadda
              books Dubai with the Burj Khalifa and a desert safari, Turkey across
              Istanbul and Cappadocia, Baku on the Caspian, and the Far East from
              Kuala Lumpur to Bangkok and Singapore, and stays with you on
              WhatsApp from the first inquiry to your safe return.
            </p>
            <p>
              Departures run from Peshawar and Islamabad for most routes, and from
              Karachi or Lahore where the fare and schedule suit your dates.
              Travelers near our Charsadda base start closest of all, and our team
              coordinates the airport pickup and the onward transfers so the
              journey holds together from your doorstep.
            </p>
            <p>
              A luxury tier sits on every route, five star hotels, private
              transport, and business class flights, from a beachfront stay in
              Thailand to a central Marina hotel in Dubai. Couples and
              honeymooners find a shaped pace on the{" "}
              <Link href="/tours/honeymoon-packages" className="font-semibold text-brand-blue underline">
                honeymoon tours
              </Link>
              , families a steady one on the{" "}
              <Link href="/tours/family-packages" className="font-semibold text-brand-blue underline">
                family tours
              </Link>
              , and a Muslim family the reassurance of halal and easy prayer on
              the{" "}
              <Link href="/tours/muslim-friendly-tours" className="font-semibold text-brand-blue underline">
                Muslim friendly tours
              </Link>
              .
            </p>
            <p>
              An international tour carries no fixed sticker, since the airline and
              departure city, the travel season, the hotel star rating, and the
              group size set each quote. Our desk reads them live for your dates
              and sends the current best price, with no hidden charges and no
              stale published number. Rates update weekly with airfare and hotel
              availability, so we quote the current best price for your dates.
            </p>
            <p>
              Two countries pair naturally in one trip, from the{" "}
              <Link href="/tours/malaysia-thailand" className="font-semibold text-brand-blue underline">
                Malaysia and Thailand combo
              </Link>{" "}
              to the{" "}
              <Link href="/tours/malaysia-thailand-singapore" className="font-semibold text-brand-blue underline">
                three country grand tour
              </Link>
              , with the visas, the inter country flights, and the hotels arranged
              together. Tell our desk which countries you want, and we quote the
              combined route for your group and your dates.
            </p>
          </div>
          <div className="mt-8">
            <a
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange"
            >
              Get a quote on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Why book, E E A T */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-3xl rounded-3xl border border-black/5 bg-white p-7 shadow-card sm:p-8">
            <p className="eyebrow">Why book with our desk</p>
            <h2 className="mt-2 font-display text-2xl text-brand-blue-deep">
              A registered agency you visit in person
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Al Raqeem Travel & Tours has arranged travel for families across
              Khyber Pakhtunkhwa for years by word of mouth, now online. Our head
              office sits at Aman Plaza, Mardan Road, Charsadda, open to walk in
              and plan face to face, and our team is the sister company of Al Nafi
              Travels. Every booking runs through one desk, from the visa and the
              flights to the hotels and the airport pickup, with WhatsApp support
              from your first inquiry to your safe return.
            </p>
            <p className="mt-4 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
              Our registration number and appointed agent details are being added
              here before launch. Ask our desk for the current documents.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews, staging placeholders until real reviews are connected */}
      <Reviews data={reviewData} />

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <p className="eyebrow">Questions and answers</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
            International tours, answered
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <CtaBand
        title="Ready to plan a trip abroad?"
        subtitle="Tell our desk your destination, dates, and group, and we quote the trip with the visa, flights, and hotels handled in one booking."
        officeHref={mapsLink()}
      />
    </>
  );
}
