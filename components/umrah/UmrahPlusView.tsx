import Link from "next/link";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import Reviews from "@/components/Reviews";
import FaqAccordion from "@/components/FaqAccordion";
import LastUpdated from "@/components/LastUpdated";
import MobileActionBar from "@/components/packages/MobileActionBar";
import SearchInquiryWidget from "@/components/SearchInquiryWidget";
import CaptionedImage from "@/components/packages/CaptionedImage";
import { reviewData } from "@/lib/reviews";
import { images } from "@/lib/images";
import { site, mapsLink } from "@/lib/site";
import { waHref, telHref } from "@/lib/settings";
import { travelAgencySchema } from "@/lib/schema";
import {
  type UmrahPlus,
  umrahPlusFaqs,
  liveUmrahPlus,
  comboHeroImage,
  comboEntityImages,
} from "@/lib/umrahPlus";

// The Umrah stages, shared across combos, the pilgrim served first.
const umrahStages = [
  {
    title: "Ihram and arrival",
    caption: "Pilgrims in Ihram at the Miqat before Umrah",
    detail:
      "Enter the state of Ihram at the Miqat, arrive in Makkah, and settle into a hotel near the Haram before the rites begin.",
    img: "",
  },
  {
    title: "Umrah in Makkah",
    caption: "The Holy Kaaba in Masjid al-Haram during Umrah",
    detail:
      "Perform the Tawaf around the Kaaba, the Sa'i between Safa and Marwah, and the Halq or Taqsir, completing the Umrah with guided support.",
    img: "kaaba",
  },
  {
    title: "Madinah and the Rawdah",
    caption: "Masjid an-Nabawi and the green dome in Madinah",
    detail:
      "Travel to Madinah for prayers at Masjid an-Nabawi, time in the Rawdah where the program allows, and guided Ziyarat of the historic sites.",
    img: "madinah",
  },
];

export default function UmrahPlusView({
  combo: c,
  settings,
}: {
  combo: UmrahPlus;
  settings: { whatsapp: string; phone: string };
}) {
  const quoteMsg = `Assalam o Alaikum, I want a quote for an Umrah Plus ${c.destination} package for my dates.`;
  const quoteHref = waHref(settings.whatsapp, quoteMsg);
  const faqs = umrahPlusFaqs(c);
  const heroImg = comboHeroImage[c.slug];
  const entityImgs = comboEntityImages[c.slug] ?? [];
  const others = liveUmrahPlus().filter((x) => x.slug !== c.slug);
  const sideways = c.tourHref ?? "/tours/international-tours";
  const sidewaysLabel = c.tourHref
    ? `See the pure ${c.destination} tour`
    : "Explore our international tours";

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Umrah", item: `${site.url}/umrah` },
          { "@type": "ListItem", position: 3, name: `Umrah Plus ${c.destination}`, item: `${site.url}/umrah/${c.slug}` },
        ],
      },
      {
        "@type": "TouristTrip",
        name: `Umrah Plus ${c.destination} Packages from Pakistan`,
        url: `${site.url}/umrah/${c.slug}`,
        description: c.overview,
        provider: travelAgencySchema(),
        touristType: ["Pilgrim", "Family", "Couple"],
        itinerary: {
          "@type": "ItemList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Umrah in Makkah" },
            { "@type": "ListItem", position: 2, name: "Madinah and the Rawdah" },
            ...c.destinationEntities.map((e, i) => ({
              "@type": "ListItem",
              position: i + 3,
              name: e.name,
            })),
          ],
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={graph} />

      {/* 1. Hero, quick facts, quote widget */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={images.heroKaaba}
          alt={`Umrah Plus ${c.destination}, the Holy Kaaba in Masjid al-Haram`}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="container-site relative py-16 sm:py-20">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/umrah" className="hover:text-white">Umrah</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">Umrah Plus {c.destination}</span>
          </nav>
          <p className="eyebrow mt-6 text-brand-orange">Umrah led, {c.destination} extension</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] text-white sm:text-5xl">
            Umrah Plus {c.destination} Packages from Pakistan
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-200">
            The pilgrimage first, then {c.destination} as a heritage and leisure extension on one booking, quoted on inquiry for your exact dates.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              {c.umrahMakkahNights} nights Makkah, {c.umrahMadinahNights} nights Madinah
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              {c.destinationNights} nights in {c.destination}
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              Departs Peshawar and Islamabad
            </span>
          </div>
          <div className="mt-6"><LastUpdated tone="dark" /></div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={quoteHref} target="_blank" rel="noopener noreferrer" className="btn-orange">Get a quote on WhatsApp</a>
            <a href={telHref(settings.phone)} className="btn border border-white/40 text-white hover:bg-white/10">Call {settings.phone}</a>
          </div>
          <div className="mt-8 max-w-3xl"><SearchInquiryWidget whatsapp={settings.whatsapp} /></div>
        </div>
      </section>

      {/* 2. Trust high */}
      <section className="bg-paper py-12">
        <div className="container-site grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
            <p className="font-display text-base text-brand-blue-deep">One booking, both legs</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Our Charsadda desk arranges the Umrah and the {c.destination} extension together, confirmed in writing before you pay.</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
            <p className="font-display text-base text-brand-blue-deep">Both visas, filed for you</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Our team files the Saudi Umrah visa through Nusuk and the {c.destination} visa alongside it, checking every page first.</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
            <p className="font-display text-base text-brand-blue-deep">The pilgrim served first</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">The Umrah is the anchor, with hotels near the Haram and guided Ziyarat, then {c.destination} follows as the extension.</p>
          </div>
        </div>
      </section>

      {/* 3. Overview */}
      <section className="py-14">
        <div className="container-site max-w-3xl">
          <p className="eyebrow">The combined journey</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">Umrah first, {c.destination} as the extension</h2>
          <div className="gold-rule mt-4" />
          <p className="mt-5 text-lg leading-relaxed text-slate-700">{c.overview}</p>
        </div>
      </section>

      {/* 4. The Umrah portion, the pilgrim first */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">The pilgrimage</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">Your Umrah in Makkah and Madinah</h2>
          <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-slate-600">
            The heart of the trip is the Umrah, {c.umrahMakkahNights} nights in Makkah near the Haram and {c.umrahMadinahNights} in Madinah near the Prophet's Mosque, with the rites guided and Ziyarat at both holy cities before the extension begins.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {umrahStages.map((s) => (
              <article key={s.title} className="rounded-2xl border border-black/5 bg-white p-4 shadow-card">
                <CaptionedImage
                  src={s.img === "kaaba" ? images.kaaba : s.img === "madinah" ? images.madinah : undefined}
                  caption={s.caption}
                  icon="moon"
                  aspect="aspect-[4/3]"
                />
                <h3 className="mt-3 font-display text-base text-brand-blue-deep">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The destination portion, the extension + Islamic heritage angle */}
      <section className="py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">The {c.destination} extension</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">{c.destination}, after the Haram</h2>
          <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-slate-600">{c.islamicHeritage}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.destinationEntities.map((e, i) => (
              <article key={e.name} className="rounded-2xl border border-black/5 bg-white p-4 shadow-card">
                <CaptionedImage src={entityImgs[i] || undefined} caption={e.caption} icon="pin" aspect="aspect-[4/3]" />
                <h3 className="mt-3 font-display text-base text-brand-blue-deep">{e.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{e.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Routing + 7. inclusions */}
      <section className="bg-brand-blue-deep py-14 text-white">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-brand-orange">How the trip combines</p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">The routing, one booking</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-200">{c.routing}</p>
          </div>
          <div>
            <p className="eyebrow text-brand-orange">What is included</p>
            <ul className="mt-4 space-y-2.5">
              {[
                `The Saudi Umrah e-visa through Nusuk and the ${c.destination} visa`,
                "Return flights and the connecting leg, one booking",
                "Hotels near the Haram and the Prophet's Mosque, and in " + c.destination,
                "Ground transport and the airport transfers on both legs",
                "Guided Ziyarat in Makkah and Madinah and the " + c.destination + " sightseeing named above",
              ].map((inc) => (
                <li key={inc} className="flex items-start gap-3 text-sm leading-relaxed text-slate-100">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-brand-orange" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  {inc}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-300">
              Not included: personal expenses, optional excursions, and anything not listed, spelled out in your quote before you pay.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Both visas, official sources */}
      <section className="py-14">
        <div className="container-site">
          <p className="eyebrow">Both visas, handled</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">The Saudi Umrah visa and the {c.destination} visa</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
              <p className="font-display text-base text-brand-blue-deep">The Saudi Umrah visa</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Our team prepares and files the Umrah e-visa through the official{" "}
                <a href="https://www.nusuk.sa" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue underline">Nusuk platform</a>, and checks every page. Verify the current rules at the official Saudi source.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
              <p className="font-display text-base text-brand-blue-deep">The {c.destination} visa</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Our team arranges the {c.destination} visa alongside the Umrah visa. Verify the current rules and apply at the official{" "}
                <a href={c.destinationVisa.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue underline">{c.destinationVisa.label}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Best time and cost drivers + 10. who for */}
      <section className="bg-paper py-14">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Best time and cost</p>
            <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">When to go, and why the quote moves</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{c.bestTime}</p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              An Umrah Plus {c.destination} has no fixed sticker, since airfare and hotel rates update every week. The season, the airline and the routing, the hotel category on both legs, and your group size set the quote. Our desk confirms the current best price for your exact dates in writing.
            </p>
          </div>
          <div>
            <p className="eyebrow">Who this is for</p>
            <ul className="mt-4 space-y-2.5">
              {c.whoFor.map((w) => (
                <li key={w} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-brand-orange-dark" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Reviews high */}
      <Reviews data={reviewData} />

      {/* Trust and accreditation, gated */}
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
                <p className="mt-4 font-semibold text-brand-blue-deep">{site.founder.name}</p>
                <p className="text-xs text-slate-500">{site.founder.role}</p>
              </>
            )}
            <p className="mt-4 text-sm leading-relaxed text-slate-600">Our desk stays with you from the first inquiry to your safe return, on WhatsApp and in person at the Charsadda office.</p>
            <Link href="/about" className="btn-outline mt-5 !py-2.5 text-sm">Meet our team</Link>
          </div>
        </div>
      </section>

      {/* 11. The silo bridge */}
      <section className="py-14">
        <div className="container-site">
          <p className="eyebrow">Compare and explore</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">The pilgrimage, the pure tour, and the other combos</h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/umrah" className="rounded-full border border-brand-blue/30 bg-brand-blue/5 px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue/10">All Umrah packages</Link>
            <Link href={sideways} className="rounded-full border border-brand-orange/40 bg-brand-orange/5 px-4 py-2 text-sm font-semibold text-brand-orange-dark hover:bg-brand-orange/10">{sidewaysLabel}</Link>
            {others.map((x) => (
              <Link key={x.slug} href={`/umrah/${x.slug}`} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-brand-blue-deep hover:border-brand-orange/40 hover:text-brand-orange-dark">Umrah Plus {x.destination}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Questions and answers</p>
            <h2 className="mt-3 font-display text-3xl text-brand-blue-deep sm:text-4xl">Umrah Plus {c.destination}, your questions</h2>
            <div className="gold-rule mx-auto mt-6" />
          </div>
          <FaqAccordion items={faqs} idBase={`up-${c.slug}`} />
        </div>
      </section>

      <CtaBand
        title={`Ready to plan your Umrah Plus ${c.destination}?`}
        subtitle="Tell us your dates, group size, and how long you want in each city, and our desk sends a quote for your exact dates."
        officeHref={mapsLink()}
      />

      <MobileActionBar quoteHref={quoteHref} telHref={telHref(settings.phone)} />
    </>
  );
}
