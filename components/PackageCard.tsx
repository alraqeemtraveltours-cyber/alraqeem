import Link from "next/link";
import { TravelPackage, formatPrice } from "@/lib/packages";
import { packageImage } from "@/lib/images";

export default function PackageCard({ pkg }: { pkg: TravelPackage }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl shadow-card ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      {/* Image */}
      <img
        src={packageImage(pkg.slug, pkg.category, pkg.image)}
        alt={pkg.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 overlay-dark" />

      {/* Top row: category + duration */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-blue-deep">
          {pkg.category}
        </span>
        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {pkg.duration}
        </span>
      </div>

      {/* Bottom content — kept minimal */}
      <div className="relative p-6">
        <h3 className="text-xl leading-snug text-white">{pkg.title}</h3>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
              {pkg.price === null ? "Pricing" : "From"}
            </p>
            <p className="font-display text-lg text-brand-orange">
              {formatPrice(pkg.price)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition group-hover:text-brand-orange">
            Details
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
      </div>
    </Link>
  );
}
