import Link from "next/link";
import { TravelPackage, priceLabel, packageHref } from "@/lib/packages";
import { packageImage } from "@/lib/images";
import { tierOf } from "@/lib/packageDetail";
import { waHref } from "@/lib/settings";

// Inquiry based card. No price anywhere. Two actions: Get a quote (WhatsApp
// with the package prefilled) and Details (the detail page).
export default function PackageInquiryCard({
  pkg,
  whatsapp,
  variant = "default",
}: {
  pkg: TravelPackage;
  whatsapp: string;
  variant?: "default" | "featured" | "umrah" | "tour";
}) {
  const href = packageHref(pkg);
  const tier = tierOf(pkg);
  const signals = pkg.highlights.slice(0, 2);
  const quote = waHref(
    whatsapp,
    `Assalam o Alaikum, I want a quote for the "${pkg.title}" package for my dates.`
  );
  const featured = variant === "featured";
  const umrah = variant === "umrah";
  const tour = variant === "tour";

  return (
    <article
      className={`group flex flex-col overflow-hidden bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lift ${
        featured
          ? "rounded-[1.75rem] border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.2)]"
          : umrah
            ? "rounded-[1.75rem] border border-brand-blue-deep/10 shadow-[0_16px_40px_rgba(11,44,34,0.12)]"
            : tour
              ? "rounded-[2rem] border border-brand-blue-deep/10 shadow-[0_18px_48px_rgba(11,44,34,0.14)]"
            : "rounded-3xl shadow-card ring-1 ring-black/5"
      }`}
    >
      <Link
        href={href}
        className={`relative block overflow-hidden ${
          featured ? "h-56" : umrah ? "h-60" : tour ? "h-72" : "h-48"
        }`}
      >
        <img
          src={packageImage(pkg.slug, pkg.category, pkg.image)}
          alt={`${pkg.title} from Pakistan`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 overlay-dark" />
        {!featured && !umrah && !tour && (
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4">
            <span className="rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-blue-deep shadow-sm">
              {tier ?? pkg.category}
            </span>
            <span className="rounded-full border border-white/20 bg-ink/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              {pkg.duration}
            </span>
          </div>
        )}
        {(featured || umrah || tour) && (
          <h3
            className={`absolute inset-x-0 bottom-0 leading-snug text-white ${
              featured
                ? "p-5 text-[1.45rem]"
                : tour
                  ? "p-6 text-[1.65rem]"
                  : "p-6 text-[1.55rem]"
            }`}
          >
            {pkg.title}
          </h3>
        )}
      </Link>

      {featured ? (
        <div className="flex flex-1 flex-col p-5">
          <p className="font-display text-lg text-brand-blue-deep">
            {priceLabel(pkg)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex min-h-8 max-w-full items-center rounded-full bg-brand-orange/20 px-3 py-1.5 text-[10px] font-bold uppercase leading-tight tracking-wide text-brand-blue-deep">
              {tier ?? pkg.category}
            </span>
            <span className="inline-flex min-h-8 max-w-full items-center rounded-full bg-brand-blue-deep/10 px-3 py-1.5 text-[10px] font-semibold leading-tight text-brand-blue-deep">
              {pkg.duration}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={quote}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange !px-3 !py-2.5 text-xs"
            >
              Get a quote
            </a>
            <Link
              href={href}
              className="btn-outline !px-3 !py-2.5 text-xs"
            >
              Details
            </Link>
          </div>
        </div>
      ) : tour ? (
        <div className="flex flex-1 flex-col bg-[#f8f5ee] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex min-h-8 max-w-full items-center rounded-full bg-brand-orange/20 px-3.5 py-1.5 text-[10px] font-bold uppercase leading-tight tracking-wide text-brand-blue-deep">
              {pkg.duration}
            </span>
            <p className="font-display text-lg text-brand-blue-deep">
              Price on inquiry
            </p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-brand-blue-deep/10 pt-5">
            <a
              href={quote}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange !px-3 !py-2.5 text-xs"
            >
              Get a quote
            </a>
            <Link
              href={href}
              className="btn-outline !px-3 !py-2.5 text-xs"
            >
              Details
            </Link>
          </div>
        </div>
      ) : umrah ? (
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {signals.length > 0 && (
            <ul className="space-y-2.5">
              {signals.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 text-brand-orange-dark">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-5">
            <div className="border-t border-brand-blue-deep/10 pt-4">
              <p className="font-display text-lg text-brand-blue-deep">
                {priceLabel(pkg)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex min-h-7 max-w-full items-center rounded-full bg-brand-orange/20 px-3 py-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-brand-blue-deep">
                  {tier ?? pkg.category}
                </span>
                <span className="inline-flex min-h-7 max-w-full items-center rounded-full bg-brand-blue-deep/10 px-3 py-1 text-[10px] font-semibold leading-tight text-brand-blue-deep">
                  {pkg.duration}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={quote}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-orange !px-3 !py-2.5 text-xs"
                >
                  Get a quote
                </a>
                <Link
                  href={href}
                  className="btn-outline !px-3 !py-2.5 text-xs"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl leading-snug">
            <Link href={href} className="transition hover:text-brand-blue">
              {pkg.title}
            </Link>
          </h3>

          {signals.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {signals.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-xs leading-snug text-slate-600"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#A8853A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 border-t border-black/5 pt-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Pricing
            </p>
            <p className="font-display text-lg text-brand-blue-deep">
              Price on inquiry
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Rates update weekly. We quote the current best price for your dates.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={quote}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange flex-1 !px-4 !py-2.5 text-sm"
              >
                Get a quote
              </a>
              <Link
                href={href}
                className="btn-outline flex-1 !px-4 !py-2.5 text-sm"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
