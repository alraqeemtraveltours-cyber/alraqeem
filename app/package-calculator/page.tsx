import type { Metadata } from "next";
import PackageCalculator from "@/components/PackageCalculator";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import { CtaBand } from "@/components/Shared";
import { getCalculatorItems } from "@/lib/calculatorItemsStore";
import { getSettings } from "@/lib/settingsStore";
import { getSarExchangeRate } from "@/lib/exchangeRateStore";
import { getTransportConfig } from "@/lib/transportConfigStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Umrah & Travel Package Calculator",
  description:
    "Build an estimated Umrah or travel package from current hotel, visa, flight, transport and sightseeing prices. See the total in SAR with a live PKR conversion, then get a written quote.",
  alternates: { canonical: "/package-calculator" },
  openGraph: { url: "/package-calculator" },
};

// Evergreen supporting content so the page carries real, unique value even
// before the calculator has live rates loaded, and reads as a proper landing
// page rather than a bare interactive widget. No prices are invented here —
// every figure the user sees still comes from the admin-managed items and the
// live exchange rate. Kept honest to the site's no-fabrication rule.
const steps = [
  {
    title: "Pick your components",
    body: "Choose your hotels in Makkah and Madinah, the Saudi visa, flights, ground transport between the cities, and any sightseeing extras. Add only what you need.",
  },
  {
    title: "See the live total",
    body: "The calculator adds everything into one package total in Saudi Riyal, with a daily per-person breakdown converted to Pakistani Rupees at the current exchange rate.",
  },
  {
    title: "Send it for a written quote",
    body: "Share your build with our desk on WhatsApp. We confirm the exact hotels, seats, and the final price in writing before you pay — no hidden charges added later.",
  },
];

const faqs = [
  {
    q: "How accurate is the package calculator?",
    a: "It gives a close estimate from the hotel, visa, flight, transport and sightseeing prices currently loaded by our team. Airfare and hotel rates move every week with the season and availability, so treat the total as a live estimate and let our desk confirm the final figure in writing for your exact dates.",
  },
  {
    q: "What does the total include?",
    a: "Only the components you add to the build — hotels, the Saudi visa, flights, ground transport, and any extras. Nothing is bundled in silently, so you can see exactly what each part of the package costs.",
  },
  {
    q: "Why is the price shown in SAR with a PKR conversion?",
    a: "Hotels and services in Saudi Arabia are priced in Saudi Riyal, so the package total is built in SAR for accuracy. We convert it to Pakistani Rupees at the current SAR-to-PKR rate so you can read the number in both currencies at a glance.",
  },
  {
    q: "Can I book directly from the calculator?",
    a: "The calculator builds an estimate, not a booking. To lock your dates, rooms and seats, send your build to our team on WhatsApp and we issue a written quote and hold the arrangements once you confirm.",
  },
  {
    q: "Do the prices change after I build a package?",
    a: "Yes. Hotel and flight rates change with the season, and the SAR-to-PKR rate moves daily, so the estimate reflects today's prices. We always reconfirm the current total in writing before any payment is taken.",
  },
];

export default async function PackageCalculatorPage() {
  const [items, settings, exchangeRate, transport] = await Promise.all([
    getCalculatorItems(true),
    getSettings(),
    getSarExchangeRate(),
    getTransportConfig(),
  ]);

  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-site py-16 sm:py-20">
          <p className="eyebrow text-brand-orange">Package calculator</p>
          <h1 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl">Build your own travel package</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-200">
            Choose hotels, visas, flights, transport, and extras to see the package total in SAR and its daily PKR conversion. It is a fast way to picture the cost of your Umrah or trip before you ask us for a firm quote.
          </p>
        </div>
      </section>
      <section className="bg-paper py-14 sm:py-20">
        <div className="container-site">
          {items.length > 0 ? (
            <PackageCalculator
              items={items}
              whatsapp={settings.whatsapp}
              sarToPkr={exchangeRate.rate}
              transport={transport}
            />
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center shadow-card">
              <h2 className="text-2xl">Calculator prices are being updated</h2>
              <p className="mt-3 text-slate-600">Please check back shortly or contact our team for a custom quote.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="How it works"
            title="From a rough idea to a written quote in three steps"
            description="The calculator is built to give you an honest picture of the cost first, then hand you over to a real person to finalise it."
          />
          <ol className="grid gap-5 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="flex flex-col rounded-3xl bg-white p-7 shadow-card"
              >
                <span className="font-display text-2xl text-brand-orange">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-xl text-brand-blue-deep">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            align="center"
            eyebrow="Good to know"
            title="Questions about the estimate"
            description="What the calculator does, and where our team takes over."
          />
          <FaqAccordion items={faqs} idBase="calculator-faq" />
        </div>
      </section>

      <CtaBand
        title="Happy with your estimate?"
        subtitle="Send your build to our team on WhatsApp or sit with us in Charsadda. We confirm the hotels, seats, and final price in writing before you pay."
      />
    </>
  );
}
