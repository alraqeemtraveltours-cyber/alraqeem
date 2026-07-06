import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { CtaBand, PageHero } from "@/components/Shared";
import SearchInquiryWidget from "@/components/SearchInquiryWidget";
import { images } from "@/lib/images";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visa Services",
  description:
    "Visit visa processing from Pakistan for UAE, Saudi Arabia, Turkey, Malaysia, Thailand, Azerbaijan and more. Document preparation and checking included.",
  alternates: { canonical: "/visa-services" },
  openGraph: { url: "/visa-services" },
};

const visas = [
  {
    country: "United Arab Emirates",
    type: "30 / 60 day visit visa",
    time: "3 to 5 working days",
    note: "Single and multiple entry options. Hotel booking support included.",
  },
  {
    country: "Saudi Arabia",
    type: "Umrah e-visa & visit visa",
    time: "2 to 4 working days",
    note: "Processed with our Umrah packages or standalone for family visits.",
  },
  {
    country: "Turkey",
    type: "e-Visa & sticker visa",
    time: "3 to 7 working days",
    note: "e-Visa for eligible travelers, full sticker visa filing for others.",
  },
  {
    country: "Malaysia",
    type: "eVisa / entry pass",
    time: "3 to 5 working days",
    note: "Single entry tourist eVisa with document checklist provided.",
  },
  {
    country: "Thailand",
    type: "Tourist visa",
    time: "5 to 7 working days",
    note: "Bank statement and itinerary guidance included.",
  },
  {
    country: "Azerbaijan",
    type: "e-Visa",
    time: "2 to 4 working days",
    note: "One of the easiest visas for Pakistani passport holders.",
  },
  {
    country: "Schengen States",
    type: "Tourist / visit visa",
    time: "15 to 30 working days",
    note: "Complete file preparation, appointment booking and interview guidance.",
  },
  {
    country: "United Kingdom",
    type: "Standard visitor visa",
    time: "15 to 30 working days",
    note: "Document review and application support for family visits and tourism.",
  },
];

const included = [
  "Document checklist specific to your case",
  "Form filling and application submission",
  "Photograph and scan quality checking",
  "Hotel and ticket booking support where required",
  "Status updates on WhatsApp until decision",
];

export default function VisaServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Visa services"
        title="Visas approved start with files prepared right"
        description="Most visa rejections come from small document errors, not ineligibility. Our team checks every page of your file before it is submitted."
        image={images.visa}
      />

      <div className="relative z-10 -mt-10 sm:-mt-14">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <SearchInquiryWidget />
          </div>
        </div>
      </div>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Destinations"
            title="Countries we process"
            description="Processing times are typical estimates and depend on embassy workload. Fees are quoted at the time of application since they change with exchange rates."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visas.map((v) => (
              <div
                key={v.country}
                className="flex flex-col rounded-3xl bg-white p-6 shadow-card"
              >
                <h3 className="text-xl">{v.country}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-blue">
                  {v.type}
                </p>
                <p className="mt-3 text-sm text-slate-600">{v.note}</p>
                <div className="mt-auto pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Typical processing
                  </p>
                  <p className="font-display text-lg text-brand-orange-dark">
                    {v.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site grid items-start gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="What's included"
            title="Every visa file gets the full service"
            description="One fee covers preparation, submission and follow-up. You are never left guessing about your application status."
          />
          <ul className="space-y-4">
            {included.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-paper px-5 py-4 text-sm font-medium text-slate-700"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {item}
              </li>
            ))}
            <li>
              <a
                href={waLink("Assalam o Alaikum, I need help with a visit visa. Country: ")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange mt-2 w-full sm:w-auto"
              >
                Start My Visa Application
              </a>
            </li>
          </ul>
        </div>
      </section>

      <CtaBand
        title="Not sure which visa you need?"
        subtitle="Send us your destination and purpose of travel. We will tell you exactly what applies to your case, free of charge."
      />
    </>
  );
}
