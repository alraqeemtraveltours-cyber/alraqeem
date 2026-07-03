// =====================================================================
// Social proof. On the Vercel preview this pulls clearly labeled staging
// placeholders from lib/staging.ts so the section renders for review. No
// Review or AggregateRating schema is emitted while isPlaceholder is true.
// To go live: replace the items in lib/staging.ts with real reviews and set
// isPlaceholder to false (or wire a Google Business Profile feed).
// =====================================================================
import { stagingReviews } from "@/lib/staging";

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
  // True while the reviews are staging placeholders. No schema is emitted.
  isPlaceholder?: boolean;
};

export const reviewData: ReviewData = {
  profileUrl: stagingReviews.profileUrl,
  ratingValue: stagingReviews.ratingValue,
  reviewCount: stagingReviews.reviewCount,
  reviews: stagingReviews.items,
  isPlaceholder: stagingReviews.isPlaceholder,
};

// True only when there is genuine, non placeholder review content to show.
export function hasReviews(data: ReviewData = reviewData) {
  return data.reviews.length > 0 && !data.isPlaceholder;
}
