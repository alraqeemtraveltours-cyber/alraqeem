import type { Metadata } from "next";
import {
  type TravelPackage,
  packageDisplayName,
  packageHref,
} from "@/lib/packages";

const TITLE_SUFFIX = " from Pakistan | Al Raqeem";

// Clean the stored name for use in the title tag and meta: ampersands become
// "and", colons drop, so no HTML entities leak into head tags.
function cleanName(title: string) {
  return title
    .replace(/&/g, "and")
    .replace(/:/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Build a title of "[Name] from Pakistan | Al Raqeem", trimmed to 58 by
// dropping trailing words at word boundaries. No dashes.
export function packageTitle(pkg: TravelPackage) {
  if (pkg.slug === "hajj-package") {
    return "Hajj Packages from Pakistan | Al Raqeem";
  }
  if (pkg.slug === "dubai-5-days") {
    return "Dubai Tour Packages from Pakistan | Al Raqeem";
  }
  if (pkg.slug === "turkey-7-days") {
    return "Turkey Tour Packages from Pakistan | Al Raqeem";
  }
  if (pkg.slug === "baku-5-days") {
    return "Baku Tour Package from Pakistan | Al Raqeem";
  }
  if (pkg.slug === "malaysia-thailand-8-days") {
    return "Malaysia and Thailand Tour from Pakistan | Al Raqeem";
  }
  if (pkg.slug === "malaysia") {
    return "Malaysia Tour Package from Pakistan | Al Raqeem";
  }
  const clean = cleanName(packageDisplayName(pkg));
  let words = clean.split(/\s+/);
  let name = clean;
  while ((name + TITLE_SUFFIX).length > 58 && words.length > 1) {
    words = words.slice(0, -1);
    name = words
      .join(" ")
      .replace(/[\s,]+(and|or|with|the|of|in)$/i, "")
      .trim();
  }
  return `${name}${TITLE_SUFFIX}`;
}

// Plain text meta, 156 or fewer, no HTML, no price.
export function packageMetaDescription(pkg: TravelPackage) {
  if (pkg.slug === "ramadan-umrah-special") {
    return "Ramadan Umrah Package from Pakistan. Last Ashra and Laylat al-Qadr stays, flexible durations, hotels booked early. Quoted on inquiry via WhatsApp.";
  }
  if (pkg.slug === "hajj-package") {
    return "Hajj Package from Pakistan. MORA scheme guidance and a private Hajj route through a Saudi approved operator, with scholar led training. Quoted on inquiry.";
  }
  if (pkg.slug === "economy-umrah-15-days") {
    return "Economy Umrah Package from Pakistan, 15 days. Hotels near the Haram, quad and triple sharing, visa and flights from Peshawar or Islamabad. Inquiry priced.";
  }
  if (pkg.slug === "premium-umrah-21-days") {
    return "Premium Umrah Package from Pakistan, 21 days. Five star hotels near the Haram, double and twin sharing, private transport, and daily meals. Inquiry priced.";
  }
  if (pkg.slug === "dubai-5-days") {
    return "Dubai Tour Package from Pakistan, 5 days. Burj Khalifa, Dubai Mall, desert safari, and a Marina dhow cruise, with UAE visa and flights. Inquiry priced.";
  }
  if (pkg.slug === "turkey-7-days") {
    return "Turkey Tour Package from Pakistan, 7 days. Istanbul, the Bosphorus, and Cappadocia with an optional hot air balloon, plus visa and flights. Inquiry priced.";
  }
  if (pkg.slug === "baku-5-days") {
    return "Baku Tour Package from Pakistan, 5 days. Old City and Flame Towers, the Ateshgah and Yanardag fire sites, Gobustan, and Gabala, plus visa and flights.";
  }
  if (pkg.slug === "malaysia-thailand-8-days") {
    return "Malaysia and Thailand Tour from Pakistan, 8 days. Kuala Lumpur, Genting Highlands, and Bangkok temples, with both e visas and flights. Inquiry priced.";
  }
  if (pkg.slug === "malaysia") {
    return "Malaysia Tour Package from Pakistan, 6 days. Kuala Lumpur, Batu Caves, Genting Highlands, and Putrajaya, a halal friendly Muslim country. Inquiry priced.";
  }
  const clean = cleanName(packageDisplayName(pkg));
  const base = `${clean} from Pakistan. Quoted on inquiry for your dates, with visa, flights and hotels handled. Message on WhatsApp for a quote.`;
  if (base.length <= 156) return base;
  return `${clean} from Pakistan. Quoted on inquiry for your dates. Visa, flights and hotels handled by our desk.`;
}

// Full metadata for a package detail page, canonical set to its silo URL.
export function packageMetadata(pkg: TravelPackage): Metadata {
  const meta: Metadata = {
    title: { absolute: packageTitle(pkg) },
    description: packageMetaDescription(pkg),
    alternates: { canonical: packageHref(pkg) },
    openGraph: { url: packageHref(pkg) },
  };
  if (pkg.slug === "dubai-5-days") {
    meta.keywords = [
      "Dubai tour package from Pakistan",
      "Dubai holiday package",
      "Dubai city tour from Pakistan",
      "5 day Dubai package",
      "Dubai family tour",
      "desert safari",
      "UAE visit visa",
      "Dubai package from Karachi",
      "Dubai package from Lahore",
      "Dubai package from Islamabad",
    ];
  }
  if (pkg.slug === "turkey-7-days") {
    meta.keywords = [
      "Turkey tour package from Pakistan",
      "Istanbul and Cappadocia tour",
      "Turkey holiday package",
      "Turkey honeymoon package",
      "Cappadocia hot air balloon",
      "Turkey e visa",
      "Turkey tour from Karachi",
      "Turkey tour from Lahore",
      "Turkey tour from Islamabad",
    ];
  }
  if (pkg.slug === "baku-5-days") {
    meta.keywords = [
      "Baku tour package from Pakistan",
      "Azerbaijan tour packages from Pakistan",
      "Baku Azerbaijan tour",
      "5 day Baku package",
      "Baku honeymoon package",
      "land of fire tour",
      "Baku tour from Karachi",
      "Baku tour from Lahore",
      "Baku tour from Islamabad",
    ];
  }
  if (pkg.slug === "malaysia-thailand-8-days") {
    meta.keywords = [
      "Malaysia and Thailand tour package from Pakistan",
      "Malaysia Thailand combo tour",
      "Kuala Lumpur and Bangkok tour",
      "Far East tour from Pakistan",
      "8 day Malaysia Thailand package",
      "Malaysia Thailand honeymoon package",
      "Malaysia Thailand tour from Karachi",
      "Malaysia Thailand tour from Lahore",
      "Malaysia Thailand tour from Islamabad",
    ];
  }
  if (pkg.slug === "malaysia") {
    meta.keywords = [
      "Malaysia tour package from Pakistan",
      "Malaysia tour packages",
      "Kuala Lumpur tour from Pakistan",
      "Malaysia holiday package",
      "Malaysia family package",
      "Malaysia honeymoon package",
      "Malaysia tour from Karachi",
      "Malaysia tour from Lahore",
      "Malaysia tour from Islamabad",
    ];
  }
  return meta;
}
