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
} from "@/lib/packageDetail";

export const dynamic = "force-dynamic";

const TITLE_SUFFIX = " from Pakistan | Al Raqeem";

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
  const clean = cleanName(pkg.title);
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
  const clean = cleanName(pkg.title);
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
  const groupName = isPilgrimage ? "Umrah and Hajj" : "International";
  const heroImage = packageImage(pkg.slug, pkg.category, pkg.image);

  const quoteHref = waHref(
    settings.whatsapp,
    `Assalam o Alaikum, I want a quote for the "${pkg.title}" (${pkg.duration}) package for my dates.`
  );
  const callHref = telHref(settings.phone);
  const checklistHref = waHref(
    settings.whatsapp,
    `Assalam o Alaikum, please send the document checklist for the "${pkg.title}" package.`
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
          alt={`${pkg.title} from Pakistan`}
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
            <span className="text-white">{pkg.title}</span>
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
            {pkg.title} from Pakistan
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
                <Head eyebrow="Overview" title={`${pkg.title} from Pakistan`} />
                <p className="mt-6 max-w-[65ch] font-display text-xl leading-snug text-brand-blue-deep">
                  {overviewLead}
                </p>
                {overviewRest && (
                  <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    {overviewRest}
                  </p>
                )}
              </section>

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

              {/* Sample itinerary */}
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
                  <Link
                    href="/packages#compare-tiers"
                    className="btn-outline mt-5 !py-2.5 text-sm"
                  >
                    Compare Umrah tiers
                  </Link>
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
