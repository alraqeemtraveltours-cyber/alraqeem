// Reusable decision-point CTA for tour pages. Placed after the itinerary and
// after the attractions, the two moments a reader decides. Primary quote action
// plus a lighter micro conversion (the itinerary on WhatsApp), and an honest
// seasonal line. No price, inquiry model only.
export default function TourCta({
  heading,
  quoteHref,
  quoteLabel,
  itineraryHref,
  seasonalNote,
  priceText = "Price on inquiry",
}: {
  heading: string;
  quoteHref: string;
  quoteLabel: string;
  itineraryHref: string;
  seasonalNote?: string;
  priceText?: string;
}) {
  return (
    <section className="rounded-3xl border border-brand-orange/30 bg-brand-orange/10 p-6 sm:p-7">
      <p className="font-display text-xl text-brand-blue-deep sm:text-2xl">
        {heading}
      </p>
      <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-slate-600">
        {priceText}. We quote the current best price for your exact dates, with
        no hidden charges.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={quoteHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-orange inline-flex items-center justify-center gap-2"
        >
          {quoteLabel}
          <svg
            width="17"
            height="17"
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
        </a>
        <a
          href={itineraryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Get the itinerary on WhatsApp
        </a>
      </div>
      {seasonalNote && (
        <p className="mt-4 text-sm leading-relaxed text-brand-orange-dark">
          {seasonalNote}
        </p>
      )}
    </section>
  );
}
