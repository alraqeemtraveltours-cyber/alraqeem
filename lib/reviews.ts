// =====================================================================
// Social proof. Fill `reviews` below with real Google reviews or client
// testimonials; the Reviews section and SocialProof strip stay hidden on
// every page until at least one review exists, and Review/AggregateRating
// schema is only emitted from real data.
// =====================================================================

export type Review = {
  // Reviewer name as shown publicly, e.g. "Imran Khan".
  author: string;
  // Whole or half number from 1 to 5.
  rating: number;
  // The review text in the reviewer's own words.
  text: string;
  // Optional context that ties the review to intent, e.g. "Umrah" or "Peshawar".
  context?: string;
  // Optional ISO date, yyyy-mm-dd.
  date?: string;
};

export type ReviewData = {
  // Public Google Business Profile URL. Shown as a "Read all reviews" link when set.
  profileUrl: string;
  // Overall Google rating, e.g. 4.9. Leave null to omit AggregateRating.
  ratingValue: number | null;
  // Total number of ratings behind ratingValue, e.g. 37. Leave null to omit AggregateRating.
  reviewCount: number | null;
  // Individual named reviews. Three to six reads best.
  reviews: Review[];
};

export const reviewData: ReviewData = {
  // TODO: paste the public Google Business Profile URL.
  profileUrl: "",
  // TODO: overall Google rating and count, e.g. 4.9 and 37.
  ratingValue: null,
  reviewCount: null,
  // TODO: paste real Google reviews or client testimonials here, e.g.
  // {
  //   author: "Imran Khan",
  //   rating: 5,
  //   text: "The visa, flights and hotels were all handled smoothly...",
  //   context: "Umrah",
  //   date: "2026-06-15",
  // },
  reviews: [],
};

// True only when there is genuine review content to show.
export function hasReviews(data: ReviewData = reviewData) {
  return data.reviews.length > 0;
}
