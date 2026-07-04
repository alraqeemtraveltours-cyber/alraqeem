// Categories are now managed dynamically (see lib/categories.ts).
// Kept as a string for flexibility; `categories` below is a fallback list.
export type Category = string;

export type TravelPackage = {
  slug: string;
  title: string;
  category: Category;
  duration: string;
  // null means "Contact for price"
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
];

export function formatPrice(price: number | null) {
  if (price === null) return "Contact for price";
  return `PKR ${price.toLocaleString("en-PK")}`;
}

export const categories: Category[] = ["Umrah & Hajj", "International"];
