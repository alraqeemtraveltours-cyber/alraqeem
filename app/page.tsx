import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import PackageCard from "@/components/PackageCard";
import { CtaBand } from "@/components/Shared";
import { getFeatured } from "@/lib/packagesStore";
import { cities } from "@/lib/cities";
import { posts } from "@/lib/posts";
import { images } from "@/lib/images";
import { site, waLink } from "@/lib/site";

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
  { value: "12+", label: "Curated packages" },
  { value: "100%", label: "Upfront pricing" },
];

export default function HomePage() {
  const featured = packages.filter((p) => p.featured);

  return (
    <>
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

      {/* Services */}
      <section className="py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="What we do"
            title="Every journey, handled completely"
            description="Four services, one standard: nothing left for you to chase."
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            description="Our most booked journeys across Umrah, international escapes and northern Pakistan."
          />
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/packages" className="btn-outline">
              View All 12 Packages
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

      <CtaBand image={images.kaaba} />
    </>
  );
}
