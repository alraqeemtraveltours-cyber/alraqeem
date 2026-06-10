// =====================================================================
// Curated, license-free imagery (Unsplash). Each ID below was verified
// to resolve and match its subject. Swap an ID here to change it sitewide.
// =====================================================================

const BASE = "https://images.unsplash.com/";

/** Build an optimized Unsplash URL. */
export function img(id: string, w = 1200, q = 70) {
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

// Named source photos
const SRC = {
  kaaba: "photo-1565552645632-d725f8bfc19a", // Masjid al-Haram, the Kaaba
  madinahDomes: "photo-1591604129939-f1efa4d9f7fa", // golden & green domes
  blueMosque: "photo-1519817650390-64a93db51149", // mosque domes at dusk
  quran: "photo-1542816417-0983c9c9ad53", // Quran, blue
  dubai: "photo-1512453979798-5ea266f8880c", // Dubai skyline, Burj Khalifa
  istanbul: "photo-1524231757912-21f4fe3a7200", // Istanbul, Galata
  europe: "photo-1539037116277-4db20889f2d4", // European rooftops aerial
  beach: "photo-1586500036706-41963de24d8b", // tropical beach
  mountainsSnow: "photo-1589182373726-e4f658ab50f0", // snowy peaks
  mountainsPanorama: "photo-1506905925346-21bda4d32df4", // snow panorama
  mountainHiker: "photo-1626621341517-bbf3d9990a23", // hiker on snow mountain
  trekkers: "photo-1539635278303-d4002c07eae3", // group of trekkers
  visa: "photo-1488646953014-85cb44e25828", // camera, map, travel planning
} as const;

export const images = {
  heroKaaba: img(SRC.kaaba, 2000, 72),
  kaaba: img(SRC.kaaba),
  madinah: img(SRC.madinahDomes),
  mosque: img(SRC.blueMosque),
  quran: img(SRC.quran),
  dubai: img(SRC.dubai),
  istanbul: img(SRC.istanbul),
  europe: img(SRC.europe),
  beach: img(SRC.beach),
  mountains: img(SRC.mountainsPanorama),
  northPakistan: img(SRC.mountainsSnow),
  visa: img(SRC.visa, 2000, 72),
};

// Per-package hero image (keyed by package slug).
export const packageImages: Record<string, string> = {
  "economy-umrah-15-days": img(SRC.blueMosque, 1000),
  "premium-umrah-21-days": img(SRC.madinahDomes, 1000),
  "ramadan-umrah-special": img(SRC.quran, 1000),
  "hajj-package": img(SRC.kaaba, 1000),
  "dubai-5-days": img(SRC.dubai, 1000),
  "turkey-7-days": img(SRC.istanbul, 1000),
  "baku-5-days": img(SRC.europe, 1000),
  "malaysia-thailand-8-days": img(SRC.beach, 1000),
};

// Category fallbacks for packages without a specific image (e.g. admin-added).
const categoryFallback: Record<string, string> = {
  "Umrah & Hajj": img(SRC.kaaba, 1000),
  International: img(SRC.dubai, 1000),
};

/**
 * Resolve a package's image. Priority:
 * explicit override -> per-slug map -> category fallback -> generic.
 */
export function packageImage(
  slug: string,
  category?: string,
  override?: string
) {
  if (override) return override;
  return (
    packageImages[slug] ??
    (category ? categoryFallback[category] : undefined) ??
    img(SRC.dubai, 1000)
  );
}
