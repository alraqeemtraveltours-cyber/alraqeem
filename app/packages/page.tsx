import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/Shared";
import SectionHeading from "@/components/SectionHeading";
import AirlineStrip from "@/components/AirlineStrip";
import JsonLd from "@/components/JsonLd";
import Reviews from "@/components/Reviews";
import FaqAccordion from "@/components/FaqAccordion";
import PackagesExplorer from "@/components/packages/PackagesExplorer";
import TierCompare from "@/components/packages/TierCompare";
import MobileActionBar from "@/components/packages/MobileActionBar";
import { getPackages } from "@/lib/packagesStore";
import { getSettings } from "@/lib/settingsStore";
import { reviewData } from "@/lib/reviews";
import { stagingCredentials, stagingFounder } from "@/lib/staging";
import { images, photo, realPhotos } from "@/lib/images";
import { site, mapsLink } from "@/lib/site";
import { waHref, telHref } from "@/lib/settings";
import { packagesHubGraph } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Umrah, Hajj and Tour Packages from Pakistan | Al Raqeem",
  },
  description:
    "Umrah, Hajj and international tour packages from Pakistan, quoted on inquiry for your exact dates. Visa, flights, hotels and Ziyarat handled by our team.",
  alternates: { canonical: "/packages" },
  openGraph: { url: "/packages" },
};

const hubFaqs = [
  {
    q: "How does pricing work for your packages?",
    a: "Package pricing is quoted on inquiry because airfare and hotel rates update every week. Our team checks live fares for your exact travel dates and sends the current best price on WhatsApp, with no hidden charges and no stale published numbers. Message our desk with your dates and group size for a same day quote.",
  },
  {
    q: "What is included in a package?",
    a: "Each package covers the core of the journey: visa, flights, hotels, ground transport, and guided sightseeing or Ziyarat. Umrah packages add hotels near the Haram with Makkah and Madinah Ziyarat, while tour packages add city sightseeing and excursions. Our desk confirms every inclusion in writing before you pay.",
  },
  {
    q: "Which cities do flights depart from?",
    a: "Umrah and Hajj flights depart from Peshawar and Islamabad, whichever carries the better fare and schedule for your dates. Our team arranges onward ground transport, and travelers from nearby towns coordinate airport pickup when they book. For international tours, our desk confirms the departure airport with your quote.",
  },
  {
    q: "Do packages include visa and flights?",
    a: "Yes. Every package includes the relevant visa and return flights, prepared and booked by our team. Umrah packages include the Saudi e-visa, and tour packages include the visit visa for the destination. Our desk checks every document before filing, so your visa clears without avoidable delays.",
  },
  {
    q: "What room sharing options are available for Umrah?",
    a: "Room sharing for Umrah follows your group size and budget, and our team arranges the layout that fits. Tell our desk how many travelers share a room, and we quote hotels near the Haram to match. Exact sharing and hotel names are confirmed for your dates before you pay.",
  },
  {
    q: "Do you build custom packages for my group?",
    a: "Yes. Our team builds custom packages for families, offices, and community groups of any size, to any destination we serve. Share your travel dates, group size, and the experience you want, and our desk designs the itinerary, arranges documents, and sends one quote for the whole group.",
  },
  {
    q: "How do I get a quote and book?",
    a: "Booking starts with one WhatsApp message or a visit to the Charsadda office. Our team sends package options and a quote for your exact dates the same day. Once you choose, a deposit secures your seats and rooms, the balance settles before departure, and every amount stays confirmed in writing.",
  },
  {
    q: "How early should I book, especially for Ramadan Umrah?",
    a: "Book as early as your dates allow, since hotels near the Haram and airline seats fill months ahead. Ramadan Umrah fills first, and the last Ashra sells out earliest, so plan well before Ramadan 2027. For tours, three to six weeks gives comfortable time for visa processing and the best fares.",
  },
  {
    q: "How do the economy, premium, and five star tiers differ?",
    a: "Economy suits budget conscious pilgrims, with shared rooms and hotels within walking or shuttle distance of the Haram. Premium and five star place you in hotels near or facing the Haram, with fewer travelers per room and private transport. Compare the tiers side by side above, then message our desk for a quote.",
  },
  {
    q: "What does a Hajj package cover beyond Umrah?",
    a: "A Hajj package keeps the Umrah rites and adds the days of Hajj: the standing at Arafat, the night at Muzdalifah, and the camps at Mina, with trained group leaders and pre-departure training. Our desk supports government scheme registration through MORA and arranges the full private Hajj program from booking to safe return.",
  },
  {
    q: "What is included in an international tour package?",
    a: "Each international tour package covers the visit visa, return flights, hotels, and guided sightseeing in one booking, from Dubai and Turkey to Baku and the Malaysia and Thailand combo. Our team prepares every document, books the flights and hotels, and confirms the full itinerary in writing before you pay.",
  },
  {
    q: "Do you adjust the hotels, dates, or duration within a package?",
    a: "Yes. Every package flexes around your dates, budget, and group. Our desk adjusts the hotel tier, the room sharing, the duration, and the departure city, then quotes the current best price for the version you choose. Tell us what matters most, and we build the package around it.",
  },
  {
    q: "What makes a package better than booking flights and hotels separately?",
    a: "A package puts the visa, flights, hotels, transport, and guided visits under one desk, so nothing falls between separate bookings. Our team checks every document, coordinates the timings, and stays reachable on WhatsApp from inquiry to safe return. One booking, one point of contact, one written confirmation.",
  },
];

export default async function PackagesPage() {
  const packages = await getPackages();
  const settings = await getSettings();

  // Inquiry based section: strip any price before it reaches the client.
  const clientPackages = packages.map((p) => ({ ...p, price: null }));

  return (
    <>
      <JsonLd data={packagesHubGraph(packages)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={photo(realPhotos.hero, images.kaaba)}
          alt="Umrah, Hajj and international travel packages from Pakistan"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="container-site relative py-20 sm:py-28">
          <p className="eyebrow text-brand-orange">Our packages</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
            Umrah, Hajj and Tour Packages from Pakistan
          </h1>
          <p className="mt-4 max-w-2xl font-display text-xl italic text-brand-orange sm:text-2xl">
            Curated journeys, one standard of care
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Every package is quoted on inquiry because rates update weekly with
            airfare and hotel availability, so you get the current best price for
            your exact dates with no hidden charges. Message our team on WhatsApp
            for a quote.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={waHref(
                settings.whatsapp,
                "Assalam o Alaikum, I want a quote for a package for my dates."
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
        </div>
      </section>

      {/* Airline partners */}
      <AirlineStrip />

      {/* Explorer: filters + both groups */}
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <PackagesExplorer
            packages={clientPackages}
            whatsapp={settings.whatsapp}
            intro="Al Raqeem arranges Umrah, Hajj, and international tour packages from Pakistan for 2026, across economy, premium, and five star tiers, from five to thirty day durations, departing from Peshawar, Islamabad, and beyond. Visa, flights, hotels, transport, and Ziyarat are handled end to end, so you compare journeys by what matters and leave the logistics to our desk."
          />
        </div>
      </section>

      {/* Tier comparison */}
      <section id="compare-tiers" className="scroll-mt-24 bg-paper py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading
            eyebrow="Compare Umrah tiers"
            title="Which Umrah tier fits you?"
            description="Compare the tiers by what actually differs, with no price in any cell."
            align="center"
          />
          <TierCompare />
        </div>
      </section>

      {/* Social proof: staging placeholders until real reviews are connected */}
      <Reviews data={reviewData} />

      {/* Trust and credentials */}
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading
            eyebrow="Trust and credentials"
            title="A registered agency you visit in person"
            description="Real proof over slogans. Message our desk or walk into the Charsadda office."
            align="center"
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-card sm:p-7">
              <p className="eyebrow">What stands behind us</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Sister company of {site.sisterCompany}, built on years of
                  serving pilgrims and travelers
                </li>
                <li className="flex items-start gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Head office at Aman Plaza, Mardan Road, Charsadda, open Monday
                  to Saturday
                </li>
                <li className="flex items-start gap-2.5 text-slate-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                  <span>
                    {stagingCredentials.registrationNumber}
                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      To add
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                  <span>
                    {stagingCredentials.moraLicence}
                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      To add
                    </span>
                  </span>
                </li>
              </ul>
              <p className="mt-4 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
                Official registration runs through the{" "}
                <a href="https://www.mora.gov.pk" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue underline">
                  MORA portal
                </a>{" "}
                in Pakistan and the{" "}
                <a href="https://www.nusuk.sa" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue underline">
                  Nusuk platform
                </a>{" "}
                in Saudi Arabia.
              </p>
            </div>
            <div className="flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-card sm:p-7">
              <p className="eyebrow">Your consultant</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>
                </span>
                <div>
                  <p className="flex items-center gap-2 font-semibold text-brand-blue-deep">
                    {stagingFounder.name}
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      To add
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">{stagingFounder.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Our desk stays with you from the first inquiry to your safe
                return, on WhatsApp and in person at the Charsadda office.
              </p>
              <Link
                href="/about"
                className="btn-outline mt-auto !py-2.5 text-sm"
              >
                Meet our team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Questions and answers</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              Package pricing, inclusions and booking
            </h2>
            <div className="gold-rule mx-auto mt-6" />
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Straight answers on how quotes work, what a package includes, and
              how to book from any city in Pakistan.
            </p>
          </div>
          <FaqAccordion items={hubFaqs} idBase="hub-faq" />
        </div>
      </section>

      <CtaBand
        title="Don't see your destination?"
        subtitle="We build custom packages for any destination and group size. Tell us where you want to go, and our desk sends a quote for your exact dates."
        officeHref={mapsLink()}
      />

      {/* Mobile sticky quote bar */}
      <MobileActionBar
        quoteHref={waHref(
          settings.whatsapp,
          "Assalam o Alaikum, I want a quote for a package for my dates."
        )}
        telHref={telHref(settings.phone)}
      />
    </>
  );
}
