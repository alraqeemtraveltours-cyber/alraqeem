// =====================================================================
// Curated, license-free imagery, self-hosted in /public/photos/stock.
// Originally sourced from Unsplash, downloaded so nothing hotlinks a
// third-party CDN. Swap a file (same name) to change it sitewide.
// =====================================================================

const STOCK = "/photos/stock";
const NORTH = "/photos/northern";

// Named source photos
const SRC = {
  kaaba: `${STOCK}/kaaba.jpg`, // Masjid al-Haram, the Kaaba
  madinahDomes: `${STOCK}/madinah-domes.jpg`, // golden & green domes
  blueMosque: `${STOCK}/blue-mosque.jpg`, // mosque domes at dusk
  quran: `${STOCK}/quran.jpg`, // Quran, blue
  dubai: `${STOCK}/dubai.jpg`, // Dubai skyline, Burj Khalifa
  istanbul: `${STOCK}/istanbul.jpg`, // Istanbul, Galata
  europe: `${STOCK}/europe.jpg`, // European rooftops aerial
  beach: `${STOCK}/beach.jpg`, // tropical beach
  mountainsSnow: `${STOCK}/mountains-snow.jpg`, // snowy peaks
  mountainsPanorama: `${STOCK}/mountains-panorama.jpg`, // snow panorama
  visa: `${STOCK}/visa.jpg`, // camera, map, travel planning
} as const;

export const images = {
  heroKaaba: SRC.kaaba,
  kaaba: SRC.kaaba,
  madinah: SRC.madinahDomes,
  mosque: SRC.blueMosque,
  quran: SRC.quran,
  dubai: SRC.dubai,
  istanbul: SRC.istanbul,
  europe: SRC.europe,
  beach: SRC.beach,
  mountains: SRC.mountainsPanorama,
  northPakistan: SRC.mountainsSnow,
  visa: SRC.visa,
};

// Real, on-brand photography overrides. Drop files in /public/photos and set
// the path here (e.g. "/photos/hero.jpg"), or paste a hosted URL. Any left
// blank fall back to the stock image, so the page never 404s. Use `photo()`
// to resolve an override with its fallback.
export const realPhotos = {
  hero: "",
  office: "",
  team: "",
  departure: "",
};

export function photo(override: string, fallback: string) {
  return override && override.trim() !== "" ? override : fallback;
}

// Per-package hero image (keyed by package slug).
export const packageImages: Record<string, string> = {
  "economy-umrah-15-days": SRC.blueMosque,
  "premium-umrah-21-days": SRC.madinahDomes,
  "economy-umrah-21-days": SRC.kaaba,
  "premium-umrah-15-days": SRC.madinahDomes,
  "five-star-umrah-30-days": SRC.quran,
  "ramadan-umrah-special": SRC.quran,
  "hajj-package": SRC.kaaba,
  "dubai-5-days": SRC.dubai,
  "turkey-7-days": SRC.istanbul,
  "baku-5-days": SRC.europe,
  "malaysia-thailand-8-days": SRC.beach,
  swat: `${NORTH}/swat.jpg`,
  "kumrat-valley": `${NORTH}/kumrat-valley.jpg`,
  "kalash-valley": `${NORTH}/kalash-valley.jpg`,
  chitral: `${NORTH}/chitral.jpg`,
  hunza: `${NORTH}/hunza.jpg`,
  skardu: `${NORTH}/skardu.jpg`,
  "naran-kaghan": `${NORTH}/naran-kaghan.jpg`,
};

// Category fallbacks for packages without a specific image (e.g. admin-added).
const categoryFallback: Record<string, string> = {
  "Umrah & Hajj": SRC.kaaba,
  International: SRC.dubai,
  Pakistan: SRC.mountainsPanorama,
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
    SRC.dubai
  );
}
