// Categories are now managed dynamically (see lib/categories.ts).
// Kept as a string for flexibility; `categories` below is a fallback list.
export type Category = string;

export type TravelPackage = {
  slug: string;
  title: string;
  category: Category;
  duration: string;
  // null means the item is quoted on inquiry, no stored price
  price: number | null;
  featured?: boolean;
  highlights: string[];
  description: string;
  // optional override image URL (used for admin-added packages)
  image?: string;
  // optional offer expiry date (ISO yyyy-mm-dd); null = no expiry
  expiryDate?: string | null;
};

// Seed data, used as a fallback when Supabase is not configured,
// and to seed the database (see supabase/schema.sql).
export const seedPackages: TravelPackage[] = [
  {
    slug: "economy-umrah-15-days",
    title: "Economy Umrah Package",
    category: "Umrah & Hajj",
    duration: "15 Days",
    price: 365000,
    featured: true,
    highlights: [
      "Return airfare from Peshawar or Islamabad",
      "Hotels within walking distance of Haram",
      "Saudi e-visa processing included",
      "Makkah and Madinah Ziyarat tours",
      "Ground transport between cities",
    ],
    description:
      "Our most popular package for first-time pilgrims. Comfortable hotels at honest prices, with our team handling visa, flights and transport so you focus on your worship.",
  },
  {
    slug: "premium-umrah-21-days",
    title: "Premium Umrah Package",
    category: "Umrah & Hajj",
    duration: "21 Days",
    price: 695000,
    featured: true,
    highlights: [
      "5-star hotels facing Haram in Makkah and Madinah",
      "Direct flights with checked baggage",
      "Private transport with personal guide",
      "Daily breakfast and dinner buffet",
      "Saudi Umrah e-visa processed through Nusuk",
    ],
    description:
      "For those who want complete comfort. Stay in 5-star properties steps from the Haram, travel in private vehicles, and let a dedicated guide handle every detail of your journey.",
  },
  {
    slug: "ramadan-umrah-special",
    title: "Ramadan Umrah Special",
    category: "Umrah & Hajj",
    duration: "10 to 30 Days",
    price: null,
    highlights: [
      "Last Ashra packages available",
      "Hotels booked months in advance",
      "Itikaf arrangements on request",
      "Flexible durations for Ramadan",
    ],
    description:
      "Spend the most blessed nights of the year in Makkah and Madinah. Ramadan demand is extremely high, so seats and rooms are limited. Contact us early to lock your dates.",
  },
  {
    slug: "hajj-package",
    title: "Hajj Package",
    category: "Umrah & Hajj",
    duration: "Complete Hajj Program",
    price: null,
    highlights: [
      "Government Hajj scheme registration through MORA",
      "Mina and Arafat camp services",
      "Trained group leaders and scholars",
      "Pre-departure Hajj training sessions",
    ],
    description:
      "A complete, guided Hajj program with experienced group leaders who have performed Hajj many times. Quotas are limited every year, so early registration is essential.",
  },
  {
    slug: "dubai-5-days",
    title: "Dubai City Tour",
    category: "International",
    duration: "5 Days, 4 Nights",
    price: 285000,
    featured: true,
    highlights: [
      "Return airfare and UAE visit visa",
      "4-star hotel with breakfast",
      "Desert safari with BBQ dinner",
      "Burj Khalifa and Dubai Mall visit",
      "Marina dhow cruise included",
    ],
    description:
      "The complete Dubai experience for couples and families. Visa, flights, hotel and the must-do attractions packed into five comfortable days.",
  },
  {
    slug: "turkey-7-days",
    title: "Turkey Tour: Istanbul & Cappadocia",
    category: "International",
    duration: "7 Days, 6 Nights",
    price: 425000,
    featured: true,
    highlights: [
      "Return airfare and Turkey e-visa support",
      "Istanbul old city guided tours",
      "Cappadocia with optional balloon ride",
      "Bosphorus cruise included",
      "Halal meals throughout",
    ],
    description:
      "Walk through Ottoman history in Istanbul, then watch hot air balloons rise over Cappadocia. One of our most loved packages for honeymoons and families alike.",
  },
  {
    slug: "baku-5-days",
    title: "Baku, Azerbaijan",
    category: "International",
    duration: "5 Days, 4 Nights",
    price: 245000,
    highlights: [
      "Return airfare and e-visa included",
      "City center hotel with breakfast",
      "Old City and Flame Towers tour",
      "Gabala day trip with cable car",
    ],
    description:
      "Europe's vibe at Asia's distance. Baku offers walkable streets, mountain day trips and easy visas, making it perfect for a short international getaway.",
  },
  {
    slug: "malaysia-thailand-8-days",
    title: "Malaysia & Thailand Combo",
    category: "International",
    duration: "8 Days, 7 Nights",
    price: null,
    highlights: [
      "Kuala Lumpur and Bangkok in one trip",
      "Genting Highlands day tour",
      "Phuket beach extension available",
      "Visa processing for both countries",
    ],
    description:
      "Two countries, one booking. City lights in Kuala Lumpur and beaches in Thailand. Prices vary by season, so contact us for a quote on your dates.",
  },
  {
    slug: "malaysia",
    title: "Malaysia Tour",
    category: "International",
    duration: "6 Days, 5 Nights",
    price: null,
    highlights: [
      "Return airfare and Malaysia e-visa",
      "City hotel with breakfast",
      "Kuala Lumpur city tour and Batu Caves",
      "Genting Highlands day with cable car",
      "Halal food in a Muslim majority country",
      "English speaking guide and transfers",
    ],
    description:
      "A halal friendly first trip abroad. Kuala Lumpur, Genting Highlands, and Putrajaya in a Muslim majority country, with Langkawi as an optional island add on. Quoted on inquiry for your dates.",
  },
  {
    slug: "thailand",
    title: "Thailand Tour",
    category: "International",
    duration: "6 Days, 5 Nights",
    price: null,
    highlights: [
      "Return airfare and Thailand visa",
      "City hotel with breakfast",
      "Bangkok temples and Grand Palace tour",
      "Pattaya and a Coral Island day",
      "Halal food in Bangkok",
      "English speaking guide and transfers",
    ],
    description:
      "Temples and beaches in one trip. Bangkok, the Grand Palace, and the riverside temples with Pattaya and Coral Island, and an optional Phuket leg. Quoted on inquiry for your dates.",
  },
  {
    slug: "singapore",
    title: "Singapore Tour",
    category: "International",
    duration: "5 Days, 4 Nights",
    price: null,
    highlights: [
      "Return airfare and Singapore visa",
      "City hotel with breakfast",
      "City tour, the Merlion and Gardens by the Bay",
      "A full Sentosa day",
      "The Night Safari",
      "English speaking guide and transfers",
    ],
    description:
      "A compact, easy city trip. The Merlion, Gardens by the Bay, a full Sentosa day with Universal Studios, and the Night Safari. Quoted on inquiry for your dates.",
  },
  {
    slug: "malaysia-thailand-singapore",
    title: "Malaysia Thailand Singapore Combo",
    category: "International",
    duration: "9 Days, 8 Nights",
    price: null,
    highlights: [
      "Three countries in one booking",
      "Return airfare and two inter-country flights",
      "All three visas processed",
      "Bangkok, Pattaya, Kuala Lumpur, Genting, and Singapore",
      "Sentosa and the Night Safari",
      "English speaking guides and transfers",
    ],
    description:
      "The full Southeast Asia trio. Bangkok and Pattaya, Kuala Lumpur and Genting, and Singapore with Sentosa and the Night Safari, with all flights and visas handled. Quoted on inquiry for your dates.",
  },
];

export function formatPrice(price: number | null) {
  if (price === null) return "Price on inquiry";
  return `PKR ${price.toLocaleString("en-PK")}`;
}

export const categories: Category[] = ["Umrah & Hajj", "International"];

// Canonical, keyword-aligned display name for a package. The slug stays fixed
// for URL stability; the visible name targets the query.
export function packageDisplayName(
  pkg: Pick<TravelPackage, "slug" | "title">
): string {
  if (pkg.slug === "ramadan-umrah-special") return "Ramadan Umrah Package";
  if (pkg.slug === "dubai-5-days") return "Dubai Tour Package";
  if (pkg.slug === "turkey-7-days") return "Turkey Tour Package";
  if (pkg.slug === "baku-5-days") return "Baku Tour Packages";
  if (pkg.slug === "malaysia") return "Malaysia Tour Packages";
  if (pkg.slug === "thailand") return "Thailand Tour Packages";
  if (pkg.slug === "singapore") return "Singapore Tour Packages";
  if (pkg.slug === "malaysia-thailand-8-days")
    return "Malaysia and Thailand Tour Package";
  if (pkg.slug === "malaysia-thailand-singapore")
    return "Malaysia Thailand Singapore Tour Packages";
  return pkg.title;
}

// Folder based topical silos. Each package slug maps to exactly one silo URL.
// The old /packages/[slug] URLs 301 to these (see next.config.mjs). Admin added
// slugs not in the map fall back to /packages/[slug].
const SILO_ROUTES: Record<string, string> = {
  "economy-umrah-15-days": "/umrah/economy-15-days",
  "premium-umrah-21-days": "/umrah/premium-21-days",
  "ramadan-umrah-special": "/umrah/ramadan",
  "hajj-package": "/hajj",
  "dubai-5-days": "/tours/dubai",
  "turkey-7-days": "/tours/turkey",
  "baku-5-days": "/tours/baku",
  "malaysia-thailand-8-days": "/tours/malaysia-thailand",
  malaysia: "/tours/malaysia",
  thailand: "/tours/thailand",
  singapore: "/tours/singapore",
  "malaysia-thailand-singapore": "/tours/malaysia-thailand-singapore",
};

// Canonical URL path for a package by slug.
export function packageHrefBySlug(slug: string): string {
  return SILO_ROUTES[slug] ?? `/packages/${slug}`;
}

// Canonical URL path for a package.
export function packageHref(pkg: Pick<TravelPackage, "slug">): string {
  return packageHrefBySlug(pkg.slug);
}

// The silo a package belongs to, for breadcrumbs and hub links. Hajj is its own
// hub, so its trail stops at the Hajj page itself.
export function packageSilo(pkg: Pick<TravelPackage, "slug" | "category">): {
  hub: string;
  hubName: string;
} {
  if (pkg.slug === "hajj-package") return { hub: "/hajj", hubName: "Hajj" };
  if (pkg.category === "Umrah & Hajj")
    return { hub: "/umrah", hubName: "Umrah" };
  return { hub: "/tours", hubName: "Tours" };
}
