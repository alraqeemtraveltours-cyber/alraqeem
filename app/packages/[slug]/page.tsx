import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackage, getPackages } from "@/lib/packagesStore";
import {
  type TravelPackage,
  packageDisplayName,
  packageSilo,
} from "@/lib/packages";
import { packageMetadata } from "@/lib/packageMeta";
import { packageImage } from "@/lib/images";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import PackageInquiryCard from "@/components/packages/PackageInquiryCard";
import TierCompare from "@/components/packages/TierCompare";
import Icon, { inclusionIcon } from "@/components/packages/DetailIcons";
import StickyQuoteCard from "@/components/packages/StickyQuoteCard";
import MobileActionBar from "@/components/packages/MobileActionBar";
import TourCta from "@/components/packages/TourCta";
import SocialProof from "@/components/packages/SocialProof";
import CaptionedImage from "@/components/packages/CaptionedImage";
import SearchInquiryWidget from "@/components/SearchInquiryWidget";
import LastUpdated from "@/components/LastUpdated";
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
  ramadanCostDrivers,
  economyCostDrivers,
  premiumCostDrivers,
  hajjCostDrivers,
  dubaiItinerary,
  dubaiAttractions,
  dubaiPractical,
  dubaiCostDrivers,
  dubaiGallery,
  turkeyItinerary,
  turkeyAttractions,
  turkeyPractical,
  turkeyCostDrivers,
  turkeyGallery,
  bakuItinerary,
  bakuAttractions,
  bakuPractical,
  bakuCostDrivers,
  bakuGallery,
  farEastItinerary,
  farEastAttractions,
  farEastPractical,
  farEastCostDrivers,
  farEastGallery,
  tourContent,
  premiumGallery,
  hajjSchemes,
  maktabCategories,
  minaFacilities,
  hajjJourney,
  hajjVisaDocs,
  hajjTraining,
} from "@/lib/packageDetail";

export const dynamic = "force-dynamic";

// The visible name for the H1, breadcrumb, and prefills.
const displayName = packageDisplayName;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return {};
  return packageMetadata(pkg);
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

// The full detail view, rendered by both /packages/[slug] and the /tours
// Dubai pillar. Takes a resolved package, so either route supplies it.
export async function PackageDetailView({ pkg }: { pkg: TravelPackage }) {
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
  const isEconomy = pkg.slug === "economy-umrah-15-days";
  const isPremium = pkg.slug === "premium-umrah-21-days";
  const isDubai = pkg.slug === "dubai-5-days";
  const isTurkey = pkg.slug === "turkey-7-days";
  const isBaku = pkg.slug === "baku-5-days";
  const isFarEast = pkg.slug === "malaysia-thailand-8-days";
  // Data driven tour content for the newer tour pages. When present, one generic
  // path renders the itinerary, attractions, practical grid, gallery, cost
  // drivers, and visa links, so a new country is a data entry, not new JSX.
  const isTourFromCategory = pkg.category !== "Umrah & Hajj";
  const tour = isTourFromCategory ? tourContent[pkg.slug] : undefined;
  const displayTitle = displayName(pkg);
  const groupName = isPilgrimage ? "Umrah and Hajj" : "International";
  const silo = packageSilo(pkg);
  // Hajj is its own hub, so its breadcrumb stops at Home, Hajj.
  const breadcrumbIsHub = pkg.slug === "hajj-package";
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

  // Tour CRO: a specific, possessive quote label and a lighter micro conversion
  // (the itinerary on WhatsApp). Applied to tours so all tour pages inherit it.
  const isTour = !isPilgrimage;
  const tourName =
    tour?.name ??
    (isDubai
      ? "Dubai"
      : pkg.slug === "turkey-7-days"
        ? "Turkey"
        : pkg.slug === "baku-5-days"
          ? "Baku"
          : pkg.slug === "malaysia-thailand-8-days"
            ? "Far East"
            : "trip");
  const quoteLabel = isTour ? `Get my ${tourName} quote` : "Get a quote";
  const itineraryHref = waHref(
    settings.whatsapp,
    `Assalam o Alaikum, please send the day by day itinerary for the "${displayTitle}" package.`
  );
  const seasonalNote = isTour
    ? "Peak seasons and holidays book earliest, so message us as soon as your dates are set."
    : undefined;
  // Hero subhead, a semantically dense intent line under the H1 and above the
  // CTA. Tours share one benefit line; each pilgrimage package names its own
  // entities and answers what the package delivers.
  const heroSubhead = isTour
    ? "Visa, flights, hotel, and every sight handled. You travel, and our desk arranges it all, quoted for your exact dates with no hidden charges."
    : pkg.slug === "economy-umrah-15-days"
      ? "A complete 15 day Umrah from Pakistan on a modest budget, with the Saudi e-visa, return flights from Peshawar and Islamabad, hotels within walking distance of the Haram, ground transport, and guided Ziyarat in Makkah and Madinah, all handled by our desk."
      : pkg.slug === "premium-umrah-21-days"
        ? "A 21 day five star Umrah from Pakistan, with hotels near or facing the Haram, private transport, daily breakfast and dinner, and the Saudi e-visa processed through Nusuk, arranged end to end by our desk."
        : pkg.slug === "ramadan-umrah-special"
          ? "Umrah in the blessed nights of Ramadan from Pakistan, from ten to thirty days, with hotels near the Haram for Taraweeh, Itikaf, and the nights of Laylat al-Qadr, arranged before the season sells out."
          : pkg.slug === "hajj-package"
            ? "A complete, guided Hajj from Pakistan, with government scheme registration through MORA, the Maktab camps at Mina and Arafat, trained group leaders, and pre-departure training, arranged from booking to your safe return."
            : `A complete ${displayTitle} from Pakistan, with the visa, flights, hotels, and guided visits arranged end to end by our desk.`;

  // Combo partners for the durations and combos block, each tour paired with
  // the other destinations we serve.
  const comboPartners = isDubai
    ? "Baku, Turkey, or the Maldives"
    : pkg.slug === "turkey-7-days"
      ? "Dubai, Baku, or the Maldives"
      : pkg.slug === "baku-5-days"
        ? "Dubai, Turkey, or the Maldives"
        : pkg.slug === "malaysia-thailand-8-days"
          ? "Dubai, Turkey, or Baku"
          : pkg.slug === "malaysia"
            ? "Thailand, Singapore, or the two and three country combos"
            : pkg.slug === "thailand"
              ? "Malaysia, Singapore, or the two and three country combos"
              : pkg.slug === "singapore"
                ? "Malaysia, Thailand, or the two and three country combos"
                : pkg.slug === "malaysia-thailand-singapore"
                  ? "each country on its own, or a two country combo"
                  : "our other destinations";

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
          { label: "All tour packages", href: "/tours" },
          { label: "UAE visit visa services", href: "/visa-services" },
        ]
      : [
          { label: "All tour packages", href: "/tours" },
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
  // Southeast Asia mini silo, so a solo or combo page cross links to its own
  // family first, the interlinking that makes the silo work.
  const seAsiaSilo = [
    "malaysia",
    "thailand",
    "singapore",
    "malaysia-thailand-8-days",
    "malaysia-thailand-singapore",
  ];
  const inSeAsia = seAsiaSilo.includes(pkg.slug);
  const relatedPool = [
    ...all.filter((p) => p.category === pkg.category && p.slug !== pkg.slug),
    ...all.filter((p) => p.category !== pkg.category && p.slug !== pkg.slug),
  ];
  if (inSeAsia) {
    relatedPool.sort(
      (a, b) =>
        (seAsiaSilo.includes(a.slug) ? 0 : 1) -
        (seAsiaSilo.includes(b.slug) ? 0 : 1)
    );
  }
  const related = relatedPool
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
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            {breadcrumbIsHub ? (
              <span className="text-white">{silo.hubName}</span>
            ) : (
              <>
                <Link href={silo.hub} className="hover:text-white">
                  {silo.hubName}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white">{displayTitle}</span>
              </>
            )}
          </nav>
          <LastUpdated tone="dark" className="mt-3" />
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
          {heroSubhead && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-200">
              {heroSubhead}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange"
            >
              {quoteLabel}
            </a>
            <a
              href={callHref}
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              Call {settings.phone}
            </a>
          </div>
          {/* Social proof and trust, high near the first CTA, every detail page */}
          <div className="mt-6 flex flex-col gap-4">
            <SocialProof theme="dark" />
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-200">
              {trust.map((t) => (
                <li key={t.text} className="inline-flex items-center gap-2">
                  <Icon
                    name={t.icon}
                    size={16}
                    className="shrink-0 text-brand-orange"
                  />
                  {t.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quote widget, single mode with the parent vertical resolved from route */}
      <section className="border-b border-black/5 bg-white py-8">
        <div className="container-site">
          <div className="max-w-3xl">
            <SearchInquiryWidget whatsapp={settings.whatsapp} />
          </div>
        </div>
      </section>

      {/* Value strip under the hero (tours) */}
      {isTour && (
        <section className="border-b border-black/5 bg-white">
          <div className="container-site grid grid-cols-2 gap-x-6 gap-y-5 py-6 sm:grid-cols-4">
            {[
              { icon: "plane", text: "Visa and flights included" },
              { icon: "hotel", text: "Hotel with breakfast" },
              { icon: "camera", text: "Guided sightseeing" },
              { icon: "phone", text: "WhatsApp support throughout" },
            ].map((v) => (
              <div key={v.text} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/12 text-brand-orange-dark">
                  <Icon name={v.icon} size={18} />
                </span>
                <p className="text-sm font-semibold leading-snug text-brand-blue-deep">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

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

              {/* Dubai day by day itinerary, the core tour section */}
              {isDubai && (
                <section>
                  <Head
                    eyebrow="Day by day"
                    title="Your five day Dubai itinerary"
                  />
                  <div className="mt-6 space-y-5">
                    {dubaiItinerary.map((step) => (
                      <article
                        key={step.day}
                        className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-card sm:grid-cols-[1fr_1.8fr] sm:items-center"
                      >
                        <CaptionedImage
                          caption={step.caption}
                          icon="camera"
                          aspect="aspect-[16/10]"
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                            {step.day}
                          </p>
                          <h3 className="mt-0.5 font-display text-lg text-brand-blue-deep">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                            {step.detail}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    The flow above is the typical five day plan. Our desk adjusts
                    the order and adds excursions to suit your dates and group.
                  </p>
                  <div className="mt-6">
                    <SocialProof />
                  </div>
                </section>
              )}

              {/* Top Dubai attractions */}
              {isDubai && (
                <section>
                  <Head
                    eyebrow="What you will see"
                    title="Top Dubai attractions"
                  />
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {dubaiAttractions.map((a) => (
                      <article
                        key={a.name}
                        className="rounded-2xl border border-black/5 bg-white p-4 shadow-card"
                      >
                        <CaptionedImage
                          caption={a.caption}
                          icon="pin"
                          aspect="aspect-[4/3]"
                        />
                        <h3 className="mt-3 font-display text-base text-brand-blue-deep">
                          {a.name}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {a.detail}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Decision-point CTA after itinerary and attractions (Dubai) */}
              {isDubai && (
                <TourCta
                  heading={`Ready to plan your ${tourName} trip?`}
                  quoteHref={quoteHref}
                  quoteLabel={quoteLabel}
                  itineraryHref={itineraryHref}
                  seasonalNote="Dubai peaks from November to March, when the weather is cool and the hotels book earliest. Message us for your dates."
                />
              )}

              {/* Turkey day by day itinerary, captioned image per day */}
              {isTurkey && (
                <section>
                  <Head
                    eyebrow="Day by day"
                    title="Your seven day Turkey itinerary"
                  />
                  <div className="mt-6 space-y-5">
                    {turkeyItinerary.map((step) => (
                      <article
                        key={step.day}
                        className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-card sm:grid-cols-[1fr_1.8fr] sm:items-center"
                      >
                        <CaptionedImage
                          caption={step.caption}
                          icon="camera"
                          aspect="aspect-[16/10]"
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                            {step.day}
                          </p>
                          <h3 className="mt-0.5 font-display text-lg text-brand-blue-deep">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                            {step.detail}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    The flow above is the typical seven day plan across Istanbul
                    and Cappadocia. Our desk adjusts the order and adds Antalya,
                    Pamukkale, or Ephesus on request.
                  </p>
                  <div className="mt-6">
                    <SocialProof />
                  </div>
                </section>
              )}

              {/* Top Turkey attractions, captioned */}
              {isTurkey && (
                <section>
                  <Head
                    eyebrow="What you will see"
                    title="Top Turkey attractions"
                  />
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {turkeyAttractions.map((a) => (
                      <article
                        key={a.name}
                        className="rounded-2xl border border-black/5 bg-white p-4 shadow-card"
                      >
                        <CaptionedImage
                          caption={a.caption}
                          icon="pin"
                          aspect="aspect-[4/3]"
                        />
                        <h3 className="mt-3 font-display text-base text-brand-blue-deep">
                          {a.name}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {a.detail}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Decision-point CTA after itinerary and attractions (Turkey) */}
              {isTurkey && (
                <TourCta
                  heading={`Ready to plan your ${tourName} trip?`}
                  quoteHref={quoteHref}
                  quoteLabel={quoteLabel}
                  itineraryHref={itineraryHref}
                  seasonalNote="Spring and autumn book early in Turkey, when the weather is best and the Cappadocia balloons fly. Message us for your dates."
                />
              )}

              {/* Baku day by day itinerary, captioned image per day */}
              {isBaku && (
                <section>
                  <Head
                    eyebrow="Day by day"
                    title="Your five day Baku itinerary"
                  />
                  <div className="mt-6 space-y-5">
                    {bakuItinerary.map((step) => (
                      <article
                        key={step.day}
                        className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-card sm:grid-cols-[1fr_1.8fr] sm:items-center"
                      >
                        <CaptionedImage
                          caption={step.caption}
                          icon="camera"
                          aspect="aspect-[16/10]"
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                            {step.day}
                          </p>
                          <h3 className="mt-0.5 font-display text-lg text-brand-blue-deep">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                            {step.detail}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    The flow above is the typical five day plan across Baku and
                    its day trips. Our desk adjusts the order and adds Sheki or
                    Shahdag for longer stays.
                  </p>
                  <div className="mt-6">
                    <SocialProof />
                  </div>
                </section>
              )}

              {/* Top Baku attractions, captioned */}
              {isBaku && (
                <section>
                  <Head
                    eyebrow="What you will see"
                    title="Top Baku attractions"
                  />
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {bakuAttractions.map((a) => (
                      <article
                        key={a.name}
                        className="rounded-2xl border border-black/5 bg-white p-4 shadow-card"
                      >
                        <CaptionedImage
                          caption={a.caption}
                          icon="pin"
                          aspect="aspect-[4/3]"
                        />
                        <h3 className="mt-3 font-display text-base text-brand-blue-deep">
                          {a.name}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {a.detail}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Decision-point CTA after itinerary and attractions (Baku) */}
              {isBaku && (
                <TourCta
                  heading={`Ready to plan your ${tourName} trip?`}
                  quoteHref={quoteHref}
                  quoteLabel={quoteLabel}
                  itineraryHref={itineraryHref}
                  seasonalNote="Spring and autumn book earliest in Baku, when the weather is mild for the Old City and Gabala. Message us for your dates."
                />
              )}

              {/* Malaysia and Thailand day by day itinerary, captioned per day */}
              {isFarEast && (
                <section>
                  <Head
                    eyebrow="Day by day"
                    title="Your eight day Malaysia and Thailand itinerary"
                  />
                  <div className="mt-6 space-y-5">
                    {farEastItinerary.map((step) => (
                      <article
                        key={step.day}
                        className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-card sm:grid-cols-[1fr_1.8fr] sm:items-center"
                      >
                        <CaptionedImage
                          caption={step.caption}
                          icon="camera"
                          aspect="aspect-[16/10]"
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                            {step.day}
                          </p>
                          <h3 className="mt-0.5 font-display text-lg text-brand-blue-deep">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                            {step.detail}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    The flow above is the typical eight day plan across Kuala
                    Lumpur and Bangkok. Our desk adjusts the order and adds a
                    Phuket or Krabi beach stay on request.
                  </p>
                  <div className="mt-6">
                    <SocialProof />
                  </div>
                </section>
              )}

              {/* Top Malaysia and Thailand attractions, captioned */}
              {isFarEast && (
                <section>
                  <Head
                    eyebrow="What you will see"
                    title="Top Malaysia and Thailand attractions"
                  />
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {farEastAttractions.map((a) => (
                      <article
                        key={a.name}
                        className="rounded-2xl border border-black/5 bg-white p-4 shadow-card"
                      >
                        <CaptionedImage
                          caption={a.caption}
                          icon="pin"
                          aspect="aspect-[4/3]"
                        />
                        <h3 className="mt-3 font-display text-base text-brand-blue-deep">
                          {a.name}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {a.detail}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Decision-point CTA after itinerary and attractions (Far East) */}
              {isFarEast && (
                <TourCta
                  heading={`Ready to plan your ${tourName} trip?`}
                  quoteHref={quoteHref}
                  quoteLabel={quoteLabel}
                  itineraryHref={itineraryHref}
                  seasonalNote="The cool, dry months from November to February book earliest across Malaysia and Thailand. Message us for your dates."
                />
              )}

              {/* Optional lead passage, the Muslim friendly wedge for Malaysia */}
              {tour?.wedge && (
                <section className="rounded-3xl border border-brand-orange/25 bg-brand-orange/5 p-6 sm:p-8">
                  <p className="eyebrow text-brand-orange-dark">
                    {tour.wedge.eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-brand-blue-deep">
                    {tour.wedge.title}
                  </h2>
                  <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-slate-700">
                    {tour.wedge.body}
                  </p>
                </section>
              )}

              {/* Data driven itinerary and attractions for the newer tour pages */}
              {tour && (
                <>
                  <section>
                    <Head
                      eyebrow="Day by day"
                      title={`Your ${tour.durationWords} ${tour.name} itinerary`}
                    />
                    <div className="mt-6 space-y-5">
                      {tour.itinerary.map((step) => (
                        <article
                          key={step.day}
                          className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-card sm:grid-cols-[1fr_1.8fr] sm:items-center"
                        >
                          <CaptionedImage
                            caption={step.caption}
                            icon="camera"
                            aspect="aspect-[16/10]"
                          />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                              {step.day}
                            </p>
                            <h3 className="mt-0.5 font-display text-lg text-brand-blue-deep">
                              {step.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                              {step.detail}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                    <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                      {tour.itineraryNote}
                    </p>
                    <div className="mt-6">
                      <SocialProof />
                    </div>
                  </section>

                  <section>
                    <Head
                      eyebrow="What you will see"
                      title={`Top ${tour.name} attractions`}
                    />
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {tour.attractions.map((a) => (
                        <article
                          key={a.name}
                          className="rounded-2xl border border-black/5 bg-white p-4 shadow-card"
                        >
                          <CaptionedImage
                            caption={a.caption}
                            icon="pin"
                            aspect="aspect-[4/3]"
                          />
                          <h3 className="mt-3 font-display text-base text-brand-blue-deep">
                            {a.name}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {a.detail}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <TourCta
                    heading={`Ready to plan your ${tourName} trip?`}
                    quoteHref={quoteHref}
                    quoteLabel={quoteLabel}
                    itineraryHref={itineraryHref}
                    seasonalNote={tour.seasonalNote}
                  />
                </>
              )}

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
                  <p className="mt-4 flex items-start gap-3 rounded-xl border border-black/10 bg-paper/60 p-4 text-sm leading-relaxed text-slate-600">
                    <Icon
                      name="clock"
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-orange-dark"
                    />
                    <span>
                      Hajj policy note: MORA announces the scheme, quota, and
                      application window for each cycle, and Saudi rules update
                      through Nusuk. Our desk tracks the current announcements
                      and confirms the rules that apply to your booking, so ask
                      for the latest position on your dates.
                    </span>
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
                {isEconomy && (
                  <p className="mt-5 flex items-start gap-3 rounded-xl bg-brand-orange/10 p-4 text-sm leading-relaxed text-brand-blue-deep">
                    <Icon
                      name="meal"
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-orange-dark"
                    />
                    <span>
                      Economy packages are usually room only or with breakfast,
                      since keeping meals flexible holds the cost down near the
                      Haram, where affordable food sits close by. Our desk
                      confirms the exact meal plan for your hotel with your
                      quote.
                    </span>
                  </p>
                )}
                {isPremium && (
                  <p className="mt-5 flex items-start gap-3 rounded-xl bg-brand-orange/10 p-4 text-sm leading-relaxed text-brand-blue-deep">
                    <Icon
                      name="route"
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-orange-dark"
                    />
                    <span>
                      Intercity travel between Makkah and Madinah is by private
                      transport or the Haramain high speed rail, confirmed for
                      your dates. Our desk arranges every transfer, so your group
                      moves on its own schedule from arrival to safe return.
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
                        {isPremium && (
                          <p className="mt-3 text-sm leading-relaxed text-slate-300">
                            Rooms are arranged as double, twin, or triple to suit
                            couples, families, and small groups, confirmed with
                            your quote.
                          </p>
                        )}
                      </div>
                      <figure
                        role="img"
                        aria-label="Hotels near Masjid al-Haram in Makkah and Masjid an-Nabawi in Madinah"
                        className="flex min-h-[220px] flex-col items-center justify-center gap-3 border-t border-brand-orange/20 bg-white/5 p-6 text-center md:min-h-full md:border-l md:border-t-0"
                      >
                        <Icon
                          name="hotel"
                          size={34}
                          className="text-brand-orange"
                        />
                        <figcaption className="text-sm font-medium leading-snug text-slate-200">
                          Hotels near Masjid al-Haram in Makkah and Masjid
                          an-Nabawi in Madinah
                        </figcaption>
                      </figure>
                    </div>
                  </div>
                </section>
              )}

              {/* Premium hotel and room gallery, captioned motif panels */}
              {isPremium && (
                <section>
                  <Head eyebrow="Gallery" title="Hotels, rooms, and the Haram" />
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {premiumGallery.map((caption) => (
                      <CaptionedImage
                        key={caption}
                        caption={caption}
                        icon="hotel"
                        aspect="aspect-square"
                      />
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Branded panels stand in until our own five star hotel and
                    room photos are added, so every slot names what it will show.
                  </p>
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

              {/* Best time and practical info (Dubai) */}
              {isDubai && (
                <section>
                  <Head
                    eyebrow="Good to know"
                    title="Best time and practical info"
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dubaiPractical.map((p) => (
                      <div
                        key={p.label}
                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                          <Icon name={p.icon} size={22} />
                        </span>
                        <div>
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {p.label}
                          </dt>
                          <dd className="text-sm font-semibold text-brand-blue-deep">
                            {p.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Dubai photo gallery, captioned motif panels until real photos */}
              {isDubai && (
                <section>
                  <Head eyebrow="Gallery" title="Dubai in pictures" />
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {dubaiGallery.map((caption) => (
                      <CaptionedImage
                        key={caption}
                        caption={caption}
                        icon="camera"
                        aspect="aspect-square"
                      />
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Branded panels stand in until our own Dubai photos are added,
                    so every slot names the place it will show.
                  </p>
                </section>
              )}

              {/* Best time and practical info (Turkey) */}
              {isTurkey && (
                <section>
                  <Head
                    eyebrow="Good to know"
                    title="Best time and practical info"
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {turkeyPractical.map((p) => (
                      <div
                        key={p.label}
                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                          <Icon name={p.icon} size={22} />
                        </span>
                        <div>
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {p.label}
                          </dt>
                          <dd className="text-sm font-semibold text-brand-blue-deep">
                            {p.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Turkey photo gallery, captioned motif panels until real photos */}
              {isTurkey && (
                <section>
                  <Head eyebrow="Gallery" title="Turkey in pictures" />
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {turkeyGallery.map((caption) => (
                      <CaptionedImage
                        key={caption}
                        caption={caption}
                        icon="camera"
                        aspect="aspect-square"
                      />
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Branded panels stand in until our own Turkey photos are
                    added, so every slot names the place it will show.
                  </p>
                </section>
              )}

              {/* Best time and practical info (Baku) */}
              {isBaku && (
                <section>
                  <Head
                    eyebrow="Good to know"
                    title="Best time and practical info"
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {bakuPractical.map((p) => (
                      <div
                        key={p.label}
                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                          <Icon name={p.icon} size={22} />
                        </span>
                        <div>
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {p.label}
                          </dt>
                          <dd className="text-sm font-semibold text-brand-blue-deep">
                            {p.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Baku photo gallery, captioned motif panels until real photos */}
              {isBaku && (
                <section>
                  <Head eyebrow="Gallery" title="Baku in pictures" />
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {bakuGallery.map((caption) => (
                      <CaptionedImage
                        key={caption}
                        caption={caption}
                        icon="camera"
                        aspect="aspect-square"
                      />
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Branded panels stand in until our own Baku photos are added,
                    so every slot names the place it will show.
                  </p>
                </section>
              )}

              {/* Best time and practical info (Malaysia and Thailand) */}
              {isFarEast && (
                <section>
                  <Head
                    eyebrow="Good to know"
                    title="Best time and practical info"
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {farEastPractical.map((p) => (
                      <div
                        key={p.label}
                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                          <Icon name={p.icon} size={22} />
                        </span>
                        <div>
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {p.label}
                          </dt>
                          <dd className="text-sm font-semibold text-brand-blue-deep">
                            {p.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Far East photo gallery, captioned motif panels until real photos */}
              {isFarEast && (
                <section>
                  <Head eyebrow="Gallery" title="Malaysia and Thailand in pictures" />
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {farEastGallery.map((caption) => (
                      <CaptionedImage
                        key={caption}
                        caption={caption}
                        icon="camera"
                        aspect="aspect-square"
                      />
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Branded panels stand in until our own Malaysia and Thailand
                    photos are added, so every slot names the place it will show.
                  </p>
                </section>
              )}

              {/* Data driven best time and practical grid for the newer tours */}
              {tour && (
                <section>
                  <Head
                    eyebrow="Good to know"
                    title="Best time and practical info"
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tour.practical.map((p) => (
                      <div
                        key={p.label}
                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                          <Icon name={p.icon} size={22} />
                        </span>
                        <div>
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {p.label}
                          </dt>
                          <dd className="text-sm font-semibold text-brand-blue-deep">
                            {p.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Data driven gallery for the newer tours */}
              {tour && (
                <section>
                  <Head eyebrow="Gallery" title={`${tour.name} in pictures`} />
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {tour.gallery.map((caption) => (
                      <CaptionedImage
                        key={caption}
                        caption={caption}
                        icon="camera"
                        aspect="aspect-square"
                      />
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Branded panels stand in until our own {tour.name} photos are
                    added, so every slot names the place it will show.
                  </p>
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
                      odd nights of Laylat al-Qadr, the Night of Power, are
                      booked as close as availability allows, without promising a
                      specific hotel or a view facing the Haram. Tell our team
                      your intended nights early, and we hold the nearest option
                      we secure for your dates.
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

              {/* Sample itinerary. Hajj, Dubai, and Turkey use their own. */}
              {!isHajj && !isDubai && !isTurkey && !isBaku && !isFarEast && !tour && (
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

              {/* Decision-point CTA after the itinerary (tours without a named
                  attractions section: Baku, Malaysia and Thailand) */}
              {isTour && !isDubai && !isTurkey && !isBaku && !isFarEast && !tour && (
                <>
                  <div>
                    <SocialProof />
                  </div>
                  <TourCta
                    heading={`Ready to plan your ${tourName} trip?`}
                    quoteHref={quoteHref}
                    quoteLabel={quoteLabel}
                    itineraryHref={itineraryHref}
                    seasonalNote={seasonalNote}
                  />
                </>
              )}

              {/* The Hajj journey, day by day across Dhul Hijjah */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="The Hajj journey"
                    title="Day by day, the 8th to the 13th of Dhul Hijjah"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    Most pilgrims from Pakistan perform Hajj al Tamattu, joining
                    Umrah and Hajj in one trip with a release from Ihram between
                    them, while Ifrad and Qiran are arranged for those who intend
                    them. The rites below follow the days of Dhul Hijjah.
                  </p>
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
                  {isEconomy && (
                    <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                      Flights leave from Bacha Khan International in Peshawar or
                      Islamabad International, booked on the carrier with the best
                      fare and schedule, such as Saudia, PIA, Airblue, or AirSial.
                      Routes land at Jeddah or Prince Mohammad bin Abdulaziz
                      International in Madinah, and our desk arranges the ground
                      transport onward to your hotel.
                    </p>
                  )}
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
                {isEconomy && (
                  <p className="mt-5 flex items-start gap-3 rounded-xl bg-brand-blue/5 p-4 text-sm leading-relaxed text-slate-700">
                    <Icon
                      name="users"
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-blue"
                    />
                    <span>
                      Women travelling without a Mehram should confirm the
                      current Saudi rule for their dates, since the conditions
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
                  {isDubai && (
                    <p className="mt-5 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
                      Verify the current UAE visit visa rules at the official{" "}
                      <a
                        href="https://u.ae"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue underline"
                      >
                        UAE government portal
                      </a>
                      . Our team prepares and files your visa with your booking.
                    </p>
                  )}
                  {isTurkey && (
                    <p className="mt-5 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
                      Verify the current rules and apply at the official{" "}
                      <a
                        href="https://www.evisa.gov.tr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue underline"
                      >
                        Turkey e visa portal
                      </a>
                      . Our team prepares and files your visa with your booking.
                    </p>
                  )}
                  {isBaku && (
                    <p className="mt-5 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
                      Verify the current rules and apply at the official{" "}
                      <a
                        href="https://evisa.gov.az"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue underline"
                      >
                        Azerbaijan ASAN e visa portal
                      </a>
                      . Our team prepares and files your e visa with your booking.
                    </p>
                  )}
                  {isFarEast && (
                    <p className="mt-5 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
                      Verify the current rules at the official{" "}
                      <a
                        href="https://malaysiavisa.imi.gov.my"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue underline"
                      >
                        Malaysia e visa portal
                      </a>{" "}
                      and the{" "}
                      <a
                        href="https://www.thaievisa.go.th"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue underline"
                      >
                        Thailand e visa portal
                      </a>
                      . Our team prepares and files both e visas with your booking.
                    </p>
                  )}
                  {tour && (
                    <p className="mt-5 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
                      {tour.visaIntro}{" "}
                      {tour.visaLinks.map((v, i) => (
                        <span key={v.href}>
                          {i > 0 ? " and the " : ""}
                          <a
                            href={v.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-brand-blue underline"
                          >
                            {v.label}
                          </a>
                        </span>
                      ))}
                      . Our team prepares and files your visa with your booking.
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

              {/* What sets the price, cost drivers passage */}
              {isEconomy && (
                <section>
                  <Head
                    eyebrow="What sets the price"
                    title="Why an economy quote moves"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    A 15 day economy Umrah has no fixed sticker, since a handful
                    of factors set each quote. Our desk reads them live for your
                    dates and sends the current best price, with no hidden
                    charges and no stale published number.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {economyCostDrivers.map((c) => (
                      <div
                        key={c.factor}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                          <Icon name={c.icon} size={22} />
                        </span>
                        <div>
                          <h3 className="font-display text-base text-brand-blue-deep">
                            {c.factor}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-500">
                    Ask about Rajab and Shaban, the calmer months before Ramadan,
                    for lower off peak rates that stretch a budget further.
                  </p>
                </section>
              )}

              {/* What sets the price, Ramadan cost drivers passage */}
              {isRamadan && (
                <section>
                  <Head
                    eyebrow="What sets the price"
                    title="Why a Ramadan quote moves"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    A Ramadan, or Ramzan, Umrah has no fixed sticker, since a few
                    factors set each quote. Our desk reads them live for your
                    dates and sends the current best price, with no hidden
                    charges and no stale published number.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {ramadanCostDrivers.map((c) => (
                      <div
                        key={c.factor}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                          <Icon name={c.icon} size={22} />
                        </span>
                        <div>
                          <h3 className="font-display text-base text-brand-blue-deep">
                            {c.factor}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* What sets the price, premium cost drivers passage */}
              {isPremium && (
                <section>
                  <Head
                    eyebrow="What sets the price"
                    title="Why premium sits above economy"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    A premium Umrah has no fixed sticker, since a few factors set
                    each quote. Our desk reads them live for your dates and sends
                    the current best price, with no hidden charges and no stale
                    published number.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {premiumCostDrivers.map((c) => (
                      <div
                        key={c.factor}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                          <Icon name={c.icon} size={22} />
                        </span>
                        <div>
                          <h3 className="font-display text-base text-brand-blue-deep">
                            {c.factor}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* What sets the price, Hajj cost drivers passage */}
              {isHajj && (
                <section>
                  <Head
                    eyebrow="What sets the price"
                    title="Why a Hajj quote moves"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    A Hajj package has no fixed sticker, since the scheme, the
                    Maktab, the hotels, and the airline each set the quote. Our
                    desk reads them live for your dates and sends the current
                    best price, with no hidden charges and no stale published
                    number.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {hajjCostDrivers.map((c) => (
                      <div
                        key={c.factor}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                          <Icon name={c.icon} size={22} />
                        </span>
                        <div>
                          <h3 className="font-display text-base text-brand-blue-deep">
                            {c.factor}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* What sets the price, Dubai cost drivers passage */}
              {isDubai && (
                <section>
                  <Head
                    eyebrow="What sets the price"
                    title="Why a Dubai quote moves"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    A Dubai tour has no fixed sticker, since the season, the
                    hotel, the excursions, and your departure city set each
                    quote. Our desk reads them live for your dates and sends the
                    current best price, with no hidden charges and no stale
                    published number.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {dubaiCostDrivers.map((c) => (
                      <div
                        key={c.factor}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                          <Icon name={c.icon} size={22} />
                        </span>
                        <div>
                          <h3 className="font-display text-base text-brand-blue-deep">
                            {c.factor}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* What sets the price, Turkey cost drivers passage */}
              {isTurkey && (
                <section>
                  <Head
                    eyebrow="What sets the price"
                    title="Why a Turkey quote moves"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    A Turkey tour has no fixed sticker, since the season, the
                    hotel, the excursions, and your departure city set each
                    quote. Our desk reads them live for your dates and sends the
                    current best price, with no hidden charges and no stale
                    published number.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {turkeyCostDrivers.map((c) => (
                      <div
                        key={c.factor}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                          <Icon name={c.icon} size={22} />
                        </span>
                        <div>
                          <h3 className="font-display text-base text-brand-blue-deep">
                            {c.factor}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* What sets the price, Baku cost drivers passage */}
              {isBaku && (
                <section>
                  <Head
                    eyebrow="What sets the price"
                    title="Why a Baku quote moves"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    A Baku tour has no fixed sticker, since the season, the hotel,
                    the excursions, and your departure city set each quote. Our
                    desk reads them live for your dates and sends the current best
                    price, with no hidden charges and no stale published number.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {bakuCostDrivers.map((c) => (
                      <div
                        key={c.factor}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                          <Icon name={c.icon} size={22} />
                        </span>
                        <div>
                          <h3 className="font-display text-base text-brand-blue-deep">
                            {c.factor}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* What sets the price, Malaysia and Thailand cost drivers */}
              {isFarEast && (
                <section>
                  <Head
                    eyebrow="What sets the price"
                    title="Why a Malaysia and Thailand quote moves"
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    A Malaysia and Thailand tour has no fixed sticker, since the
                    season, the hotels, the excursions, and your departure city
                    set each quote. Our desk reads them live for your dates and
                    sends the current best price, with no hidden charges and no
                    stale published number.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {farEastCostDrivers.map((c) => (
                      <div
                        key={c.factor}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                          <Icon name={c.icon} size={22} />
                        </span>
                        <div>
                          <h3 className="font-display text-base text-brand-blue-deep">
                            {c.factor}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Data driven cost drivers passage for the newer tours */}
              {tour && (
                <section>
                  <Head
                    eyebrow="What sets the price"
                    title={`Why a ${tour.name} quote moves`}
                  />
                  <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-slate-700">
                    A {tour.name} tour has no fixed sticker, since the season, the
                    hotel, the excursions, and your departure city set each quote.
                    Our desk reads them live for your dates and sends the current
                    best price, with no hidden charges and no stale published
                    number.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {tour.costDrivers.map((c) => (
                      <div
                        key={c.factor}
                        className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-card"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange-dark">
                          <Icon name={c.icon} size={22} />
                        </span>
                        <div>
                          <h3 className="font-display text-base text-brand-blue-deep">
                            {c.factor}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    ))}
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
                  {isTour && (
                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
                      {[
                        "The visa is prepared and filed for you",
                        "No hidden charges, every amount in writing",
                        "Dates and hotel are adjusted before you pay",
                      ].map((o) => (
                        <li
                          key={o}
                          className="flex items-start gap-2 text-sm leading-snug text-brand-blue-deep"
                        >
                          <Icon
                            name="checkCircle"
                            size={18}
                            className="mt-0.5 shrink-0 text-brand-orange-dark"
                          />
                          {o}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={quoteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-orange"
                    >
                      {quoteLabel}
                    </a>
                    <a href={callHref} className="btn-outline">
                      Call {settings.phone}
                    </a>
                  </div>
                </div>
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

              {/* Durations, departure cities, and combos (every tour page) */}
              {isTour && (
                <section className="rounded-3xl bg-brand-blue-deep p-7 text-white shadow-lift sm:p-8">
                  <p className="eyebrow text-brand-orange">
                    More {tourName} options
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-white">
                    Durations, departure cities, and combos
                  </h2>
                  <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-slate-200">
                    Beyond this itinerary, our desk arranges longer {tourName}
                    stays, departures from Karachi, Lahore, Islamabad, and
                    Peshawar, and {tourName} combos with {comboPartners}. Ask for
                    the option that fits your dates and group.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={quoteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-orange"
                    >
                      Get a {tourName} quote
                    </a>
                    <Link
                      href="/tours"
                      className="btn border border-white/40 text-white hover:bg-white/10"
                    >
                      Browse all tours
                    </Link>
                  </div>
                </section>
              )}

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
                    stay? Umrah in Shawwal, the month after Eid ul Fitr, brings
                    lighter crowds and easier hotel availability with the same
                    complete service. Compare the Economy Umrah Package, or
                    message our desk for a Shawwal quote.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/umrah/economy-15-days"
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
                  quoteLabel={quoteLabel}
                  seasonalNote={seasonalNote}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Social proof: staging placeholders until real reviews are connected */}
      <Reviews data={reviewData} />

      {/* FAQ. Placed after reviews and the trust card, before the final CTA, so
          social proof and trust always sit above the FAQ per the section order. */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Questions and answers</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Common questions</h2>
            <div className="gold-rule mx-auto mt-6" />
          </div>
          <FaqAccordion
            items={detailFaqs(pkg)}
            idBase={`pkg-${pkg.slug}`}
            accent
          />
        </div>
      </section>

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
      <MobileActionBar
        quoteHref={quoteHref}
        telHref={callHref}
        quoteLabel={quoteLabel}
      />
    </>
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
  return <PackageDetailView pkg={pkg} />;
}
