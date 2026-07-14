import { reviewData } from "@/lib/reviews";

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  const color = "#C5A253";
  return (
    <span className="inline-flex" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rounded ? color : "none"}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

// Compact social-proof strip, placed near the hero CTA and after the itinerary.
// Renders only once a real Google rating exists in lib/reviews.ts; until then
// it stays hidden. `theme` sets the palette for the dark hero versus a light
// content section.
export default function SocialProof({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const d = reviewData;
  if (d.ratingValue == null || d.reviewCount == null) return null;

  const dark = theme === "dark";
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
        dark ? "bg-white/10 text-white" : "bg-white text-slate-700 shadow-card"
      }`}
    >
      <Stars rating={d.ratingValue} />
      <span className="font-semibold">
        {d.ratingValue} out of 5 from {d.reviewCount} Google reviews
      </span>
    </div>
  );
}
