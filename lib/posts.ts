export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "first-time-umrah-guide-pakistan",
    title: "First Time Umrah from Pakistan: A Complete Step by Step Guide",
    excerpt:
      "Everything a first-time pilgrim from Pakistan needs to know, from documents and visa to what to pack and what to expect in Makkah.",
    date: "2026-05-12",
    readMinutes: 7,
    body: [
      "Performing Umrah for the first time is a moment most Pakistani families plan for years. The journey itself, however, is simpler than most people expect once the paperwork is in the right hands. This guide walks you through the entire process.",
      "Start with your passport. It must be valid for at least six months beyond your travel date, with at least two blank pages. If your passport is close to expiry, renew it before booking anything, since Saudi e-visa applications are tied to passport validity.",
      "The Saudi Umrah e-visa is now processed electronically and usually takes a few working days when documents are complete. You will need passport scans, photographs with a white background, and a confirmed package booking. A registered travel agency files this for you, which removes the most common cause of rejections: small document errors.",
      "Choose your package based on hotel distance from the Haram, not just the price. A cheaper hotel two kilometers away means taxi costs and exhaustion five times a day. Packages that look slightly more expensive but place you within walking distance almost always cost less overall and protect your energy for worship.",
      "Pack light. Two sets of ihram for men, comfortable abayas for women, walking sandals, unstitched prayer mats, and any daily medicines with prescriptions. Makkah and Madinah have everything else, often cheaper than Pakistan.",
      "Finally, attend a pre-departure briefing. A good agency will sit with you, explain the rituals of Umrah step by step, and remain reachable on WhatsApp throughout your trip. That ongoing support is the real difference between agencies, and it is exactly what we built Al Raqeem Travel & Tours around.",
    ],
  },
  {
    slug: "dubai-visit-visa-requirements-pakistan",
    title: "Dubai Visit Visa for Pakistanis: Requirements and Process",
    excerpt:
      "Current requirements, documents and processing times for a UAE visit visa from Pakistan, explained without the confusion.",
    date: "2026-03-18",
    readMinutes: 6,
    body: [
      "The UAE visit visa remains one of the most requested travel documents at our office, and also one of the most misunderstood. Here is the process explained clearly.",
      "Pakistani citizens require a pre-arranged visit visa for the UAE. The common options are the 30-day and 60-day single entry visas, with multiple entry versions available at higher fees. Tourist visas are sponsored either by airlines, hotels or licensed travel agencies in the UAE.",
      "The core documents are simple: a passport valid for at least six months, a clear passport-size photograph with white background, and a confirmed return ticket. Depending on the sponsor, bank statements or hotel bookings may also be requested.",
      "Processing typically takes three to five working days when documents are clean. Applications can be delayed or rejected for blurry scans, name mismatches between documents, or previous UAE visa violations. This is why submitting through an experienced agency matters: we check every document before filing.",
      "A common question is whether a visit visa can be converted to a work visa inside the UAE. Rules on this change frequently, so treat any guarantee you hear with caution and verify the current policy before traveling with that intention.",
      "Our Dubai packages include the visa, or we can process the visa alone if you are arranging your own stay. Either way, send us a WhatsApp message with your passport scan and travel dates, and we will confirm the current requirements and exact pricing the same day.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
