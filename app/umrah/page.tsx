import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/Shared";
import SectionHeading from "@/components/SectionHeading";
import AirlineStrip from "@/components/AirlineStrip";
import JsonLd from "@/components/JsonLd";
import Reviews from "@/components/Reviews";
import FaqAccordion from "@/components/FaqAccordion";
import PackagesExplorer from "@/components/packages/PackagesExplorer";
import SeoBlurb from "@/components/SeoBlurb";
import TierCompare from "@/components/packages/TierCompare";
import MobileActionBar from "@/components/packages/MobileActionBar";
import LastUpdated from "@/components/LastUpdated";
import SearchInquiryWidget from "@/components/SearchInquiryWidget";
import DepartureCityDirectory from "@/components/DepartureCityDirectory";
import UmrahPlusStrip from "@/components/umrah/UmrahPlusStrip";
import SeasonalUmrahStrip from "@/components/umrah/SeasonalUmrahStrip";
import { getPackages } from "@/lib/packagesStore";
import { getSettings } from "@/lib/settingsStore";
import { reviewData } from "@/lib/reviews";
import { images, photo, realPhotos } from "@/lib/images";
import { site, mapsLink } from "@/lib/site";
import { waHref, telHref } from "@/lib/settings";
import { umrahHubGraph } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Umrah Packages from Pakistan | Al Raqeem",
  },
  description:
    "Umrah packages from Pakistan, quoted on inquiry for your exact dates. Economy, premium, and Ramadan Umrah with hotels near the Haram, visa, flights, and Ziyarat.",
  alternates: { canonical: "/umrah" },
  openGraph: { url: "/umrah" },
};

const hubFaqs = [
  {
    q: "How does pricing work for Umrah packages?",
    a: "Umrah pricing is quoted on inquiry because airfare and hotel rates update every week. Our team checks live fares for your exact travel dates and sends the current best price on WhatsApp, with no hidden charges and no stale published numbers. Message our desk with your dates and group size for a same day quote.",
  },
  {
    q: "What is included in an Umrah package?",
    a: "Each Umrah package covers the Saudi e-visa through Nusuk, return flights, hotels near the Haram, ground transport between Makkah and Madinah, and guided Ziyarat at both holy sites. Our desk confirms every inclusion in writing before you pay, so nothing on the journey surprises you.",
  },
  {
    q: "Which cities do Umrah flights depart from?",
    a: "Umrah flights depart from Peshawar and Islamabad, whichever carries the better fare and schedule for your dates. Our team arranges onward ground transport, and travelers from nearby towns coordinate airport pickup with our desk when they book.",
  },
  {
    q: "What room sharing options are available for Umrah?",
    a: "Room sharing for Umrah follows your group size and budget, and our team arranges the layout that fits, from quad to triple to double. Tell our desk how many travelers share a room, and we quote hotels near the Haram to match. Exact sharing and hotel names are confirmed for your dates before you pay.",
  },
  {
    q: "How do the economy, premium, and five star tiers differ?",
    a: "Economy suits budget conscious pilgrims, with shared rooms and hotels within walking or shuttle distance of the Haram. Premium and five star place you in hotels near or facing the Haram, with fewer travelers per room and private transport. Compare the tiers side by side above, then message our desk for a quote.",
  },
  {
    q: "How early should I book, especially for Ramadan Umrah?",
    a: "Book as early as your dates allow, since hotels near the Haram and airline seats fill months ahead. Ramadan Umrah fills first, and the last Ashra sells out earliest, so plan well before Ramadan 2027. For a regular Umrah, three to six weeks gives comfortable time for visa processing and the best fares.",
  },
  {
    q: "Do you build custom Umrah packages for my group?",
    a: "Yes. Our team builds custom Umrah packages for families, offices, and community groups of any size. Share your travel dates, group size, and the tier you want, and our desk designs the arrangements, prepares documents, and sends one quote for the whole group.",
  },
  {
    q: "Do you adjust the hotels, dates, or duration within a package?",
    a: "Yes. Every Umrah package flexes around your dates, budget, and group. Our desk adjusts the hotel tier, the room sharing, the duration, and the departure city, then quotes the current best price for the version you choose. Tell us what matters most, and we build the package around it.",
  },
  {
    q: "How do I get a quote and book an Umrah?",
    a: "Booking starts with one WhatsApp message or a visit to the Charsadda office. Our team sends options and a quote for your exact dates the same day. Once you choose, a deposit secures your seats and rooms, the balance settles before departure, and every amount stays confirmed in writing.",
  },
  {
    q: "Do you also arrange Hajj?",
    a: "Yes. Hajj sits in its own program with government scheme registration through MORA, Maktab camps at Mina and Arafat, trained group leaders, and pre-departure training. See the Hajj package for the full flow, or ask our desk to plan your Hajj alongside your Umrah.",
  },
  {
    q: "How close are your Umrah hotels to the Haram?",
    a: "Economy Umrah books hotels within walking or shuttle distance of the Haram, while premium and five star tiers sit near or facing it, steps from the gates. Exact hotel names and distances are confirmed for your travel dates before you pay, since the closest rooms fill early through the year.",
  },
  {
    q: "What is the Makkah and Madinah night split on an Umrah?",
    a: "Your nights split across Makkah and Madinah to suit your priorities, whether more days at Masjid al-Haram for worship or a longer stay in Madinah for the Rawdah and Ziyarat. The exact split is set for your dates and duration, and our desk confirms it with your quote.",
  },
];

export default async function UmrahHubPage() {
  const packages = await getPackages();
  const settings = await getSettings();

  // Inquiry based section: strip any price before it reaches the client.
  const clientPackages = packages.map((p) => ({ ...p, price: null }));

  return (
    <>
      <JsonLd data={umrahHubGraph(packages)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={photo(realPhotos.hero, images.kaaba)}
          alt="Umrah packages from Pakistan"
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
            <span className="text-white">Umrah</span>
          </nav>
          <LastUpdated tone="dark" className="mt-3" />
          <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
            Umrah Packages from Pakistan
          </h1>
          <p className="mt-4 max-w-2xl font-display text-xl italic text-brand-orange sm:text-2xl">
            Sacred journeys, one standard of care
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Economy, premium, and Ramadan Umrah, quoted on inquiry because rates
            update weekly with airfare and hotel availability, so you get the
            current best price for your exact dates with no hidden charges.
            Message our team on WhatsApp for a quote.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={waHref(
                settings.whatsapp,
                "Assalam o Alaikum, I want a quote for an Umrah package for my dates."
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

      {/* Explorer: Umrah packages */}
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <PackagesExplorer
            packages={clientPackages.filter(
              (p) => p.category === "Umrah & Hajj" && p.slug !== "hajj-package"
            )}
            whatsapp={settings.whatsapp}
            scope="umrah"
            intro="Al Raqeem arranges Umrah packages from Pakistan across economy, premium, and five star tiers, from fifteen to thirty day durations, departing from Peshawar and Islamabad. Visa, flights, hotels near the Haram, ground transport, and guided Ziyarat are handled end to end, so you compare journeys by what matters and leave the logistics to our desk."
          />
          <SeoBlurb
            eyebrow="Plan your pilgrimage"
            title="Umrah packages from Pakistan"
            paragraphs={[
              "Al Raqeem Travel & Tours is a full service Umrah, Hajj, tour, and visa agency in Charsadda, Khyber Pakhtunkhwa, and our Umrah desk arranges packages from Pakistan for pilgrims who want the whole journey handled by one team. Every package covers the Saudi Umrah e-visa through Nusuk, return flights from Peshawar and Islamabad, hotels near Masjid al-Haram in Makkah and Masjid an-Nabawi in Madinah, ground transport, and guided Ziyarat. Choose the economy tier with quad or triple sharing, the premium and five star tiers for hotels near or facing the Haram with private transport, or a Ramadan Umrah for Taraweeh, Itikaf, and Laylat al-Qadr in the last Ashra.",
              "First time pilgrims, families, and elderly travelers each get arrangements shaped around them, from connected rooms to airport assistance. Rates update weekly, so we quote the current best price for your dates on WhatsApp, with no hidden charges. Performing Hajj as well? Our desk plans the government MORA scheme and the private Hajj route alongside your Umrah. Message our Charsadda office, the sister company of Al Nafi Travels, to begin your journey.",
            ]}
          />
          <p className="mt-6 rounded-2xl border border-black/5 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-card">
            Performing Hajj instead? See our{" "}
            <Link
              href="/hajj"
              className="font-semibold text-brand-blue underline"
            >
              Hajj package and MORA guidance
            </Link>
            .
          </p>
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

      {/* Seasonal Umrah, the Islamic calendar pages */}
      <SeasonalUmrahStrip />

      {/* Umrah Plus combos, the bridge to the tours silo */}
      <UmrahPlusStrip />

      {/* Umrah by departure city, links down to the live city pages */}
      <DepartureCityDirectory />

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
                {site.credentials.companyNumber && (
                  <li className="flex items-start gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    Registration No. {site.credentials.companyNumber}
                  </li>
                )}
                {site.credentials.moraLicence && (
                  <li className="flex items-start gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    MORA Umrah operator No. {site.credentials.moraLicence}
                  </li>
                )}
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
              {site.founder.name && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>
                  </span>
                  <div>
                    <p className="font-semibold text-brand-blue-deep">
                      {site.founder.name}
                    </p>
                    <p className="text-xs text-slate-500">{site.founder.role}</p>
                  </div>
                </div>
              )}
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
              Umrah pricing, inclusions and booking
            </h2>
            <div className="gold-rule mx-auto mt-6" />
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Straight answers on how quotes work, what an Umrah package
              includes, and how to book from any city in Pakistan.
            </p>
          </div>
          <FaqAccordion items={hubFaqs} idBase="umrah-faq" />
        </div>
      </section>

      <CtaBand
        title="Ready to plan your Umrah?"
        subtitle="Tell us your dates, group size, and tier, and our desk sends a quote for your exact dates, with no hidden charges."
        officeHref={mapsLink()}
      />

      {/* Mobile sticky quote bar */}
      <MobileActionBar
        quoteHref={waHref(
          settings.whatsapp,
          "Assalam o Alaikum, I want a quote for an Umrah package for my dates."
        )}
        telHref={telHref(settings.phone)}
      />
    </>
  );
}
