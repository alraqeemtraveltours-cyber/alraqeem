import type { Metadata } from "next";
import PackageCalculator from "@/components/PackageCalculator";
import { getCalculatorItems } from "@/lib/calculatorItemsStore";
import { getSettings } from "@/lib/settingsStore";
import { getSarExchangeRate } from "@/lib/exchangeRateStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Build Your Travel Package",
  description: "Build an estimated travel package using current hotel, visa, flight, transport, and sightseeing prices.",
  alternates: { canonical: "/package-calculator" },
};

export default async function PackageCalculatorPage() {
  const [items, settings, exchangeRate] = await Promise.all([
    getCalculatorItems(true),
    getSettings(),
    getSarExchangeRate(),
  ]);

  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-site py-16 sm:py-20">
          <p className="eyebrow text-brand-orange">Package calculator</p>
          <h1 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl">Build your own travel package</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-200">
            Choose hotels, visas, flights, transport, and extras to see the package total in SAR and its daily PKR conversion.
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
            />
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center shadow-card">
              <h2 className="text-2xl">Calculator prices are being updated</h2>
              <p className="mt-3 text-slate-600">Please check back shortly or contact our team for a custom quote.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
