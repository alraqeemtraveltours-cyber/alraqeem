import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import PackageCard from "@/components/PackageCard";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import { getFeatured } from "@/lib/packagesStore";
import { cities } from "@/lib/cities";
import { getPosts } from "@/lib/postsStore";
import { images } from "@/lib/images";
import { site, waLink } from "@/lib/site";
import { travelAgencySchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const services = [
  {
    title: "Umrah & Hajj",
    text: "Complete pilgrimage packages with visa, flights, hotels near the Haram and guided Ziyarat. From economy to five-star premium.",
    href: "/packages",
    image: images.kaaba,
  },
  {
    title: "International Tours",
    text: "Dubai, Turkey, Baku, Malaysia and beyond. Visa, flights, hotels and sightseeing arranged in one booking.",
    href: "/packages",
    image: images.dubai,
  },
  {
    title: "Visa Services",
    text: "Visit visas for UAE, Saudi Arabia, Turkey, Malaysia and more. We prepare and check every document before filing.",
    href: "/visa-services",
    image: images.visa,
  },
];

const reasons = [
  {
    title: "A name you can visit",
    text: "Our head office is in Charsadda. You deal with real people you can sit with, not a faceless call center.",
  },
  {
    title: "Honest, upfront pricing",
    text: "Every cost is explained before you pay. No hidden charges appear later, ever.",
  },
  {
    title: "Experience behind us",
    text: `Al Raqeem is the sister company of ${site.sisterCompany}, built on years of serving pilgrims and travelers.`,
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

const stats = [
  { value: "7+", label: "Cities served" },
  { value: "8+", label: "Curated packages" },
  { value: "100%", label: "Upfront pricing" },
];

export default async function HomePage() {
  const featured = await getFeatured(4);
  const posts = (await getPosts()).slice(0, 3);

  return (
    <>
      <JsonLd data={travelAgencySchema()} />
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={images.heroKaaba}
          alt="The Holy Kaaba in Masjid al-Haram, Makkah"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 overlay-hero" />
        <div className="container-site relative py-24 sm:py-32 lg:py-40">
          <p className="eyebrow text-brand-orange">
            Charsadda · Peshawar · Islamabad · All Pakistan
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            From your doorstep to the{" "}
            <span className="italic text-brand-orange">Haram</span> and the
            world beyond
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {site.name} arranges Umrah, Hajj, international tours and visas with
            one promise: you focus on the journey, we handle everything else.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/packages" className="btn-orange">
              Explore Packages
            </Link>
            <a
              href={waLink(
                "Assalam o Alaikum, I want to ask about Umrah packages."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              Ask on WhatsApp
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

      {/* Trusted Partners */}
      <section className="overflow-hidden border-y border-black/5 bg-white py-14">
        <div className="container-site mb-10 text-center">
          <p className="eyebrow">Airline Partners</p>
          <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
            Flights with airlines you trust
          </h2>
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

      {/* Services */}
      <section className="py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="What we do"
            title="Every journey, handled completely"
            description="Four services, one standard: nothing left for you to chase."
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 overlay-dark" />
                  <h3 className="absolute bottom-4 left-5 text-xl text-white">
                    {s.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {s.text}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange-dark">
                    Learn more
                    <svg
                      width="16"
                      height="16"
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

      {/* Featured packages */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="Featured packages"
            title="Where will you go first?"
            description="Our most booked journeys across Umrah, Hajj and international escapes."
          />
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/packages" className="btn-outline">
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Why us — split with image */}
      <section className="py-20 sm:py-28">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-lift">
              <img
                src={images.madinah}
                alt="Domes of the Prophet's Mosque in Madinah"
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
              eyebrow="Why Al Raqeem"
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
          </div>
        </div>
      </section>

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
            description="Wherever you live, our process works the same: WhatsApp, documents, departure."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
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
        {/* Decorative crescent — top right */}
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
        {/* Decorative crescent — bottom left */}
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
              Register your interest for Hajj 2025 through the Government of
              Pakistan's official MORA portal. Secure your seat before
              allocations close.
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

      <CtaBand
        image={images.kaaba}
        imageAlt="The Holy Kaaba in Masjid al-Haram, Makkah"
      />
    </>
  );
}
