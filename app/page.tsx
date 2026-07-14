import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import PackageInquiryCard from "@/components/packages/PackageInquiryCard";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import HomeFaq from "@/components/HomeFaq";
import CaptionedImage from "@/components/packages/CaptionedImage";
import SearchInquiryWidget from "@/components/SearchInquiryWidget";
import Reviews from "@/components/Reviews";
import { getPackages } from "@/lib/packagesStore";
import { getPosts } from "@/lib/postsStore";
import { getSettings } from "@/lib/settingsStore";
import { cities } from "@/lib/cities";
import { images, photo, realPhotos } from "@/lib/images";
import { reviewData } from "@/lib/reviews";
import { site, mapsLink } from "@/lib/site";
import { waHref, telHref } from "@/lib/settings";
import { homepageGraph } from "@/lib/schema";
import DestinationDirectory from "@/components/DestinationDirectory";

export const metadata: Metadata = {
  title: {
    absolute: "Umrah and Hajj Travel Agency in Pakistan | Al Raqeem",
  },
  description:
    "A full-service Umrah, Hajj and international travel agency serving all of Pakistan, with departures from Karachi, Lahore, Islamabad, Peshawar and more, the Saudi visa, flights, hotels and WhatsApp support. Based in Charsadda.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "Umrah and Hajj Travel Agency in Pakistan | Al Raqeem",
    description:
      "A full-service Umrah, Hajj and international travel agency serving all of Pakistan end to end, based in Charsadda.",
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
    image: images.kaaba,
    caption: "Masjid al-Haram and the Kaaba in Makkah",
    text: "Economy, premium, and Ramadan Umrah from seven to twenty eight days, with the Saudi e visa, flights, hotels near the Haram, and guided Ziyarat in Makkah and Madinah, departing from Karachi, Lahore, Islamabad, Peshawar, and other major cities.",
  },
  {
    title: "Hajj",
    href: "/hajj",
    anchor: "Hajj packages from Pakistan",
    icon: "moon",
    image: images.madinah,
    caption: "Masjid an-Nabawi in Madinah, visited on every Hajj journey",
    text: "A private Hajj and the government scheme through MORA, with the Maktab category, the camps at Mina, Arafat, and Muzdalifah, and trained scholars guiding every rite.",
  },
  {
    title: "Tours",
    href: "/tours",
    anchor: "international tour packages from Pakistan",
    icon: "plane",
    image: images.dubai,
    caption: "The Dubai skyline with the Burj Khalifa",
    text: "Dubai, Turkey, Baku, and Malaysia with Thailand, with the visit visa, flights, hotels, guided sightseeing, and a day by day itinerary in one booking.",
  },
];

const reasons = [
  {
    title: "A real office you can visit",
    text: "Our head office is in Charsadda, where you sit with real people across a desk, not a faceless call center, wherever in Pakistan you travel from.",
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
      { label: "Umrah from Peshawar", href: "/umrah/umrah-packages-peshawar" },
      { label: "Umrah from Islamabad", href: "/umrah/umrah-packages-islamabad" },
      { label: "Umrah from Charsadda", href: "/umrah/umrah-packages-charsadda" },
      { label: "Umrah from Rawalpindi", href: "/umrah/umrah-packages-rawalpindi" },
      { label: "Umrah from Lahore", href: "/umrah/umrah-packages-lahore" },
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
  // Balanced across the silos, not mostly Umrah, the most booked from each,
  // two Umrah, one Hajj, and one tour. Pricing is inquiry based, so the price
  // is stripped before it reaches the card.
  const allPkgs = await getPackages();
  const featured = [
    ...allPkgs.filter((p) => /umrah/i.test(p.slug)).slice(0, 2),
    ...allPkgs.filter((p) => /hajj/i.test(p.slug)).slice(0, 1),
    ...allPkgs.filter((p) => p.category !== "Umrah & Hajj").slice(0, 1),
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
            Serving pilgrims and travelers across all of Pakistan, with
            departures from Karachi, Lahore, Islamabad, Peshawar, and the major
            cities, and WhatsApp support from your first inquiry to your safe
            return.
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

      {/* Search widget, floating across the hero and airline partners seam so it
          reads as a bridge, half over the dark hero and half over the light band */}
      <div className="relative z-30 -mt-16 sm:-mt-24 lg:-mt-32">
        <div className="container-site">
          <div className="mx-auto max-w-5xl lg:mx-0">
            <SearchInquiryWidget whatsapp={settings.whatsapp} />
          </div>
        </div>
      </div>

      {/* Trusted Partners */}
      <section className="overflow-hidden border-y border-black/5 bg-white pb-14 pt-20 sm:pt-24">
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
              serving pilgrims and travelers across all of Pakistan, based in
              Charsadda, Khyber Pakhtunkhwa, and the sister company of Al Nafi
              Travels. Our desk arranges Umrah and Hajj to Makkah and Madinah,
              with hotels near Masjid al-Haram and Masjid an-Nabawi, guided
              Ziyarat, the Saudi Umrah e-visa, and government Hajj scheme
              registration through MORA. Packages run from economy to five star
              across 7 to 30 day durations for 2026, with quad, triple, and
              double sharing and departures from Karachi, Lahore, Islamabad,
              Peshawar, and other major cities. Beyond the pilgrimage, our team
              arranges international tours to Dubai, Turkey, Baku, and beyond,
              plus visit visas from Pakistan. Every package is quoted on inquiry
              because airfare and hotel rates move weekly, so we confirm the
              current best price for your exact dates.
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
                src={images.kaaba}
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
                src={images.madinah}
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
      <section className="overflow-hidden py-20 sm:py-28">
        <div className="container-site">
          <div
            data-testid="pilgrimage-comparison"
            className="overflow-hidden rounded-[2rem] bg-brand-blue-deep shadow-[0_28px_80px_rgba(11,44,34,0.18)] ring-1 ring-brand-blue-deep/10 sm:rounded-[2.5rem]"
          >
            <div className="relative grid lg:grid-cols-[0.82fr_1.18fr]">
              <div className="relative overflow-hidden px-6 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-10 lg:px-12 lg:py-14">
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
                <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-luxe text-brand-orange">
                    Umrah and Hajj
                  </p>
                  <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.35rem]">
                    Umrah and Hajj, and how they differ
                  </h2>
                  <div className="mt-7 h-px w-20 bg-brand-orange" />
                  <p className="mt-7 max-w-md text-base leading-relaxed text-white/70">
                    Two pilgrimages, two purposes. Here is the plain difference before you choose.
                  </p>
                </div>
              </div>

              <div className="bg-[#ebe3d3] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-14">
                <p className="text-base leading-[1.85] text-slate-700">
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
              </div>
            </div>

            <div className="grid gap-px bg-brand-blue-deep/10 md:grid-cols-2">
              <div className="bg-white px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
                <div className="mb-6 h-1 w-12 rounded-full bg-brand-orange" />
                <h3 className="font-display text-3xl text-brand-blue-deep">
                  Umrah
                </h3>
                <ul className="mt-6 divide-y divide-brand-blue-deep/10 text-sm leading-relaxed text-slate-600">
                  <li className="py-3 first:pt-0">Minor pilgrimage, performed year round</li>
                  <li className="py-3">Ihram, Tawaf, Sa'i, then Halq or Taqsir</li>
                  <li className="py-3">Voluntary and shorter, 7 to 30 days</li>
                  <li className="py-3 last:pb-0">Saudi Umrah e-visa, handled by our desk</li>
                </ul>
              </div>
              <div className="bg-[#faf8f3] px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
                <div className="mb-6 h-1 w-12 rounded-full bg-brand-blue" />
                <h3 className="font-display text-3xl text-brand-blue-deep">
                  Hajj
                </h3>
                <ul className="mt-6 divide-y divide-brand-blue-deep/10 text-sm leading-relaxed text-slate-600">
                  <li className="py-3 first:pt-0">Obligatory pilgrimage, once for those able</li>
                  <li className="py-3">Performed in Dhul Hijjah only</li>
                  <li className="py-3">Adds Arafat, Muzdalifah, and Mina</li>
                  <li className="py-3 last:pb-0">Registered through MORA and Nusuk</li>
                </ul>
              </div>
            </div>

            <div className="grid items-center gap-6 border-t border-white/10 px-6 py-7 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-12">
              <p className="max-w-3xl text-sm leading-relaxed text-white/65">
                Official registration runs through the{" "}
                <a
                  href="https://www.mora.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline decoration-brand-orange underline-offset-4"
                >
                  MORA portal
                </a>{" "}
                in Pakistan and the{" "}
                <a
                  href="https://www.nusuk.sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline decoration-brand-orange underline-offset-4"
                >
                  Nusuk platform
                </a>{" "}
                in Saudi Arabia, which also issues the{" "}
                <a
                  href="https://www.nusuk.sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline decoration-brand-orange underline-offset-4"
                >
                  Saudi Umrah e-visa
                </a>
                .
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/umrah" className="btn-orange whitespace-nowrap">
                  Explore Umrah packages
                </Link>
                <Link
                  href="/hajj"
                  className="btn whitespace-nowrap border border-white/35 text-white hover:border-white hover:bg-white hover:text-brand-blue-deep"
                >
                  Hajj packages
                </Link>
              </div>
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
            description="Three ways to travel with Al Raqeem, each handled end to end, with departures from Karachi, Lahore, Islamabad, Peshawar, and the major cities. Choose a route below to see durations, what is included, and how to get a quote for your dates."
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
                  src={s.image}
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

      {/* Destination directory, down links to every live destination */}
      <DestinationDirectory
        eyebrow="Where we travel"
        heading="Our tour destinations"
      />

      {/* Umrah tiers teaser, the full comparison lives on the Umrah hub */}
      <section className="overflow-hidden py-20 sm:py-28">
        <div className="container-site">
          <div
            data-testid="umrah-tier-intro"
            className="relative overflow-hidden rounded-[2rem] border border-brand-blue-deep/10 bg-[#ebe3d3] shadow-[0_24px_70px_rgba(11,44,34,0.12)] sm:rounded-[2.5rem]"
          >
            <div className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full border border-brand-orange/25" />
            <div className="pointer-events-none absolute -bottom-24 -left-8 h-52 w-52 rounded-full border border-brand-orange/25" />

            <div className="relative grid lg:grid-cols-[0.82fr_1.18fr]">
              <div className="px-6 pb-9 pt-8 sm:px-10 sm:pb-11 sm:pt-10 lg:px-12 lg:py-14">
                <p className="text-xs font-bold uppercase tracking-luxe text-brand-orange-dark">
                  Choosing your Umrah
                </p>
                <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.1] text-brand-blue-deep sm:text-5xl lg:text-[3.35rem]">
                  Economy, premium, and five star Umrah
                </h2>
                <div className="mt-7 h-px w-20 bg-brand-orange" />
              </div>

              <div className="border-t border-brand-blue-deep/10 bg-white/70 px-6 py-8 backdrop-blur-sm sm:px-10 sm:py-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-14">
                <p className="max-w-2xl text-base leading-[1.9] text-slate-700">
                  Economy suits budget conscious pilgrims, with hotels a short walk or
                  shuttle from the Haram. Premium and five star place you near or
                  facing it, with fewer travelers per room and private transport, and
                  the Ramadan program focuses on the last Ashra. Compare the three
                  tiers side by side, the room sharing, the hotel distance, and the
                  transport, on the Umrah hub, each quoted on inquiry.
                </p>
                <div className="mt-8 border-t border-brand-blue-deep/10 pt-7">
                  <Link href="/umrah" className="btn-orange">
                    Compare Umrah tiers on the hub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured packages */}
      <section className="relative overflow-hidden bg-brand-blue-deep py-20 sm:py-28">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full border border-white/5" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full border border-white/5" />
        <div className="container-site relative">
          <SectionHeading
            eyebrow="Featured packages"
            title="Where will you go first?"
            description="Compare our most booked Umrah packages, Hajj programs and international tours, with hotels, flights and inclusions on every card, each quoted on inquiry."
            tone="light"
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((p) => (
              <PackageInquiryCard
                key={p.slug}
                pkg={p}
                whatsapp={settings.whatsapp}
                variant="featured"
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/packages"
              className="btn border border-white/35 text-white hover:border-white hover:bg-white hover:text-brand-blue-deep"
            >
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Why us: split with image */}
      <section className="overflow-hidden bg-[#ebe3d3] py-20 sm:py-28">
        <div className="container-site grid items-start gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="relative lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[2rem] shadow-[0_24px_70px_rgba(11,44,34,0.2)] sm:rounded-[2.5rem]">
              <img
                src={photo(realPhotos.office, images.madinah)}
                alt={
                  realPhotos.office
                    ? "Al Raqeem Travel and Tours head office in Charsadda"
                    : "Domes of the Prophet's Mosque in Madinah"
                }
                loading="lazy"
                className="h-[460px] w-full object-cover sm:h-[560px] lg:h-[680px]"
              />
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-brand-blue-deep/55 via-transparent to-transparent sm:rounded-[2.5rem]" />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden rounded-2xl border border-white/25 bg-brand-orange px-7 py-5 shadow-lift sm:block">
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
            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-brand-blue-deep/10 bg-brand-blue-deep/10 shadow-card sm:grid-cols-2">
              {reasons.map((r) => (
                <div
                  key={r.title}
                  className="group relative overflow-hidden bg-white p-6 sm:p-7"
                >
                  <div className="mb-5 h-1 w-10 rounded-full bg-brand-orange transition-all duration-300 group-hover:w-16" />
                  <h3 className="text-xl leading-snug">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-brand-orange px-6 py-5 text-sm font-medium leading-relaxed text-brand-blue-deep shadow-card">
              Our head office sits at Aman Plaza, Mardan Road, Charsadda, open
              Monday to Saturday, where you meet the team in person before
              booking.
            </p>
            {credentialBadges.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {credentialBadges.map((c) => (
                  <li
                    key={c.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue-deep/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-brand-blue-deep backdrop-blur"
                  >
                    <span className="text-brand-orange-dark">{c.label}</span>
                    {c.value}
                  </li>
                ))}
              </ul>
            )}

            {/* Trust and experience proof */}
            <div className="mt-4 rounded-[2rem] bg-brand-blue-deep p-6 shadow-[0_18px_45px_rgba(11,44,34,0.18)] sm:p-7">
              <p className="text-xs font-bold uppercase tracking-luxe text-brand-orange">Trust and experience</p>
              <ul className="mt-5 space-y-3 text-sm text-white/75">
                <li className="flex items-start gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Sister company of {site.sisterCompany}, built on years of
                  serving pilgrims and travelers
                </li>
                <li className="flex items-start gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8853A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Head office at Aman Plaza, Mardan Road, Charsadda
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

              {/* Founder or team credibility, hidden until the real name is set */}
              {site.founder.name && (
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>
                  </span>
                  <div>
                    <p className="font-semibold text-white">
                      {site.founder.name}
                    </p>
                    <p className="text-xs text-white/55">{site.founder.role}</p>
                  </div>
                  <Link
                    href="/about"
                    className="ml-auto shrink-0 text-sm font-semibold text-brand-orange hover:text-white"
                  >
                    About us
                  </Link>
                </div>
              )}

              {/* Policy assurance */}
              <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/55">
                Cancellation and refund terms are confirmed in writing before you
                pay.{" "}
                <Link
                  href="/terms-and-refunds"
                  className="font-semibold text-white underline decoration-brand-orange underline-offset-4"
                >
                  Read our full terms and refund policy.
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
            description="We serve travelers across all of Pakistan, arranging your Umrah, Hajj, tour, or visa from any city through WhatsApp, document handling, and departure from your nearest airport. Our Charsadda office is where you meet our team in person."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedCities.map((c) => (
              <Link
                key={c.slug}
                href={`/umrah/umrah-packages-${c.slug}`}
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
