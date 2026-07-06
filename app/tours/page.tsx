import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/Shared";
import AirlineStrip from "@/components/AirlineStrip";
import JsonLd from "@/components/JsonLd";
import Reviews from "@/components/Reviews";
import FaqAccordion from "@/components/FaqAccordion";
import PackagesExplorer from "@/components/packages/PackagesExplorer";
import SeoBlurb from "@/components/SeoBlurb";
import MobileActionBar from "@/components/packages/MobileActionBar";
import LastUpdated from "@/components/LastUpdated";
import SearchInquiryWidget from "@/components/SearchInquiryWidget";
import { getPackages } from "@/lib/packagesStore";
import { getSettings } from "@/lib/settingsStore";
import { reviewData } from "@/lib/reviews";
import { site, mapsLink } from "@/lib/site";
import { images } from "@/lib/images";
import { waHref, telHref } from "@/lib/settings";
import { toursHubGraph } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Tour Packages from Pakistan | Al Raqeem" },
  description:
    "International tour packages from Pakistan to Dubai, Turkey, Baku, and the Far East. Visa, flights, hotels, and sightseeing in one booking, quoted on inquiry.",
  keywords: [
    "tour packages from Pakistan",
    "Dubai tour package from Pakistan",
    "Turkey tour package",
    "Baku tour package",
    "Malaysia and Thailand tour",
    "international holiday package Pakistan",
  ],
  alternates: { canonical: "/tours" },
  openGraph: { url: "/tours" },
};

const tourFaqs = [
  {
    q: "How does pricing work for tour packages?",
    a: "Tour pricing is quoted on inquiry because airfare and hotel rates update every week. Our team checks live fares for your exact travel dates and sends the current best price on WhatsApp, with no hidden charges and no stale published numbers. Message our desk with your dates and group size for a same day quote.",
  },
  {
    q: "Do tour packages include the visa and flights?",
    a: "Yes. Every tour package includes the visit visa and return flights, prepared and booked by our team, along with hotels and guided sightseeing in one booking. Our desk checks every document before filing, so your visa clears without avoidable delays.",
  },
  {
    q: "Which destinations do you offer tours to?",
    a: "Our tours cover Dubai, Turkey with Istanbul and Cappadocia, Baku in Azerbaijan, and a Malaysia with Thailand combo. Our desk also builds custom routes and combos, so tell us where you want to go and we quote the trip for your dates.",
  },
  {
    q: "Do you customize tours or combine two countries?",
    a: "Yes. Our desk shapes each tour around your dates, hotel choice, and excursions, and pairs destinations like Dubai with Baku, Dubai with Turkey, or Dubai with the Maldives for a combo trip. Tell us your plan, and we quote the customized route for your group.",
  },
  {
    q: "Are the tours suitable for families and honeymooners?",
    a: "Our tours suit families, couples, and honeymooners, with comfortable hotels, guided sightseeing, and a pace our team adjusts for children and elders. Tell our desk your group and any needs, and we shape the trip and the hotels around them.",
  },
  {
    q: "Which cities do you fly from for tours?",
    a: "Our desk arranges tour flights from Karachi, Lahore, Islamabad, or Peshawar, on the carrier with the best fare and schedule for your dates. Travelers from Charsadda and nearby towns depart from Peshawar or Islamabad, with airport pickup coordinated when you book.",
  },
  {
    q: "What is the best time to travel on these tours?",
    a: "The best window depends on the destination, from cooler winter months in Dubai to spring and autumn in Turkey. Our desk builds the trip around comfortable weather, sensible crowds, and your budget. Tell us your preferred dates, and we advise the best fit.",
  },
  {
    q: "How early should I book a tour?",
    a: "Three to six weeks gives comfortable time for visa processing and the best fares, while peak seasons and holidays book earliest. Message our desk as soon as your dates are set, and we hold your seats and hotels with a deposit and confirm every amount in writing.",
  },
  {
    q: "Do you build custom group tours?",
    a: "Yes. Our team builds custom tours for families, offices, and community groups of any size, to any destination we serve. Share your dates, group size, and the experience you want, and our desk designs the itinerary, arranges documents, and sends one quote for the whole group.",
  },
  {
    q: "Are your tours group departures or private trips?",
    a: "Both. Join a group departure for the friendliest price and a set itinerary, or ask our desk for a private tour with your own vehicle, guide, and pace. Tell us your group size and how you prefer to travel, and we quote the option that fits your dates.",
  },
  {
    q: "Do the tours include airport transfers and daily sightseeing?",
    a: "Yes. Our tour packages include airport transfers on arrival and departure and the guided sightseeing named in each itinerary, from the Dubai city tour to the Istanbul old city and the Cappadocia valleys. Our desk confirms every transfer and tour in writing before you pay.",
  },
  {
    q: "Which airlines do you fly for international tours?",
    a: "Flights are booked on the carrier with the best fare and schedule for your dates, such as Emirates, Qatar Airways, Etihad, PIA, or AirSial, from Karachi, Lahore, Islamabad, or Peshawar. Our desk confirms the airline and the timing with your quote.",
  },
];

export default async function ToursPage() {
  const packages = await getPackages();
  const settings = await getSettings();

  // Inquiry based section: strip any price before it reaches the client.
  const clientPackages = packages.map((p) => ({ ...p, price: null }));

  return (
    <>
      <JsonLd data={toursHubGraph(packages)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={images.dubai}
          alt="International tour packages from Pakistan"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="container-site relative py-20 sm:py-28">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-slate-200"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">Tours</span>
          </nav>
          <LastUpdated tone="dark" className="mt-3" />
          <p className="mt-6 eyebrow text-brand-orange">Tours</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
            Tour Packages from Pakistan
          </h1>
          <p className="mt-4 max-w-2xl font-display text-xl italic text-brand-orange sm:text-2xl">
            City lights, deserts, and beaches, one booking
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Dubai, Turkey, Baku, and the Far East, with the visa, flights,
            hotels, and sightseeing handled by our team. Every tour is quoted on
            inquiry, so you get the current best price for your exact dates with
            no hidden charges. Message our desk on WhatsApp for a quote.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={waHref(
                settings.whatsapp,
                "Assalam o Alaikum, I want a quote for a tour package for my dates."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange"
            >
              Get a quote on WhatsApp
            </a>
            <a
              href={telHref(settings.phone)}
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              Call {settings.phone}
            </a>
          </div>
          <div className="mt-8 max-w-3xl">
            <SearchInquiryWidget whatsapp={settings.whatsapp} />
          </div>
        </div>
      </section>

      {/* Airline partners */}
      <AirlineStrip />

      {/* Explorer: international tours only */}
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <PackagesExplorer
            packages={clientPackages.filter(
              (p) => p.category !== "Umrah & Hajj"
            )}
            whatsapp={settings.whatsapp}
            scope="international"
            intro="Al Raqeem arranges international tour packages from Pakistan to Dubai, Turkey, Baku, and the Malaysia with Thailand combo, from five to eight day durations, departing from Karachi, Lahore, Islamabad, and Peshawar. Visa, flights, hotels, and guided sightseeing are handled end to end, so you compare trips by what matters and leave the logistics to our desk."
          />
          <SeoBlurb
            eyebrow="Plan your trip"
            title="Tour packages from Pakistan to Dubai, Turkey, Baku, and beyond"
            paragraphs={[
              "Al Raqeem Travel & Tours is a full service Umrah, Hajj, tour, and visa agency in Charsadda, Khyber Pakhtunkhwa, and our tours desk arranges international packages from Pakistan for travelers who want the visa, flights, hotels, and sightseeing in one booking. Explore Dubai with the Burj Khalifa, Dubai Mall, a desert safari, and a Dubai Marina dhow cruise, then add Palm Jumeirah and Abu Dhabi with the Sheikh Zayed Grand Mosque. Discover Turkey across Istanbul and Cappadocia, walk the Old City, cruise the Bosphorus, and watch the hot air balloons rise. Wander Baku in Azerbaijan for the Flame Towers, or combine Malaysia and Thailand for Kuala Lumpur, Genting Highlands, and the beaches of Phuket.",
              "Every tour includes the visit visa, return flights, hotels with breakfast, and guided city tours, with departures from Karachi, Lahore, Islamabad, and Peshawar on the carrier with the best fare for your dates. Families, couples, and honeymooners each get a pace shaped around them, and our desk builds custom routes and combos on request. Rates update weekly, so we quote the current best price for your dates on WhatsApp. Message our Charsadda office, the sister company of Al Nafi Travels, to plan your trip abroad.",
            ]}
          />
          <p className="mt-6 rounded-2xl border border-black/5 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-card">
            Planning a pilgrimage instead? See our{" "}
            <Link
              href="/umrah"
              className="font-semibold text-brand-blue underline"
            >
              Umrah packages
            </Link>{" "}
            and the{" "}
            <Link
              href="/hajj"
              className="font-semibold text-brand-blue underline"
            >
              Hajj package
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Social proof: staging placeholders until real reviews are connected */}
      <Reviews data={reviewData} />

      {/* Trust and credentials */}
      <section className="bg-paper py-16 sm:py-24">
        <div className="container-site">
          <div className="mx-auto max-w-3xl rounded-3xl border border-black/5 bg-white p-7 shadow-card sm:p-8">
            <p className="eyebrow">Why book with our desk</p>
            <h2 className="mt-2 font-display text-2xl text-brand-blue-deep">
              A registered agency you visit in person
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                Sister company of {site.sisterCompany}, with years of serving
                travelers across Pakistan
              </li>
              <li className="flex items-start gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                Head office at Aman Plaza, Mardan Road, Charsadda, open Monday to
                Saturday
              </li>
              <li className="flex items-start gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                Visa, flights, hotels, and sightseeing under one desk, with
                WhatsApp support from inquiry to safe return
              </li>
            </ul>
            <Link href="/about" className="btn-outline mt-6 !py-2.5 text-sm">
              Meet our team
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Questions and answers</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              Tour pricing, inclusions and booking
            </h2>
            <div className="gold-rule mx-auto mt-6" />
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Straight answers on how tour quotes work, what a package includes,
              and how to book from any city in Pakistan.
            </p>
          </div>
          <FaqAccordion items={tourFaqs} idBase="tours-faq" />
        </div>
      </section>

      <CtaBand
        title="Don't see your destination?"
        subtitle="We build custom tours for any destination and group size. Tell us where you want to go, and our desk sends a quote for your exact dates."
        officeHref={mapsLink()}
      />

      {/* Mobile sticky quote bar */}
      <MobileActionBar
        quoteHref={waHref(
          settings.whatsapp,
          "Assalam o Alaikum, I want a quote for a tour package for my dates."
        )}
        telHref={telHref(settings.phone)}
      />
    </>
  );
}
