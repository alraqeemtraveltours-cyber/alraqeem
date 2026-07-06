export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  readMinutes: number;
  content: string; // rich HTML
  image?: string;
};

export const seedPosts: Post[] = [
  {
    slug: "first-time-umrah-guide-pakistan",
    title: "First-Time Umrah from Pakistan: A Complete Guide",
    excerpt:
      "Everything a first-time pilgrim from Pakistan needs to know, from documents and visa to what to pack and what to expect in Makkah.",
    date: "2026-05-12",
    readMinutes: 7,
    content:
      "<p>Performing Umrah for the first time is a moment most Pakistani families plan for years. The journey itself, however, is simpler than most people expect once the paperwork is in the right hands. The guide below walks you through the entire process.</p>" +
      "<p>Start with your passport, which must be valid for at least six months beyond your travel date, with at least two blank pages. If your passport is close to expiry, renew it before booking anything, since Saudi e-visa applications are tied to passport validity.</p>" +
      "<p>The Saudi Umrah e-visa is now processed electronically and usually takes a few working days when documents are complete. A registered travel agency files this for you, which removes the most common cause of rejections: small document errors.</p>" +
      "<p>Choose your package based on hotel distance from the Haram, not just the price. Packages that place you within walking distance almost always cost less overall and protect your energy for worship.</p>" +
      "<p>Finally, attend a pre-departure briefing. A good agency will explain the rituals of Umrah step by step and remain reachable on WhatsApp throughout your trip.</p>",
  },
  {
    slug: "dubai-visit-visa-requirements-pakistan",
    title: "Dubai Visit Visa for Pakistanis: Requirements and Process",
    excerpt:
      "Current requirements, documents and processing times for a UAE visit visa from Pakistan, explained without the confusion.",
    date: "2026-03-18",
    readMinutes: 6,
    content:
      "<p>The UAE visit visa remains one of the most requested travel documents at our office, and also one of the most misunderstood. Here is the process explained clearly.</p>" +
      "<p>Pakistani citizens require a pre-arranged visit visa for the UAE. The common options are the 30-day and 60-day single entry visas, with multiple entry versions available at higher fees.</p>" +
      "<p>The core documents are simple: a passport valid for at least six months, a clear passport-size photograph with white background, and a confirmed return ticket.</p>" +
      "<p>Processing typically takes three to five working days when documents are clean, which is why submitting through an experienced agency matters: we check every document before filing.</p>" +
      "<p>Our Dubai packages include the visa, or we process the visa on its own. Send us a WhatsApp message with your passport scan and travel dates and we will confirm requirements and pricing the same day.</p>",
  },
];
