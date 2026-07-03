// =====================================================================
// STAGING PLACEHOLDERS. Single source of truth for launch blockers.
// The site is on a Vercel preview, not live, so these render now for the
// design to be judged. Every value here MUST be replaced before production,
// and none of it carries schema while flagged. Real values live in
// lib/site.ts (credentials) and flow into lib/reviews.ts once connected.
// =====================================================================

export const REPLACE_BEFORE_LAUNCH = true;

// Clearly labeled placeholder reviews. Not realistic fake copy, and no Review
// or AggregateRating schema is emitted while isPlaceholder is true. Swap the
// items for real Google reviews or client testimonials, set isPlaceholder to
// false, and add ratingValue and reviewCount to publish the rating.
export const stagingReviews = {
  isPlaceholder: true,
  profileUrl: "",
  ratingValue: null as number | null,
  reviewCount: null as number | null,
  items: [
    {
      author: "Sample review",
      rating: 5,
      text: "Replace before launch. A real Google review or client testimonial about an Umrah journey appears here.",
      context: "Umrah",
    },
    {
      author: "Sample review",
      rating: 5,
      text: "Replace before launch. A real Google review or client testimonial about a Hajj journey appears here.",
      context: "Hajj",
    },
    {
      author: "Sample review",
      rating: 5,
      text: "Replace before launch. A real Google review or client testimonial about an international tour appears here.",
      context: "Dubai tour",
    },
  ],
};

// Placeholder credentials, shown only where the real value in lib/site.ts is
// still blank. Never presented as a real number.
export const stagingCredentials = {
  registrationNumber: "Registration number to be added",
  moraLicence: "MORA operator number to be added",
};

// Placeholder founder or team credibility element. Replace with a real name
// and role from the client.
export const stagingFounder = {
  name: "Founder name to be added",
  role: "Founder and travel consultant",
};
