import SectionHeading from "@/components/SectionHeading";
import { reviewData as defaultData, type ReviewData } from "@/lib/reviews";

function Stars({
  rating,
  size = 16,
  muted = false,
}: {
  rating: number;
  size?: number;
  muted?: boolean;
}) {
  const rounded = Math.round(rating);
  const color = muted ? "#cbd5e1" : "#C5A253";
  return (
    <span
      className="inline-flex"
      aria-label={muted ? "Sample rating" : `${rating} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < rounded ? color : "none"}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function Reviews({
  data = defaultData,
}: {
  data?: ReviewData;
}) {
  // No reviews at all, no section.
  if (data.reviews.length === 0) return null;

  const placeholder = data.isPlaceholder === true;
  // Aggregate never shows for placeholder data.
  const showAggregate =
    !placeholder && data.ratingValue !== null && data.reviewCount !== null;

  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Reviews"
          title="What our travelers say"
          description={
            placeholder
              ? "This section is built and ready for real Google reviews and client testimonials."
              : "Real words from pilgrims and travelers our team has served across Pakistan."
          }
          align="center"
        />

        {placeholder && (
          <p className="mx-auto mb-10 max-w-xl rounded-xl border border-dashed border-brand-orange/50 bg-brand-orange/10 px-4 py-3 text-center text-sm font-semibold text-brand-orange-dark">
            Sample content for layout only. Replace before launch with real
            Google reviews or testimonials.
          </p>
        )}

        {showAggregate && (
          <div className="mx-auto mb-12 flex max-w-md flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white px-6 py-5 text-center shadow-card">
            <Stars rating={data.ratingValue as number} size={22} />
            <p className="font-display text-2xl text-brand-blue-deep">
              {data.ratingValue} out of 5
            </p>
            <p className="text-sm text-slate-500">
              From {data.reviewCount} Google reviews
            </p>
            {data.profileUrl && (
              <a
                href={data.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm font-semibold text-brand-orange-dark hover:underline"
              >
                Read all reviews on Google
              </a>
            )}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.reviews.map((r, i) => (
            <figure
              key={`${r.author}-${i}`}
              className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-card"
            >
              <Stars rating={r.rating} muted={placeholder} />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {r.text}
              </blockquote>
              <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-2 border-t border-black/5 pt-3">
                <span className="font-display text-base text-brand-blue-deep">
                  {r.author}
                </span>
                {r.context && (
                  <span className="text-xs text-slate-500">{r.context}</span>
                )}
                {r.date && (
                  <span className="text-xs text-slate-400">{r.date}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>

        {!showAggregate && data.profileUrl && (
          <div className="mt-10 text-center">
            <a
              href={data.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Read all reviews on Google
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
