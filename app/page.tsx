import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import PackageInquiryCard from "@/components/packages/PackageInquiryCard";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import HomeFaq from "@/components/HomeFaq";
import LastUpdated from "@/components/LastUpdated";
import CaptionedImage from "@/components/packages/CaptionedImage";
import Reviews from "@/components/Reviews";
import { getFeatured } from "@/lib/packagesStore";
import { getPosts } from "@/lib/postsStore";
import { getSettings } from "@/lib/settingsStore";
import { cities } from "@/lib/cities";
import { images, photo, realPhotos } from "@/lib/images";
import { reviewData } from "@/lib/reviews";
import { stagingCredentials, stagingFounder } from "@/lib/staging";
import { site, mapsLink } from "@/lib/site";
import { waHref, telHref } from "@/lib/settings";
import { homepageGraph } from "@/lib/schema";

export const metadata: Metadata = {
  title: {
    absolute: "Umrah and Hajj Travel Agency in Pakistan | Al Raqeem",
  },
  description:
    "A full-service Umrah, Hajj and international travel agency in Pakistan, based in Charsadda, serving all Pakistan with visa, flights, hotels and support.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "Umrah and Hajj Travel Agency in Pakistan | Al Raqeem",
    description:
      "A full-service Umrah, Hajj and international travel agency in Pakistan, based in Charsadda and serving all Pakistan end to end.",
  },
};

// Three silo cards, the primary homepage bridge into each vertical. Each links
// to its silo hub with a descriptive anchor and carries a captioned slot.
const silos = [
  {
    title: "Umrah",
    href: "/umrah",
    anchor: "Umrah packages from Pakistan",
    icon: "moon",
    caption: "Masjid al-Haram and the Kaaba in Makkah",
    text: "Economy, premium, and Ramadan Umrah from seven to twenty eight days, with the Saudi e visa, flights, hotels near the Haram, and guided Ziyarat in Makkah and Madinah, departing from Peshawar and Islamabad.",
  },
  {
    title: "Hajj",
    href: "/hajj",
    anchor: "Hajj packages from Pakistan",
    icon: "moon",
    caption: "The tents of Mina during the days of Hajj",
    text: "A private Hajj and the government scheme through MORA, with the Maktab category, the camps at Mina, Arafat, and Muzdalifah, and trained scholars guiding every rite.",
  },
  {
    title: "Tours",
    href: "/tours",
    anchor: "international tour packages from Pakistan",
    icon: "plane",
    caption: "The Dubai skyline with the Burj Khalifa",
    text: "Dubai, Turkey, Baku, and Malaysia with Thailand, with the visit visa, flights, hotels, guided sightseeing, and a day by day itinerary in one booking.",
  },
];

// Umrah tier comparison. Attributes only, no price in any cell.
const tiers = [
  {
    name: "Economy",
    href: "/umrah/economy-15-days",
    rows: [
      { k: "Hotels", v: "Walking or shuttle distance" },
      { k: "Room sharing", v: "Quad and shared" },
      { k: "Transport", v: "Shared ground transport" },
      { k: "Best suited", v: "Budget conscious pilgrims" },
    ],
  },
  {
    name: "Premium and five star",
    href: "/umrah/premium-21-days",
    rows: [
      { k: "Hotels", v: "Near or facing the Haram" },
      { k: "Room sharing", v: "Triple and double" },
      { k: "Transport", v: "Private transport" },
      { k: "Best suited", v: "Comfort with worship" },
    ],
  },
  {
    name: "Ramadan",
    href: "/umrah/ramadan",
    rows: [
      { k: "Hotels", v: "Near the Haram, booked early" },
      { k: "Room sharing", v: "Confirmed on quote" },
      { k: "Transport", v: "Arranged for your group" },
      { k: "Best suited", v: "Last Ashra and Laylat al-Qadr" },
    ],
  },
];

const reasons = [
  {
    title: "A name you visit in person",
    text: "Our head office is in Charsadda. You sit with real people across a desk, not a faceless call center.",
  },
  {
    title: "Clear quotes before you pay",
    text: "Every cost is explained in your quote before you pay. No hidden charges appear later, ever.",
  },
  {
    title: "Experience behind us",
    text: `Our team works as the sister company of ${site.sisterCompany}, built on years of serving pilgrims and travelers.`,
  },
  {
    title: "With you till you return",
    text: "Our WhatsApp support stays active throughout your trip, from departure lounge to safe arrival home.",
  },
];

const steps = [
  {
    step: "01",
    title: "Tell us your plan",
    text: "Message us on WhatsApp or visit the office with your destination and dates.",
  },
  {
    step: "02",
    title: "Get a clear quote",
    text: "We send package options with full pricing the same day. You choose what fits.",
  },
  {
    step: "03",
    title: "We handle everything",
    text: "Visa, tickets, hotels and transport are arranged while you simply prepare to travel.",
  },
  {
    step: "04",
    title: "Travel with support",
    text: "Fly out with documents in hand and our team one WhatsApp message away.",
  },
];

// Topical bridge: descriptive anchors from the root into the topical tree.
// Every href resolves to an existing page. Missing targets go to the gaps report.
const bridge = [
  {
    heading: "Umrah and Hajj packages",
    links: [
      { label: "Economy Umrah, 15 days", href: "/umrah/economy-15-days" },
      { label: "Premium Umrah, 21 days", href: "/umrah/premium-21-days" },
      { label: "Ramadan Umrah Special", href: "/umrah/ramadan" },
      { label: "Hajj packages and MORA guidance", href: "/hajj" },
    ],
  },
  {
    heading: "Umrah from your city",
    links: [
      { label: "Umrah from Peshawar", href: "/areas/peshawar" },
      { label: "Umrah from Islamabad", href: "/areas/islamabad" },
      { label: "Umrah from Charsadda", href: "/areas/charsadda" },
      { label: "Umrah from Rawalpindi", href: "/areas/rawalpindi" },
      { label: "Umrah from Lahore", href: "/areas/lahore" },
    ],
  },
  {
    heading: "International tours",
    links: [
      { label: "Dubai city tour", href: "/tours/dubai" },
      { label: "Turkey, Istanbul and Cappadocia", href: "/tours/turkey" },
      { label: "Baku, Azerbaijan", href: "/tours/baku" },
      { label: "Malaysia and Thailand combo", href: "/tours/malaysia-thailand" },
    ],
  },
  {
    heading: "Visas and travel guides",
    links: [
      { label: "Visit visa services", href: "/visa-services" },
      { label: "First time Umrah guide", href: "/blog/first-time-umrah-guide-pakistan" },
      { label: "Dubai visit visa guide", href: "/blog/dubai-visit-visa-requirements-pakistan" },
      { label: "All travel guides", href: "/blog" },
    ],
  },
];

// Priority stack order for the homepage: pilgrimage hubs first.
const cityOrder = [
  "charsadda",
  "peshawar",
  "islamabad",
  "rawalpindi",
  "lahore",
  "tangi",
  "shabqadar",
];

export default async function HomePage() {
  const settings = await getSettings();
  const featuredRaw = await getFeatured(4);
  // Pilgrimage cards lead the stack on mobile. Pricing is inquiry based, so
  // the price is stripped before it reaches the card.
  const featured = [
    ...featuredRaw.filter((p) => p.category === "Umrah & Hajj"),
    ...featuredRaw.filter((p) => p.category !== "Umrah & Hajj"),
  ].map((p) => ({ ...p, price: null }));
  const posts = (await getPosts()).slice(0, 3);
  const orderedCities = cityOrder
    .map((slug) => cities.find((c) => c.slug === slug))
    .filter((c): c is (typeof cities)[number] => Boolean(c));

  // Real credentials only. Blank values are omitted.
  const credentialBadges = [
    { label: "Company No.", value: site.credentials.companyNumber },
    { label: "MORA Umrah operator", value: site.credentials.moraLicence },
    { label: "IATA", value: site.credentials.iata },
  ].filter((c) => c.value);

  const stats = [
    { value: "7+", label: "Cities served" },
    { value: "8+", label: "Curated packages" },
    { value: "0", label: "Hidden charges" },
  ];

  return (
    <>
      <JsonLd data={homepageGraph(featured, posts, reviewData)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={photo(realPhotos.hero, images.heroKaaba)}
          alt={
            realPhotos.hero
              ? "Umrah, Hajj and international travel from Pakistan"
              : "The Holy Kaaba in Masjid al-Haram, Makkah"
          }
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="container-site relative py-24 sm:py-32 lg:py-40">
          <p className="eyebrow text-brand-orange">
            Charsadda · Peshawar · Islamabad · All Pakistan
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Umrah, Hajj and International Travel Agency in Pakistan
          </h1>
          <p className="mt-4 max-w-2xl font-display text-xl italic text-brand-orange sm:text-2xl">
            From your doorstep to the Haram and the world beyond
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {site.name} arranges Umrah, Hajj, international tours and visas from
            Pakistan, quoted on inquiry because airfare and hotel rates move
            weekly, with WhatsApp support from inquiry to safe return.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/packages" className="btn-orange">
              Explore Packages
            </Link>
            <a
              href={waHref(
                settings.whatsapp,
                "Assalam o Alaikum, I want to ask about Umrah packages."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              Ask on WhatsApp
            </a>
            <a
              href={telHref(settings.phone)}
              className="btn border border-white/40 text-white hover:bg-white/10 sm:hidden"
            >
              Call {settings.phone}
            </a>
          </div>
          <LastUpdated tone="dark" className="mt-6" />
          <div className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-brand-orange sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="overflow-hidden border-y border-black/5 bg-white py-14">
        <div className="container-site mb-10 text-center">
          <p className="eyebrow">Airline Partners</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
            Flights with airlines you trust
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            We ticket on Saudia, Qatar Airways, Etihad, PIA, Airblue, and
            AirSial, choosing the carrier with the best fare and schedule for
            your dates.
          </p>
        </div>
        {/* Infinite marquee strip */}
        <div
          className="relative overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)" }}
        >
          <div className="animate-marquee flex w-max items-center gap-14">
            {[
              { src: "/partners/qatar-airways.jpg", alt: "Qatar Airways",    big: true },
              { src: "/partners/airblue.png",       alt: "Airblue",          xl: true },
              { src: "/partners/airsial.png",       alt: "AirSial" },
              { src: "/partners/etihad.png",        alt: "Etihad Airways",   medium: true },
              { src: "/partners/saudia.png",        alt: "Saudia",           big: true },
              { src: "/partners/pia.png",           alt: "PIA",              big: true },
              /* duplicate for seamless loop */
              { src: "/partners/qatar-airways.jpg", alt: "Qatar Airways 2",  big: true },
              { src: "/partners/airblue.png",       alt: "Airblue 2",        xl: true },
              { src: "/partners/airsial.png",       alt: "AirSial 2" },
              { src: "/partners/etihad.png",        alt: "Etihad Airways 2", medium: true },
              { src: "/partners/saudia.png",        alt: "Saudia 2",         big: true },
              { src: "/partners/pia.png",           alt: "PIA 2",            big: true },
            ].map((p) => (
              <div
                key={p.alt}
                className="flex h-16 w-40 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-paper px-5 shadow-card"
              >
                <img
                  src={p.src}
                  alt={p.alt.replace(" 2", "")}
                  loading="lazy"
                  className={`max-w-full object-contain mix-blend-multiply ${p.xl ? "max-h-18" : p.big ? "max-h-14" : p.medium ? "max-h-12" : "max-h-10"}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entity context layer */}
      <section className="border-b border-black/5 bg-paper py-16 sm:py-20">
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Umrah, Hajj and travel from Pakistan</p>
            <p className="mt-5 text-base leading-relaxed text-slate-700 sm:text-lg">
              {site.name} is a full service Umrah, Hajj, tour, and visa agency
              based in Charsadda, Khyber Pakhtunkhwa, and the sister company of
              Al Nafi Travels, serving pilgrims and travelers across all of
              Pakistan. Our desk arranges Umrah and Hajj to Makkah and Madinah,
              with hotels near Masjid al-Haram and Masjid an-Nabawi, guided
              Ziyarat, the Saudi Umrah e-visa, and government Hajj scheme
              registration through MORA. Packages run from economy to five star
              across 7 to 30 day durations for 2026, with quad, triple, and
              double sharing and departures from Peshawar and Islamabad. Beyond
              the pilgrimage, our team arranges international tours to Dubai,
              Turkey, Baku, and beyond, plus visit visas from Pakistan. Every
              package is quoted on inquiry because airfare and hotel rates move
              weekly, so we confirm the current best price for your exact dates.
            </p>
          </div>
        </div>
      </section>

      {/* Holy places band */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Where your journey takes you"
            title="Makkah and Madinah"
            description="The two cities at the heart of every pilgrimage."
            align="center"
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-black/5">
              <CaptionedImage
                caption="Masjid al-Haram and the Kaaba in Makkah"
                icon="moon"
                aspect="aspect-[16/9]"
              />
              <div className="px-2 pb-2 pt-1">
                <h3 className="font-display text-xl text-brand-blue-deep">
                  Makkah
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  The city of Masjid al-Haram and the Kaaba, where pilgrims
                  perform Tawaf and Sa'i between Safa and Marwah. Our hotels sit
                  within reach of the Haram so your prayers stay close.
                </p>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-black/5">
              <CaptionedImage
                caption="Masjid an-Nabawi and the Rawdah in Madinah"
                icon="moon"
                aspect="aspect-[16/9]"
              />
              <div className="px-2 pb-2 pt-1">
                <h3 className="font-display text-xl text-brand-blue-deep">
                  Madinah
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  The city of Masjid an-Nabawi and the Rawdah, with Ziyarat of
                  the historical sites. Our team arranges guided visits so you
                  make the most of your time in the Prophet's city.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Umrah and Hajj explainer */}
      <section className="py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Umrah and Hajj"
            title="Umrah and Hajj, and how they differ"
            description="Two pilgrimages, two purposes. Here is the plain difference before you choose."
            align="center"
          />
          <div className="mx-auto max-w-3xl">
            <p className="text-base leading-relaxed text-slate-700">
              Umrah is the minor pilgrimage, performed year round. Pilgrims enter
              in Ihram, perform Tawaf around the Kaaba, and complete Sa'i between
              Safa and Marwah, then release Ihram with Halq or Taqsir. Hajj is the
              obligatory pilgrimage of Dhul Hijjah, performed once by those who
              are able. Hajj keeps the Umrah rites and adds the standing at
              Arafat, the night at Muzdalifah, and the days at Mina, registered
              through MORA in Pakistan and Nusuk in Saudi Arabia. The plain
              difference: Umrah is shorter, year round, and voluntary, while Hajj
              falls in Dhul Hijjah, adds Arafat, Muzdalifah, and Mina, and is
              obligatory once for those who are able.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                <h3 className="font-display text-xl text-brand-blue-deep">
                  Umrah
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-600">
                  <li>Minor pilgrimage, performed year round</li>
                  <li>Ihram, Tawaf, Sa'i, then Halq or Taqsir</li>
                  <li>Voluntary and shorter, 7 to 30 days</li>
                  <li>Saudi Umrah e-visa, handled by our desk</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
                <h3 className="font-display text-xl text-brand-blue-deep">
                  Hajj
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-600">
                  <li>Obligatory pilgrimage, once for those able</li>
                  <li>Performed in Dhul Hijjah only</li>
                  <li>Adds Arafat, Muzdalifah, and Mina</li>
                  <li>Registered through MORA and Nusuk</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              Official registration runs through the{" "}
              <a
                href="https://www.mora.gov.pk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-blue underline"
              >
                MORA portal
              </a>{" "}
              in Pakistan and the{" "}
              <a
                href="https://www.nusuk.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-blue underline"
              >
                Nusuk platform
              </a>{" "}
              in Saudi Arabia, which also issues the{" "}
              <a
                href="https://www.nusuk.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-blue underline"
              >
                Saudi Umrah e-visa
              </a>
              .
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/umrah" className="btn-orange">
                Explore Umrah packages
              </Link>
              <Link
                href="/hajj"
                className="btn-outline"
              >
                Hajj packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="What we offer"
            title="Umrah, Hajj, and international tours"
            description="Three ways to travel with Al Raqeem, each handled end to end from Peshawar and Islamabad. Choose a route below to see durations, what is included, and how to get a quote for your dates."
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {silos.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <CaptionedImage
                  caption={s.caption}
                  icon={s.icon}
                  aspect="aspect-[16/9]"
                />
                <div className="flex flex-1 flex-col pt-4">
                  <h3 className="font-display text-xl text-brand-blue-deep">
                    {s.title}
                  </h3>
                  <div className="gold-rule mt-2" />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {s.text}
                  </p>
                  <span className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-orange-dark group-hover:text-brand-orange">
                    {s.anchor}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Choosing your package */}
      <section className="py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Choosing your package"
            title="Which Umrah tier fits you?"
            description="Compare the tiers by what actually differs, with no price in any cell."
            align="center"
          />
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-700">
            Every Umrah package covers the Saudi e-visa, flights, hotels,
            transport, and guided Ziyarat, so the choice comes down to comfort
            and budget. Economy suits budget conscious pilgrims, with shared
            rooms and hotels within walking or shuttle distance of the Haram.
            Premium and five star place you in hotels near or facing the Haram,
            with fewer travelers per room and private transport. Ramadan
            programs focus on the last Ashra and the nights of Laylat al-Qadr,
            and book months ahead. Family and group options run across every
            tier, with connected rooms arranged. Durations run from 7 to 30 days,
            departing from Peshawar and Islamabad.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-card"
              >
                <h3 className="font-display text-xl text-brand-blue-deep">
                  {t.name}
                </h3>
                <dl className="mt-4 flex-1 divide-y divide-black/5">
                  {t.rows.map((r) => (
                    <div key={r.k} className="flex justify-between gap-3 py-2.5">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {r.k}
                      </dt>
                      <dd className="text-right text-sm font-medium text-brand-blue-deep">
                        {r.v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={t.href}
                  className="btn-outline mt-5 w-full !py-2.5 text-sm"
                >
                  View {t.name} Umrah
                </Link>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
            Room sharing and exact hotels are confirmed for your group when we
            quote. No prices are published, since airfare and hotel rates change
            weekly.
          </p>
        </div>
      </section>

      {/* Featured packages */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Featured packages"
            title="Where will you go first?"
            description="Compare our most booked Umrah packages, Hajj programs and international tours, with hotels, flights and inclusions on every card, each quoted on inquiry."
          />
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((p) => (
              <PackageInquiryCard
                key={p.slug}
                pkg={p}
                whatsapp={settings.whatsapp}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/packages" className="btn-outline">
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Why us: split with image */}
      <section className="py-20 sm:py-28">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-lift">
              <img
                src={photo(realPhotos.office, images.madinah)}
                alt={
                  realPhotos.office
                    ? "Al Raqeem Travel and Tours head office in Charsadda"
                    : "Domes of the Prophet's Mosque in Madinah"
                }
                loading="lazy"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden rounded-2xl bg-brand-orange px-7 py-5 shadow-lift sm:block">
              <p className="font-display text-2xl text-brand-blue-deep">
                Sister company of
              </p>
              <p className="text-sm font-semibold text-brand-blue-deep/80">
                {site.sisterCompany}
              </p>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Why travelers choose us"
              title="Travel companies sell tickets. We take responsibility."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {reasons.map((r) => (
                <div
                  key={r.title}
                  className="rounded-2xl border border-black/5 bg-white p-6 shadow-card"
                >
                  <h3 className="text-lg">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl border border-black/5 bg-paper p-5 text-sm leading-relaxed text-slate-600">
              Our head office sits at Aman Plaza, Mardan Road, Charsadda, open
              Monday to Saturday, where you meet the team in person before
              booking.
            </p>
            {credentialBadges.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {credentialBadges.map((c) => (
                  <li
                    key={c.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-blue-deep shadow-card"
                  >
                    <span className="text-brand-orange-dark">{c.label}</span>
                    {c.value}
                  </li>
                ))}
              </ul>
            )}

            {/* Trust and experience proof */}
            <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5 shadow-card">
              <p className="eyebrow">Trust and experience</p>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Sister company of {site.sisterCompany}, built on years of
                  serving pilgrims and travelers
                </li>
                <li className="flex items-start gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Head office at Aman Plaza, Mardan Road, Charsadda
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

              {/* Founder or team credibility */}
              <div className="mt-4 flex items-center gap-3 border-t border-black/5 pt-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>
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
                <Link
                  href="/about"
                  className="ml-auto shrink-0 text-sm font-semibold text-brand-orange-dark hover:text-brand-orange"
                >
                  About us
                </Link>
              </div>

              {/* Policy assurance */}
              <p className="mt-4 border-t border-black/5 pt-4 text-xs leading-relaxed text-slate-500">
                Cancellation and refund terms are confirmed in writing before you
                pay.{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-brand-blue underline"
                >
                  Ask our desk for the full terms.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof (renders only when real reviews exist) */}
      <Reviews data={reviewData} />

      {/* How it works */}
      <section className="bg-brand-blue-deep py-20 text-white sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="How it works"
            title="From inquiry to boarding pass in four steps"
            tone="light"
            align="center"
          />
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
              >
                <span className="font-display text-4xl text-brand-orange">
                  {s.step}
                </span>
                <h3 className="mt-3 text-lg text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Areas we serve"
            title="One office in Charsadda, serving all of Pakistan"
            description="Our Charsadda office serves Charsadda, Peshawar, Islamabad, Rawalpindi, Lahore, Tangi and Shabqadar, arranging Umrah, Hajj, tours and visas for travelers across all of Pakistan through WhatsApp, documents and departure."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedCities.map((c) => (
              <Link
                key={c.slug}
                href={`/areas/${c.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white px-6 py-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div>
                  <p className="font-display text-lg text-brand-blue-deep">
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-500">{c.region}</p>
                </div>
                <span className="text-brand-orange-dark transition group-hover:translate-x-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hajj Pre Registration */}
      <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
        {/* Decorative crescent, top right */}
        <svg
          viewBox="0 0 400 400"
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 w-[340px] opacity-[0.07] sm:w-[420px]"
        >
          <path
            d="M200 40a160 160 0 1 0 0 320 130 130 0 1 1 0-320z"
            fill="#C5A253"
          />
        </svg>
        {/* Decorative crescent, bottom left */}
        <svg
          viewBox="0 0 400 400"
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 w-[280px] rotate-180 opacity-[0.05]"
        >
          <path
            d="M200 40a160 160 0 1 0 0 320 130 130 0 1 1 0-320z"
            fill="#C5A253"
          />
        </svg>

        <div className="container-site relative">
          <div className="mx-auto max-w-2xl text-center">
            {/* Icon badge */}
            <div className="mb-6 inline-flex items-center justify-center rounded-full border border-brand-orange/40 bg-brand-orange/15 p-5">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C5A253"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* Crescent moon */}
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#C5A253" stroke="none" />
              </svg>
            </div>

            <p className="eyebrow text-brand-orange">
              Ministry of Religious Affairs · Official Portal
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl">
              Hajj Pre-Registration
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
              Register your interest for the upcoming Hajj season through the
              Government of Pakistan's official MORA portal. Secure your place
              before allocations close.
            </p>

            {/* Info pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2", label: "Limited Seats" },
                { icon: "M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", label: "Free to Register" },
                { icon: "M3 12l9-9 9 9M5 10v10h14V10", label: "Government Portal" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C5A253"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <a
                href="https://www.mora.gov.pk/Detail/YTI4ZjNkYzAtNGNmMi00MzBiLWFlZmYtOTg5MGI5ZmRiY2Nm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-brand-orange px-8 py-4 text-sm font-semibold text-brand-blue-deep shadow-lift transition hover:bg-brand-orange-dark"
              >
                Register on MORA Portal
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
              <p className="mt-3 text-xs text-slate-500">
                Opens the official mora.gov.pk portal in a new tab
              </p>
              <p className="mx-auto mt-6 max-w-xl text-sm text-slate-400">
                Prefer a fully arranged journey? Our{" "}
                <Link
                  href="/hajj"
                  className="font-semibold text-brand-orange underline"
                >
                  private Hajj packages
                </Link>{" "}
                cover{" "}
                <a
                  href="https://www.nusuk.sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-orange underline"
                >
                  Nusuk
                </a>{" "}
                and visa processing, trained group leaders, and Mina and Arafat
                camp services from booking to safe return.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Travel guides"
            title="Advice from our desk"
          />
          <div className="grid gap-7 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-black/5 bg-paper p-7 transition hover:-translate-y-1 hover:shadow-card"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-dark">
                  {post.readMinutes} min read
                </p>
                <h3 className="mt-3 text-lg leading-snug transition group-hover:text-brand-blue">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Questions and answers"
            title="Umrah, Hajj and visa questions, answered"
            description="Straight answers on Umrah and Hajj costs, inclusions, hotels, visas and booking from any city in Pakistan."
            align="center"
          />
          <HomeFaq />
        </div>
      </section>

      {/* Topical bridge: internal link hub into the topical tree */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Explore more"
            title="Plan your journey by package, city, or visa"
            description="Jump straight to a package tier, your departure city, an international tour, or a visit visa, all handled by our team."
            align="center"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {bridge.map((group) => (
              <div key={group.heading}>
                <h3 className="font-display text-lg text-brand-blue-deep">
                  {group.heading}
                </h3>
                <ul className="mt-3 space-y-1">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-brand-blue"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#A8853A"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        image={images.kaaba}
        imageAlt="The Holy Kaaba in Masjid al-Haram, Makkah"
        officeHref={mapsLink()}
      />
    </>
  );
}
