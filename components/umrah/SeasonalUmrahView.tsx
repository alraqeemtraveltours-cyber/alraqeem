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
  type SeasonalUmrah,
  seasonalFaqs,
  liveSeasonalUmrah,
} from "@/lib/seasonalUmrah";

const tierLinks = [
  { label: "Economy Umrah", href: "/umrah/economy-15-days" },
  { label: "Premium and five star Umrah", href: "/umrah/premium-21-days" },
  { label: "Ramadan Umrah", href: "/umrah/ramadan-umrah" },
];

export default function SeasonalUmrahView({
  season: s,
  settings,
}: {
  season: SeasonalUmrah;
  settings: { whatsapp: string; phone: string };
}) {
  const quoteMsg = `Assalam o Alaikum, I want a quote for a ${s.season} Umrah package for my dates.`;
  const quoteHref = waHref(settings.whatsapp, quoteMsg);
  const faqs = seasonalFaqs(s);
  const heroImg = s.heroImage === "madinah" ? images.madinah : images.kaaba;
  const others = liveSeasonalUmrah().filter((x) => x.slug !== s.slug);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Umrah", item: `${site.url}/umrah` },
          { "@type": "ListItem", position: 3, name: `${s.season} Umrah`, item: `${site.url}/umrah/${s.slug}` },
        ],
      },
      {
        "@type": "TouristTrip",
        name: `${s.season} Umrah Packages from Pakistan`,
        url: `${site.url}/umrah/${s.slug}`,
        description: s.significance,
        provider: travelAgencySchema(),
        touristType: ["Pilgrim", "Family", "Group"],
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
          alt={`${s.season} Umrah, the Holy Kaaba in Masjid al-Haram`}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="container-site relative py-16 sm:py-20">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/umrah" className="hover:text-white">Umrah</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{s.season} Umrah</span>
          </nav>
          <p className="eyebrow mt-6 text-brand-orange">{s.hijriMonth}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] text-white sm:text-5xl">
            {s.season} Umrah Packages from Pakistan
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-200">
            {s.season} {s.hijriYear} falls {s.gregorianWindow}. The Saudi visa, hotels near the Haram, and guided Ziyarat, quoted on inquiry for your exact dates.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              {s.hijriYear}, {s.gregorianWindow}
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              Departs Peshawar and Islamabad
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
              Economy, premium, and five star
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
            <p className="font-display text-base text-brand-blue-deep">Run from our Charsadda office</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Our desk arranges your {s.season} Umrah in person or on WhatsApp, confirmed in writing before you pay.</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
            <p className="font-display text-base text-brand-blue-deep">Nusuk visa, filed for you</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Our team files the Saudi Umrah e-visa through the official{" "}
              <a href="https://www.nusuk.sa" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue underline">Nusuk platform</a>, checking every page first.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
            <p className="font-display text-base text-brand-blue-deep">Booked for the season ahead</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Our team secures hotels near the Haram for the {s.season} window early, since the best fill first.</p>
          </div>
        </div>
      </section>

      {/* 3. The season's significance */}
      <section className="py-16 sm:py-20">
        <div className="container-site grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Why {s.season}</p>
            <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">The significance of {s.season}</h2>
            <div className="gold-rule mt-4" />
            <p className="mt-5 text-base leading-relaxed text-slate-700">{s.significance}</p>
          </div>
          <CaptionedImage src={heroImg} caption={s.heroCaption} icon="moon" aspect="aspect-[4/3]" />
        </div>
      </section>

      {/* 4. When it falls */}
      <section className="bg-paper py-14">
        <div className="container-site max-w-3xl">
          <p className="eyebrow">When it falls, and booking</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">{s.season} {s.hijriYear} dates</h2>
          <div className="gold-rule mt-4" />
          <p className="mt-5 text-base leading-relaxed text-slate-700">{s.datesNote}</p>
          <p className="mt-3 text-base leading-relaxed text-slate-700">{s.demandNote}</p>
        </div>
      </section>

      {/* 6. Ramadan extra depth, the Ashras and Itikaf, rendered when present */}
      {s.subSegments.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-site">
            <p className="eyebrow">Inside the month</p>
            <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">The three Ashras and the last ten days</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {s.subSegments.map((seg) => (
                <div key={seg.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                  <h3 className="font-display text-lg text-brand-blue-deep">{seg.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{seg.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5 + 7. Inclusions and cost drivers */}
      <section className="bg-brand-blue-deep py-14 text-white">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-brand-orange">What is included</p>
            <ul className="mt-4 space-y-2.5">
              {[
                "The Saudi Umrah e-visa, filed through Nusuk",
                "Return flights from Peshawar or Islamabad",
                "Hotels near the Haram in Makkah and Madinah",
                "Ground transport between the two holy cities",
                "Guided Ziyarat at Masjid al-Haram and Masjid an-Nabawi",
              ].map((inc) => (
                <li key={inc} className="flex items-start gap-3 text-sm leading-relaxed text-slate-100">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-brand-orange" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  {inc}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-300">Available across economy, premium, and five star tiers, confirmed for your group before you pay.</p>
          </div>
          <div>
            <p className="eyebrow text-brand-orange">Why the quote moves</p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">{s.season} cost drivers</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-200">
              A {s.season} Umrah has no fixed sticker, since airfare and hotel rates update every week. The season sets much of it, and {s.season} sits {s.subSegments.length > 0 ? "at the top of the range, the last ten days highest of all" : "in the calmer, more affordable part of the range"}, alongside the hotel category and its distance from the Haram, the room sharing, and your group size. Our desk confirms the current best price for your exact dates in writing.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Who this is for and planning */}
      <section className="py-14">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Who this is for</p>
            <ul className="mt-4 space-y-2.5">
              {s.bestFor.map((w) => (
                <li key={w} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-brand-orange-dark" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Planning tips</p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{s.planningTips}</p>
          </div>
        </div>
      </section>

      {/* 11. Reviews high */}
      <Reviews data={reviewData} />

      {/* 12. Trust and accreditation, gated */}
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

      {/* 9. The Umrah bridge */}
      <section className="py-14">
        <div className="container-site">
          <p className="eyebrow">Plan your Umrah</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">The tiers, and Umrah in other months</h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/umrah" className="rounded-full border border-brand-blue/30 bg-brand-blue/5 px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue/10">All Umrah packages</Link>
            {tierLinks.filter((t) => t.href !== `/umrah/${s.slug}`).map((t) => (
              <Link key={t.href} href={t.href} className="rounded-full border border-brand-orange/40 bg-brand-orange/5 px-4 py-2 text-sm font-semibold text-brand-orange-dark hover:bg-brand-orange/10">{t.label}</Link>
            ))}
            {others.map((x) => (
              <Link key={x.slug} href={`/umrah/${x.slug}`} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-brand-blue-deep hover:border-brand-orange/40 hover:text-brand-orange-dark">{x.season} Umrah</Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Questions and answers</p>
            <h2 className="mt-3 font-display text-3xl text-brand-blue-deep sm:text-4xl">{s.season} Umrah, your questions</h2>
            <div className="gold-rule mx-auto mt-6" />
          </div>
          <FaqAccordion items={faqs} idBase={`su-${s.slug}`} />
        </div>
      </section>

      <CtaBand
        title={`Ready to plan your ${s.season} Umrah?`}
        subtitle="Tell us your dates, group size, and tier, and our desk sends a quote for your exact dates, with no hidden charges."
        officeHref={mapsLink()}
      />

      <MobileActionBar quoteHref={quoteHref} telHref={telHref(settings.phone)} />
    </>
  );
}
