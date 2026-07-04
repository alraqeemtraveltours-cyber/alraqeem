import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackage, getPackages } from "@/lib/packagesStore";
import type { TravelPackage } from "@/lib/packages";
import { packageImage, images } from "@/lib/images";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import PackageInquiryCard from "@/components/packages/PackageInquiryCard";
import TierCompare from "@/components/packages/TierCompare";
import Icon, { inclusionIcon } from "@/components/packages/DetailIcons";
import StickyQuoteCard from "@/components/packages/StickyQuoteCard";
import MobileActionBar from "@/components/packages/MobileActionBar";
import Reviews from "@/components/Reviews";
import { getSettings } from "@/lib/settingsStore";
import { waHref, telHref } from "@/lib/settings";
import { site, mapsLink } from "@/lib/site";
import { reviewData } from "@/lib/reviews";
import { stagingCredentials, stagingFounder } from "@/lib/staging";
import { packageDetailGraph } from "@/lib/schema";
import {
  getDetail,
  tierOf,
  departureCities,
  hotelHighlight,
  standardExclusions,
  documentsFor,
  bookingSteps,
  itinerary,
  detailFaqs,
  ziyaratSites,
  ramadanAshras,
  ramadanTiers,
  ramadanFastingTips,
  hajjSchemes,
  maktabCategories,
  minaFacilities,
  hajjJourney,
  hajjVisaDocs,
  hajjTraining,
} from "@/lib/packageDetail";

export const dynamic = "force-dynamic";

const TITLE_SUFFIX = " from Pakistan | Al Raqeem";

// Ramadan targets "package", which outranks "special" in search. The visible
// title, H1, and meta use the package wording, while the slug stays
// "ramadan-umrah-special" to keep the live URL from breaking.
function displayName(pkg: TravelPackage) {
  return pkg.slug === "ramadan-umrah-special"
    ? "Ramadan Umrah Package"
    : pkg.title;
}

// Clean the stored name for use in the title tag and meta: ampersands become
// "and", colons drop, so no HTML entities leak into head tags.
function cleanName(title: string) {
  return title
    .replace(/&/g, "and")
    .replace(/:/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Build a title of "[Name] from Pakistan | Al Raqeem", trimmed to 58 by
// dropping trailing words at word boundaries. No dashes.
function detailTitle(pkg: TravelPackage) {
  // Hajj targets the plural head term in the title tag, singular in the H1.
  if (pkg.slug === "hajj-package") {
    return "Hajj Packages from Pakistan | Al Raqeem";
  }
  const clean = cleanName(displayName(pkg));
  let words = clean.split(/\s+/);
  let name = clean;
  while ((name + TITLE_SUFFIX).length > 58 && words.length > 1) {
    words = words.slice(0, -1);
    name = words
      .join(" ")
      .replace(/[\s,]+(and|or|with|the|of|in)$/i, "")
      .trim();
  }
  return `${name}${TITLE_SUFFIX}`;
}

// Plain text meta, 156 or fewer, no HTML, no price.
function detailMeta(pkg: TravelPackage) {
  if (pkg.slug === "ramadan-umrah-special") {
    return "Ramadan Umrah Package from Pakistan. Last Ashra and Laylat al-Qadr stays, flexible durations, hotels booked early. Quoted on inquiry via WhatsApp.";
  }
  if (pkg.slug === "hajj-package") {
    return "Hajj Package from Pakistan. MORA scheme guidance and a private Hajj route through a Saudi approved operator, with scholar led training. Quoted on inquiry.";
  }
  const clean = cleanName(displayName(pkg));
  const base = `${clean} from Pakistan. Quoted on inquiry for your dates, with visa, flights and hotels handled. Message on WhatsApp for a quote.`;
  if (base.length <= 156) return base;
  return `${clean} from Pakistan. Quoted on inquiry for your dates. Visa, flights and hotels handled by our desk.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return {};
  return {
    title: { absolute: detailTitle(pkg) },
    description: detailMeta(pkg),
    alternates: { canonical: `/packages/${pkg.slug}` },
    openGraph: { url: `/packages/${pkg.slug}` },
  };
}

// Consistent section header: eyebrow, serif heading, gold rule.
function Head({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
        {title}
      </h2>
      <div className="gold-rule mt-4" />
    </div>
  );
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  const settings = await getSettings();
  const detail = getDetail(pkg);
  const tier = tierOf(pkg);
  const departure = departureCities(pkg);
  const hotel = hotelHighlight(pkg);
  const documents = documentsFor(pkg);
  const isPilgrimage = pkg.category === "Umrah & Hajj";
  const isUmrah = /umrah/i.test(pkg.slug) || /umrah/i.test(pkg.title);
  const isRamadan = pkg.slug === "ramadan-umrah-special";
  const isHajj = pkg.slug === "hajj-package";
  const displayTitle = displayName(pkg);
  const groupName = isPilgrimage ? "Umrah and Hajj" : "International";
  const heroImage = packageImage(pkg.slug, pkg.category, pkg.image);

  const quoteHref = waHref(
    settings.whatsapp,
    `Assalam o Alaikum, I want a quote for the "${displayTitle}" (${pkg.duration}) package for my dates.`
  );
  const callHref = telHref(settings.phone);
  const checklistHref = waHref(
    settings.whatsapp,
    `Assalam o Alaikum, please send the document checklist for the "${displayTitle}" package.`
  );

  // Overview: pull the first sentence as a lead line (presentation only).
  const sentences = detail.overview.split(/(?<=\.)\s+/);
  const overviewLead = sentences[0];
  const overviewRest = sentences.slice(1).join(" ");

  // Documents: surface the "processed by our team" line as a note row.
  const visaNote = documents.find((d) => /processed by our team/i.test(d));
  const docList = documents.filter((d) => d !== visaNote);

  // Related guide and visa cross-links. Only resolving links; missing
  // destination guides go to the gaps report.
  const crossLinks = isPilgrimage
    ? [
        {
          label: "First-time Umrah guide",
          href: "/blog/first-time-umrah-guide-pakistan",
        },
        { label: "Saudi and Umrah visa services", href: "/visa-services" },
      ]
    : pkg.slug === "dubai-5-days"
      ? [
          {
            label: "Dubai visit visa guide",
            href: "/blog/dubai-visit-visa-requirements-pakistan",
          },
          { label: "UAE visit visa services", href: "/visa-services" },
        ]
      : [
          { label: "Visit visa services", href: "/visa-services" },
          { label: "Travel guides", href: "/blog" },
        ];

  // Nights and nearness (Umrah only). Real walking indicator, no invented split.
  const nearness =
    hotel && /walking/i.test(hotel)
      ? "Walking distance to the Haram"
      : hotel && /facing/i.test(hotel)
        ? "Facing the Haram"
        : null;
  const showNights = isUmrah && !!hotel;
  const showHotelCard = !isUmrah && !!hotel;

  const facts = [
    { icon: "clock", label: "Duration", value: pkg.duration },
    ...(tier ? [{ icon: "tag", label: "Tier", value: tier }] : []),
    ...(departure.length > 0
      ? [{ icon: "pin", label: "Departs from", value: departure.join(", ") }]
      : []),
    { icon: "grid", label: "Category", value: groupName },
  ];

  const trust = [
    { icon: "hotel", text: "Charsadda office you visit in person" },
    { icon: "shield", text: "Sister company of Al Nafi Travels" },
    { icon: "phone", text: "WhatsApp support from inquiry to safe return" },
  ];

  const all = await getPackages();
  const related = [
    ...all.filter((p) => p.category === pkg.category && p.slug !== pkg.slug),
    ...all.filter((p) => p.category !== pkg.category && p.slug !== pkg.slug),
  ]
    .slice(0, 3)
    .map((p) => ({ ...p, price: null }));

  return (
    <>
      <JsonLd data={packageDetailGraph(pkg)} />

      {/* Hero, bold moment 1 */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={heroImage}
          alt={`${displayTitle} from Pakistan`}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="absolute inset-0 bg-brand-blue-deep/25" />
        <div className="container-site relative py-20 sm:py-28">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-slate-200"
          >
            <Link href="/packages" className="hover:text-white">
              Packages
            </Link>
            <span aria-hidden="true">/</span>
            <span>{groupName}</span>
            <span aria-hidden="true">/</span>
            <span className="text-white">{displayTitle}</span>
          </nav>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-blue-deep">
              {pkg.duration}
            </span>
            {tier && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {tier}
              </span>
            )}
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
            {displayTitle} from Pakistan
          </h1>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange"
            >
              Get a quote
            </a>
            <a
              href={callHref}
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              Call {settings.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Content: main column plus sticky quote card */}
      <section className="bg-paper py-12 sm:py-16">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            {/* Main column */}
            <div className="space-y-14 lg:col-span-2">
              {/* Mobile quick facts rail */}
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card lg:hidden">
                <dl className="grid grid-cols-2 gap-4">
                  {facts.map((f) => (
                    <div key={f.label} className="flex items-center gap-2.5">
                      <Icon
                        name={f.icon}
                        size={20}
                        className="shrink-0 text-brand-orange-dark"
                      />
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          {f.label}
                        </dt>
                        <dd className="text-sm font-semibold text-brand-blue-deep">
                          {f.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Overview, calm */}
              <section>
                <Head eyebrow="Overview" title={`${displayTitle} from Pakistan`} />
                <p className="mt-6 max-w-[65ch] font-display text-xl leading-snug text-brand-blue-deep">
                  {overviewLead}
                </p>
                {overviewRest && (
                  <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    {overviewRest}
                  </p>
                )}
              </section>

              {/* Ramadan by Ashra */}
              {pkg.slug === "ramadan-umrah-special" && (
                <section>
                  <Head
                    eyebrow="Ramadan by Ashra"
                    title="The three ten-night stretches of Ramadan"
                  />
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {ramadanAshras.map((a) => (
                      <div
                        key={a.name}
                        className={`rounded-2xl border p-6 shadow-card ${a.last ? "border-brand-orange/40 bg-brand-orange/5" : "border-black/5 bg-white"}`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                          {a.nights}
                        </p>
                        <h3 className="mt-1 font-display text-lg text-brand-blue-deep">
                          {a.name}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {a.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Exact Gregorian dates for each Ashra follow the Ramadan moon
                    sighting and are confirmed with your booking for Ramadan
                    2027. The last ten nights book earliest, so plan two to three
                    months ahead.
                  </p>
                </section>
              )}

              {/* Ramadan tiers, no price */}
              {isRamadan && (
                <section>
                  <Head
                    eyebrow="Ramadan tiers"
                    title="Three ways to stay for Ramadan"
                  />
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {ramadanTiers.map((t) => (
                      <div
                        key={t.name}
                        className={`rounded-2xl border p-6 shadow-card ${t.last ? "border-brand-orange/40 bg-brand-orange/5" : "border-black/5 bg-white"}`}
                      >
                        <h3 className="font-display text-lg text-brand-blue-deep">
                          {t.name}
                        </h3>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                          <Icon name="walk" size={14} />
                          {t.proximity}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                          {t.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Exact hotels, room sharing, and the Makkah and Madinah night
                    split are confirmed for your dates before you pay, since
                    Ramadan rooms sell out early. Prices are quoted on inquiry
                    for your chosen tier and nights.
                  </p>
                </section>
              )}

              {/* Government, private, and sponsorship schemes */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="Hajj schemes"
                    title="Government, private, and sponsorship routes"
                  />
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {hajjSchemes.map((s) => (
                      <div
                        key={s.name}
                        className="rounded-2xl border border-black/5 bg-white p-6 shadow-card"
                      >
                        <Icon
                          name={s.icon}
                          size={24}
                          className="text-brand-orange-dark"
                        />
                        <h3 className="mt-3 font-display text-lg text-brand-blue-deep">
                          {s.name}
                        </h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                          {s.lead}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                          {s.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-600">
                    Our honest position stays the same across routes: register
                    free on the government MORA scheme, then travel with us on
                    the private package for full document support, trained group
                    leaders, and camp services. Verify the current cycle, quota,
                    and dates at the official{" "}
                    <a
                      href="https://www.mora.gov.pk/Detail/YTI4ZjNkYzAtNGNmMi00MzBiLWFlZmYtOTg5MGI5ZmRiY2Nm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-blue underline"
                    >
                      MORA portal
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://www.nusuk.sa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-blue underline"
                    >
                      Nusuk
                    </a>
                    .
                  </p>
                </section>
              )}

              {/* Registered operator and how to verify, anti scam */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="Verify before you pay"
                    title="Booking through an approved operator"
                  />
                  <div className="mt-6 rounded-2xl border border-brand-orange/30 bg-brand-orange/10 p-6 sm:p-7">
                    <p className="flex items-start gap-3 text-base leading-relaxed text-brand-blue-deep">
                      <Icon
                        name="shield"
                        size={24}
                        className="mt-0.5 shrink-0 text-brand-orange-dark"
                      />
                      <span>
                        Saudi Arabia lists approved Hajj and Umrah providers on
                        the official Nusuk platform, so you confirm any operator
                        before money changes hands. Ask our desk for the
                        registration details, check them on Nusuk, and never pay
                        an operator you have not verified. Booking through an
                        approved provider is the surest guard against Hajj fraud.
                      </span>
                    </p>
                    <ul className="mt-5 space-y-2 border-t border-brand-orange/25 pt-5 text-sm text-brand-blue-deep">
                      <li className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-500">Our operator number:</span>
                        <span className="font-semibold">
                          {stagingCredentials.moraLicence}
                        </span>
                        <span className="rounded bg-brand-blue-deep/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-blue-deep">
                          To add
                        </span>
                      </li>
                    </ul>
                    <a
                      href="https://www.nusuk.sa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline mt-5 !py-2.5 text-sm"
                    >
                      Verify approved operators on Nusuk
                    </a>
                  </div>
                </section>
              )}

              {/* Maktab category */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="Maktab category"
                    title="Your service group in Mina"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    The Maktab is the service group that sets your tent location
                    and comfort during the days in Mina, the core Hajj decision
                    behind the price difference.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {maktabCategories.map((m) => (
                      <div
                        key={m.name}
                        className={`rounded-2xl border p-6 shadow-card ${m.highlight ? "border-brand-orange/40 bg-brand-orange/5" : "border-black/5 bg-white"}`}
                      >
                        <h3 className="font-display text-lg text-brand-blue-deep">
                          {m.name}
                        </h3>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                          <Icon name="pin" size={14} />
                          {m.tag}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                          {m.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Mina, Arafat, and Muzdalifah facilities */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="In the camps"
                    title="Mina and Arafat facilities"
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {minaFacilities.map((f) => (
                      <div
                        key={f.title}
                        className="rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                          <Icon name={f.icon} size={22} />
                        </span>
                        <h3 className="mt-3 font-display text-base text-brand-blue-deep">
                          {f.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {f.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Facilities follow your Maktab category, and the exact camp is
                    assigned through the scheme, so the final tent and its
                    services are confirmed for your booking.
                  </p>
                </section>
              )}

              {/* Hotels and stay, Hajj, honest with gaps logged */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="Hotels and stay"
                    title="Makkah, Madinah, and Aziziyah"
                  />
                  <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                    <p className="text-base leading-relaxed text-slate-700">
                      Your stay splits across hotels in Makkah and Madinah and an
                      Aziziyah base for the Mina days, in an order set by your
                      scheme and flights, whether Makkah first or Madinah first.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">
                      Exact hotel names, distances to the Haram, and the day
                      count are confirmed for your travel dates before you pay,
                      since the closest properties and the Aziziyah base book
                      early. Message our desk for the current properties on your
                      dates.
                    </p>
                  </div>
                </section>
              )}

              {/* What is included, icon card grid */}
              <section>
                <Head eyebrow="What is included" title="Your package covers" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {pkg.highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                        <Icon name={inclusionIcon(h)} size={22} />
                      </span>
                      <p className="pt-1.5 text-sm leading-relaxed text-slate-700">
                        {h}
                      </p>
                    </div>
                  ))}
                </div>
                {isRamadan && (
                  <p className="mt-5 flex items-start gap-3 rounded-xl bg-brand-orange/10 p-4 text-sm leading-relaxed text-brand-blue-deep">
                    <Icon
                      name="hotel"
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-orange-dark"
                    />
                    <span>
                      Suhoor before dawn and Iftar at sunset are not
                      automatically included and depend on your hotel and package
                      version. Our desk confirms the meal plan with your quote,
                      and many hotels near the Haram serve both through the
                      month.
                    </span>
                  </p>
                )}
                {isHajj && (
                  <p className="mt-5 flex items-start gap-3 rounded-xl bg-brand-orange/10 p-4 text-sm leading-relaxed text-brand-blue-deep">
                    <Icon
                      name="document"
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-orange-dark"
                    />
                    <span>
                      A full Hajj package typically covers the Maktab tents in
                      Mina and Arafat, hotels in Makkah, Madinah, and Aziziyah,
                      return flights, ground transport by bus and, where the
                      route uses it, the Haramain high speed rail, buffet meals,
                      a guide and scholar, and the Hajj visa. Exact inclusions
                      are confirmed in writing for your scheme and dates, and the
                      Saudi Hajj visa is processed by our team rather than
                      promised as a government fast track.
                    </span>
                  </p>
                )}
              </section>

              {/* What is not included, muted card */}
              <section>
                <Head
                  eyebrow="What is not included"
                  title="Kept out for clarity"
                />
                <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-paper/50 p-6">
                  <ul className="space-y-3">
                    {standardExclusions.map((x) => (
                      <li
                        key={x}
                        className="flex items-start gap-3 text-sm leading-relaxed text-slate-500"
                      >
                        <Icon
                          name="xCircle"
                          size={18}
                          className="mt-0.5 shrink-0 text-slate-400"
                        />
                        {x}
                      </li>
                    ))}
                  </ul>
                  {isHajj && (
                    <p className="mt-4 border-t border-black/10 pt-4 text-sm leading-relaxed text-slate-600">
                      Qurbani, also called Dam, is arranged where your package
                      includes it and is confirmed in writing before you pay.
                      Some packages handle it through the official Saudi channel
                      on your behalf, while others leave it for you to arrange,
                      so ask our desk which applies to your package.
                    </p>
                  )}
                </div>
              </section>

              {/* Nights and nearness, bold moment 2 (Umrah) */}
              {showNights && (
                <section>
                  <Head eyebrow="Hotels and stay" title="Nights and nearness" />
                  <div className="mt-6 overflow-hidden rounded-3xl bg-brand-blue-deep text-white shadow-lift">
                    <div className="grid md:grid-cols-2">
                      <div className="p-7 sm:p-8">
                        <p className="font-display text-2xl text-white">
                          {pkg.duration} across Makkah and Madinah
                        </p>
                        <div className="mt-5 grid grid-cols-2 gap-4">
                          <div className="rounded-2xl border border-brand-orange/30 bg-white/5 p-4">
                            <Icon
                              name="hotel"
                              size={22}
                              className="text-brand-orange"
                            />
                            <p className="mt-2 font-display text-lg text-white">
                              Makkah
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                              Masjid al-Haram and Ziyarat
                            </p>
                          </div>
                          <div className="rounded-2xl border border-brand-orange/30 bg-white/5 p-4">
                            <Icon
                              name="hotel"
                              size={22}
                              className="text-brand-orange"
                            />
                            <p className="mt-2 font-display text-lg text-white">
                              Madinah
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                              Masjid an-Nabawi and Ziyarat
                            </p>
                          </div>
                        </div>
                        {nearness && (
                          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-brand-orange/15 px-4 py-2 text-sm font-medium text-white">
                            <Icon
                              name="walk"
                              size={18}
                              className="text-brand-orange"
                            />
                            {nearness}
                          </div>
                        )}
                        <p className="mt-5 text-sm leading-relaxed text-slate-300">
                          {hotel}. Exact hotel names and room sharing are
                          confirmed for your travel dates before you pay, since
                          the closest options book early. Message our team for
                          the current details.
                        </p>
                        {isRamadan && (
                          <p className="mt-3 text-sm font-medium leading-relaxed text-brand-orange">
                            In Ramadan the closest hotels sell out first, so the
                            last Ashra books earliest of all.
                          </p>
                        )}
                      </div>
                      <div className="relative min-h-[220px] md:min-h-full">
                        <img
                          src={images.madinah}
                          alt="Hotels near the Haram in Makkah and Madinah"
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Hotels and stay, plain card (tours) */}
              {showHotelCard && (
                <section>
                  <Head eyebrow="Hotels and stay" title="Where you stay" />
                  <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                    <p className="flex items-start gap-3 text-base leading-relaxed text-slate-700">
                      <Icon
                        name="hotel"
                        size={22}
                        className="mt-0.5 shrink-0 text-brand-orange-dark"
                      />
                      <span>{hotel}.</span>
                    </p>
                    <p className="mt-3 pl-9 text-sm leading-relaxed text-slate-500">
                      Exact hotel names and room sharing are confirmed for your
                      travel dates before you pay, since the closest options book
                      early. Message our team for the current details.
                    </p>
                  </div>
                </section>
              )}

              {/* Why Ramadan costs more */}
              {isRamadan && (
                <section>
                  <Head
                    eyebrow="Ramadan pricing"
                    title="Why Ramadan costs more"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    Ramadan rates rise for three honest reasons: peak demand
                    across the whole month, the last ten nights drawing the
                    largest crowds of the year, and a premium on the hotels
                    closest to the Haram. Airline seats tighten in the same
                    weeks, and the nearest rooms fill months ahead. Our desk
                    quotes the current best price for your exact dates rather
                    than a stale published figure.
                  </p>
                </section>
              )}

              {/* When to book */}
              {isRamadan && (
                <section>
                  <Head
                    eyebrow="When to book"
                    title="Book two to three months ahead"
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      {
                        icon: "hotel",
                        title: "Lock the nights near the Haram",
                        detail:
                          "Early bookings hold the closest hotels before the last Ashra rooms sell out.",
                      },
                      {
                        icon: "plane",
                        title: "Secure airline seats",
                        detail:
                          "Ramadan flights from Peshawar and Islamabad fill fast, so seats are reserved well ahead.",
                      },
                      {
                        icon: "clock",
                        title: "Plan your durations",
                        detail:
                          "Choose your Ashra and duration early, from ten to thirty days, around work and family.",
                      },
                    ].map((c) => (
                      <div
                        key={c.title}
                        className="rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <Icon
                          name={c.icon}
                          size={22}
                          className="text-brand-orange-dark"
                        />
                        <h3 className="mt-3 font-display text-base text-brand-blue-deep">
                          {c.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {c.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Message our desk as soon as your dates are set, since the
                    closest Ramadan rooms and the best fares go first.
                  </p>
                </section>
              )}

              {/* Itikaf and Laylat al-Qadr, honest scope */}
              {isRamadan && (
                <section>
                  <Head
                    eyebrow="Itikaf and Laylat al-Qadr"
                    title="What we arrange, stated plainly"
                  />
                  <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                    <p className="text-base leading-relaxed text-slate-700">
                      Itikaf is arranged on request during the last Ashra and
                      depends on hotel availability, so our desk presents it as
                      requested, not guaranteed. Rooms near the Haram for the
                      odd nights of Laylat al-Qadr are booked as close as
                      availability allows, without promising a specific hotel or
                      a view facing the Haram. Tell our team your intended
                      nights early, and we hold the nearest option we secure for
                      your dates.
                    </p>
                  </div>
                </section>
              )}

              {/* Fasting and health tips */}
              {isRamadan && (
                <section>
                  <Head
                    eyebrow="Fasting and health"
                    title="Staying well while you fast"
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {ramadanFastingTips.map((t) => (
                      <div
                        key={t.title}
                        className="rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <h3 className="font-display text-base text-brand-blue-deep">
                          {t.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {t.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Reward of Umrah in Ramadan, attributed */}
              {isRamadan && (
                <section className="rounded-3xl border border-brand-orange/30 bg-brand-orange/10 p-6 sm:p-8">
                  <p className="eyebrow text-brand-orange-dark">
                    The reward of the season
                  </p>
                  <p className="mt-3 max-w-[65ch] font-display text-xl leading-snug text-brand-blue-deep">
                    A sound Hadith in Bukhari and Muslim relates that the
                    Prophet, peace be upon him, said an Umrah in Ramadan equals a
                    Hajj in reward, though it does not replace the obligation of
                    Hajj itself.
                  </p>
                </section>
              )}

              {/* Sample itinerary. Hajj uses the day by day journey below. */}
              {!isHajj && (
              <section>
                <Head
                  eyebrow="Sample itinerary"
                  title="A typical flow, not fixed dates"
                />
                <ol className="mt-6 space-y-4">
                  {itinerary(pkg).map((step, i) => (
                    <li
                      key={step.phase}
                      className="flex gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 font-display text-sm font-bold text-brand-orange-dark">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-display text-base text-brand-blue-deep">
                          {step.phase}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                {isPilgrimage && (
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    The exact night split between Makkah and Madinah is confirmed
                    for your travel dates.
                  </p>
                )}
              </section>
              )}

              {/* The Hajj journey, day by day across Dhul Hijjah */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="The Hajj journey"
                    title="Day by day, the 8th to the 13th of Dhul Hijjah"
                  />
                  <ol className="mt-6 space-y-4">
                    {hajjJourney.map((step, i) => (
                      <li
                        key={step.title}
                        className="flex gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 font-display text-sm font-bold text-brand-orange-dark">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                            {step.day}
                          </p>
                          <p className="mt-0.5 font-display text-base text-brand-blue-deep">
                            {step.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Dates follow the Hajj calendar and the moon sighting, so the
                    exact Gregorian days are confirmed with your booking. The
                    typical flow above holds each year.
                  </p>
                </section>
              )}

              {/* Hajj visa requirements */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="Hajj visa"
                    title="What the visa requires"
                  />
                  <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {hajjVisaDocs.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-3 text-sm leading-relaxed text-slate-700"
                        >
                          <Icon
                            name="checkCircle"
                            size={20}
                            className="mt-0.5 shrink-0 text-brand-orange-dark"
                          />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
                      Requirements move by cycle, so verify the current list at
                      the official sources:{" "}
                      <a
                        href="https://www.nusuk.sa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue underline"
                      >
                        Saudi Hajj visa rules
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://www.moh.gov.sa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue underline"
                      >
                        Saudi vaccination requirements
                      </a>
                      .
                    </p>
                  </div>
                </section>
              )}

              {/* Hajj training */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="Hajj training"
                    title="Prepared before you travel"
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {hajjTraining.map((t) => (
                      <div
                        key={t.title}
                        className="rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <Icon
                          name="users"
                          size={22}
                          className="text-brand-orange-dark"
                        />
                        <h3 className="mt-3 font-display text-base text-brand-blue-deep">
                          {t.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {t.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Named Ziyarat sites (Umrah and Hajj) */}
              {(isUmrah || isHajj) && (
                <section>
                  <Head
                    eyebrow="Guided Ziyarat"
                    title="Sites you visit in Makkah and Madinah"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    Guided Ziyarat on this package typically covers the historical
                    sites below, with the exact plan confirmed for your travel
                    dates.
                  </p>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {(
                      [
                        { city: "Makkah", sites: ziyaratSites.makkah },
                        { city: "Madinah", sites: ziyaratSites.madinah },
                      ] as const
                    ).map((g) => (
                      <div
                        key={g.city}
                        className="rounded-2xl border border-black/5 bg-white p-6 shadow-card"
                      >
                        <h3 className="font-display text-lg text-brand-blue-deep">
                          {g.city}
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {g.sites.map((s) => (
                            <li
                              key={s}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"
                            >
                              <Icon
                                name="pin"
                                size={16}
                                className="mt-0.5 shrink-0 text-brand-orange-dark"
                              />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Departure cities, chips */}
              {departure.length > 0 && (
                <section>
                  <Head
                    eyebrow="Departure cities"
                    title="Where you fly from"
                  />
                  <div className="mt-6 flex flex-wrap gap-3">
                    {departure.map((c) => (
                      <Link
                        key={c}
                        href={`/areas/${c.toLowerCase()}`}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-brand-blue-deep shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
                      >
                        <Icon
                          name="plane"
                          size={18}
                          className="text-brand-orange-dark"
                        />
                        {c}
                      </Link>
                    ))}
                  </div>
                  <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    Flights depart from {departure.join(" and ")}, whichever
                    carries the better fare and schedule for your dates. Our team
                    arranges onward ground transport, and travelers from nearby
                    towns coordinate airport pickup when they book.
                  </p>
                </section>
              )}

              {/* Who this is for, persona cards */}
              <section>
                <Head eyebrow="Who this is for" title="Suited to" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {detail.whoFor.map((w) => (
                    <div
                      key={w}
                      className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                        <Icon name="person" size={20} />
                      </span>
                      <p className="text-sm font-medium leading-snug text-slate-700">
                        {w}
                      </p>
                    </div>
                  ))}
                </div>
                {isHajj && (
                  <p className="mt-5 flex items-start gap-3 rounded-xl bg-brand-blue/5 p-4 text-sm leading-relaxed text-slate-700">
                    <Icon
                      name="users"
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-blue"
                    />
                    <span>
                      Women travelling without a Mehram should confirm the
                      current Saudi rule for their cycle, since the conditions
                      have shifted in recent years. Our desk arranges group
                      travel for women where the rules allow, with the details
                      set at booking.
                    </span>
                  </p>
                )}
              </section>

              {/* Documents, checklist card */}
              <section>
                <Head eyebrow="Documents required" title="What to prepare" />
                <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {docList.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-3 text-sm leading-relaxed text-slate-700"
                      >
                        <Icon
                          name="checkCircle"
                          size={20}
                          className="mt-0.5 shrink-0 text-brand-orange-dark"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {visaNote && (
                    <p className="mt-5 flex items-start gap-3 rounded-xl bg-brand-orange/10 p-4 text-sm font-medium text-brand-blue-deep">
                      <Icon
                        name="document"
                        size={18}
                        className="mt-0.5 shrink-0 text-brand-orange-dark"
                      />
                      {visaNote}
                    </p>
                  )}
                  <a
                    href={checklistHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline mt-5 !py-2.5 text-sm"
                  >
                    Get the checklist on WhatsApp
                  </a>
                  {isPilgrimage && (
                    <p className="mt-5 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
                      Verify the current rules at the official sources:{" "}
                      <a
                        href="https://www.nusuk.sa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue underline"
                      >
                        Saudi Umrah visa rules
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://www.moh.gov.sa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue underline"
                      >
                        Saudi vaccination requirements
                      </a>
                      .
                    </p>
                  )}
                </div>
              </section>

              {/* How to book, numbered stepper */}
              <section>
                <Head
                  eyebrow="How to book"
                  title="From inquiry to departure"
                />
                <ol className="mt-6">
                  {bookingSteps.map((s, i) => (
                    <li key={s} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange font-display text-sm font-bold text-brand-blue-deep">
                          {i + 1}
                        </span>
                        {i < bookingSteps.length - 1 && (
                          <span className="my-1 w-0.5 flex-1 bg-brand-orange/25" />
                        )}
                      </div>
                      <div className="mb-6 flex-1 rounded-2xl border border-black/5 bg-white p-4 shadow-card">
                        <p className="text-sm leading-relaxed text-slate-700">
                          {s}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Policies, time sensitive for Ramadan */}
              {isRamadan && (
                <section>
                  <Head eyebrow="Policies" title="Payment and refund terms" />
                  <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                    <p className="flex items-start gap-3 text-base leading-relaxed text-slate-700">
                      <Icon
                        name="shield"
                        size={22}
                        className="mt-0.5 shrink-0 text-brand-orange-dark"
                      />
                      <span>
                        Ramadan bookings are time sensitive, so confirm the
                        payment, refund, cancellation, and change terms before
                        you pay. Read the full{" "}
                        <Link
                          href="/terms-and-refunds"
                          className="font-semibold text-brand-blue underline"
                        >
                          Terms and Refund policy
                        </Link>
                        , or{" "}
                        <Link
                          href="/contact"
                          className="font-semibold text-brand-blue underline"
                        >
                          ask our desk
                        </Link>{" "}
                        for the current terms in writing.
                      </span>
                    </p>
                  </div>
                </section>
              )}

              {/* Policies */}
              {isHajj && (
                <section>
                  <Head eyebrow="Policies" title="Payment and refund terms" />
                  <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                    <p className="flex items-start gap-3 text-base leading-relaxed text-slate-700">
                      <Icon
                        name="shield"
                        size={22}
                        className="mt-0.5 shrink-0 text-brand-orange-dark"
                      />
                      <span>
                        Hajj bookings involve government deadlines and
                        non refundable tickets, so confirm the payment, refund,
                        and cancellation terms in writing before you pay. Our
                        desk sets out every amount and deadline with no hidden
                        charges.{" "}
                        <Link
                          href="/contact"
                          className="font-semibold text-brand-blue underline"
                        >
                          Ask our desk for the full terms.
                        </Link>
                      </span>
                    </p>
                  </div>
                </section>
              )}

              {/* Price on inquiry, in flow twin of the sticky card */}
              <section>
                <div className="rounded-3xl border border-brand-orange/30 bg-brand-orange/10 p-6 sm:p-8">
                  <p className="font-display text-2xl text-brand-blue-deep">
                    Price on inquiry
                  </p>
                  <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-slate-600">
                    Rates update weekly with airfare and hotel availability, so
                    our team quotes the current best price for your exact dates,
                    with no hidden charges and no stale published numbers.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={quoteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-orange"
                    >
                      Get a quote
                    </a>
                    <a href={callHref} className="btn-outline">
                      Call {settings.phone}
                    </a>
                  </div>
                </div>
              </section>

              {/* Common questions */}
              <section>
                <Head
                  eyebrow="Questions and answers"
                  title="Common questions"
                />
                <FaqAccordion
                  items={detailFaqs(pkg)}
                  idBase={`pkg-${pkg.slug}`}
                  accent
                />
              </section>

              {/* MORA companion (Hajj) */}
              {detail.moraNote && (
                <section className="overflow-hidden rounded-3xl border border-black/5 bg-ink p-6 text-white sm:p-8">
                  <p className="eyebrow text-brand-orange">
                    Government registration
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-white">
                    Register with MORA, travel with us
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    For the government Hajj scheme, register free on the official
                    Ministry of Religious Affairs portal during the announced
                    window. Choose our private Hajj route for full document
                    support, trained group leaders, and Mina and Arafat camp
                    services.
                  </p>
                  <a
                    href="https://www.mora.gov.pk/Detail/YTI4ZjNkYzAtNGNmMi00MzBiLWFlZmYtOTg5MGI5ZmRiY2Nm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-semibold text-brand-blue-deep transition hover:bg-brand-orange-dark"
                  >
                    Open the official MORA portal
                  </a>
                  <p className="mt-4 text-xs leading-relaxed text-slate-400">
                    Saudi Hajj and Umrah services are managed on the{" "}
                    <a
                      href="https://www.nusuk.sa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-orange underline"
                    >
                      official Nusuk platform
                    </a>
                    .
                  </p>
                </section>
              )}

              {/* Why our desk, deep green trust card */}
              <section className="rounded-3xl bg-brand-blue-deep p-7 text-white shadow-lift sm:p-8">
                <p className="eyebrow text-brand-orange">Why our desk</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {trust.map((t) => (
                    <span
                      key={t.text}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-orange/30 bg-white/5 text-brand-orange"
                    >
                      <Icon name={t.icon} size={20} />
                    </span>
                  ))}
                </div>
                <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-slate-200">
                  Our head office sits in Charsadda, where you meet the team in
                  person, and our desk operates as the sister company of{" "}
                  {site.sisterCompany}. WhatsApp support stays active from your
                  first inquiry to your safe return home.
                </p>
                <ul className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm text-slate-300">
                  <li className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-400">Registration:</span>
                    {stagingCredentials.registrationNumber}
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-300">
                      To add
                    </span>
                  </li>
                  <li className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-400">Your consultant:</span>
                    {stagingFounder.name}, {stagingFounder.role}
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-300">
                      To add
                    </span>
                    <Link
                      href="/about"
                      className="font-semibold text-brand-orange underline"
                    >
                      About us
                    </Link>
                  </li>
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-slate-400">
                  Payment, refund, cancellation, and change terms are confirmed
                  in writing before you pay.{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-brand-orange underline"
                  >
                    Ask our desk for the full terms.
                  </Link>
                </p>
              </section>

              {isUmrah && (
                <section>
                  <Head
                    eyebrow="How this compares"
                    title="Economy, premium, and Ramadan"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    See how economy, premium, and Ramadan Umrah differ on hotel
                    proximity, room sharing, transport, and duration, with no
                    price in any cell.
                  </p>
                  <div className="mt-8">
                    <TierCompare />
                  </div>
                </section>
              )}

              {/* Related guides and visa */}
              <section>
                <Head eyebrow="Read next" title="Guides and visa services" />
                <div className="mt-6 flex flex-wrap gap-3">
                  {crossLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-brand-blue-deep shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      {l.label}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Shawwal alternative */}
              {isRamadan && (
                <section className="rounded-3xl bg-brand-blue-deep p-7 text-white shadow-lift sm:p-8">
                  <p className="eyebrow text-brand-orange">
                    A calmer alternative
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-white">
                    Umrah in Shawwal, after Eid
                  </h2>
                  <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-slate-200">
                    Missed the Ramadan window, or want a quieter, lower cost
                    stay? Umrah in Shawwal, the month after Eid, brings lighter
                    crowds and easier hotel availability with the same complete
                    service. Compare the Economy Umrah Package, or message our
                    desk for a Shawwal quote.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/packages/economy-umrah-15-days"
                      className="btn-orange"
                    >
                      View the Economy Umrah Package
                    </Link>
                    <a
                      href={waHref(
                        settings.whatsapp,
                        "Assalam o Alaikum, I missed Ramadan and want a quote for Umrah in Shawwal for my dates."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn border border-white/40 text-white hover:bg-white/10"
                    >
                      Ask about Shawwal Umrah
                    </a>
                  </div>
                </section>
              )}
            </div>

            {/* Sticky quote card, desktop */}
            <aside className="hidden lg:block">
              <div className="lg:sticky lg:top-28">
                <StickyQuoteCard
                  facts={facts}
                  quoteHref={quoteHref}
                  telHref={callHref}
                  trust={trust}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Social proof: staging placeholders until real reviews are connected */}
      <Reviews data={reviewData} />

      {/* Related packages */}
      {related.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-site">
            <Head eyebrow="More to explore" title="Related packages" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PackageInquiryCard
                  key={p.slug}
                  pkg={p}
                  whatsapp={settings.whatsapp}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing band, bold moment 3 */}
      <CtaBand
        title="Get a quote for your dates"
        subtitle="Message our team on WhatsApp or visit the Charsadda office. We quote the current best price for your exact dates, with no hidden charges."
        officeHref={mapsLink()}
      />

      {/* Mobile sticky quote bar */}
      <MobileActionBar quoteHref={quoteHref} telHref={callHref} />
    </>
  );
}
