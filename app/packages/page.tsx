import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import LastUpdated from "@/components/LastUpdated";
import { getSettings } from "@/lib/settingsStore";
import { mapsLink } from "@/lib/site";
import { waHref, telHref } from "@/lib/settings";
import { packagesHubGraph } from "@/lib/schema";

export const dynamic = "force-dynamic";

// Lightweight browse-all index. The silo hubs own the head terms, so this page
// does not target one; it simply routes visitors to each silo.
export const metadata: Metadata = {
  title: {
    absolute: "Browse Al Raqeem Packages and Services",
  },
  description:
    "Browse Al Raqeem: Umrah packages, the Hajj program, international tours, visa services, and flight deals from Pakistan. Quoted on inquiry for your dates.",
  alternates: { canonical: "/packages" },
  openGraph: { url: "/packages" },
};

const silos = [
  {
    href: "/umrah",
    title: "Umrah Packages",
    detail:
      "Economy, premium, and Ramadan Umrah, with hotels near the Haram, visa, flights, and guided Ziyarat.",
  },
  {
    href: "/hajj",
    title: "Hajj Package",
    detail:
      "A guided Hajj program with government MORA scheme registration, Maktab camps, and trained group leaders.",
  },
  {
    href: "/tours",
    title: "International Tours",
    detail:
      "Dubai, Turkey, Baku, and the Far East, with the visa, flights, hotels, and sightseeing in one booking.",
  },
  {
    href: "/visa-services",
    title: "Visa Services",
    detail:
      "Saudi, UAE, and other visit visas, prepared and filed by our team so your file clears cleanly.",
  },
  {
    href: "/tickets",
    title: "Flight Deals",
    detail:
      "Return airfare on the carrier with the best fare and schedule for your dates, from Peshawar and Islamabad.",
  },
];

export default async function PackagesBrowsePage() {
  const settings = await getSettings();

  return (
    <>
      <JsonLd data={packagesHubGraph()} />

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-site py-16 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-slate-300"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">Packages</span>
          </nav>
          <LastUpdated tone="dark" className="mt-3" />
          <h1 className="mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-4xl">
            Browse Al Raqeem packages and services
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
            Al Raqeem Travel & Tours is a full service Umrah, Hajj, tour, and
            visa agency in Charsadda, Khyber Pakhtunkhwa, serving all of
            Pakistan. Everything our desk arranges sits in one place here, from
            Umrah and the government MORA Hajj scheme to international tours and
            visit visas, each quoted on inquiry because airfare and hotel rates
            move weekly. Choose a section below, or message our team on WhatsApp
            for a quote on your exact dates.
          </p>
        </div>
      </section>

      {/* Silo cards */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-site">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {silos.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col rounded-3xl border border-black/5 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <h2 className="font-display text-xl text-brand-blue-deep">
                  {s.title}
                </h2>
                <div className="gold-rule mt-3" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  {s.detail}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange-dark">
                  View
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </Link>
            ))}
            <a
              href={waHref(
                settings.whatsapp,
                "Assalam o Alaikum, I want a quote for a package for my dates."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-center rounded-3xl border border-dashed border-brand-orange/40 bg-brand-orange/5 p-7 text-center"
            >
              <p className="font-display text-lg text-brand-blue-deep">
                Something custom?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Message our desk and we build the package around your dates and
                group.
              </p>
              <span className="btn-orange mt-5 !py-2.5 text-sm">
                Get a quote on WhatsApp
              </span>
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure where to start?"
        subtitle="Tell us where you want to go and when, and our desk points you to the right package with a quote for your exact dates."
        officeHref={mapsLink()}
      />
    </>
  );
}
