// Transport & visa pricing engine configuration.
//
// Everything the Umrah package calculator needs to price visas and ground
// transport lives in this one config object: the sharing-bus visa tiers, the
// private-transport flat visas, the vehicle fleet with seat limits, the
// directional sector price grid, and the extra fees from the supplier sheet.
//
// The seed values below mirror the SEI Season 1448H rate sheet (effective
// 16 July 2026). They are SUPPLIER COST references — the admin overwrites
// them with Al Raqeem's own selling prices in /admin/transport. A sector
// price left empty means "quoted at inquiry": the calculator shows the leg
// but excludes it from the estimate.

/** Fixed places a transport sector can run between. */
export const transportLocations = [
  { key: "jeddah-airport", label: "Jeddah Airport" },
  { key: "madinah-airport", label: "Madinah Airport" },
  { key: "makkah-hotel", label: "Makkah Hotel" },
  { key: "madinah-hotel", label: "Madinah Hotel" },
  { key: "makkah-ziyarat", label: "Makkah Ziyarat" },
  { key: "madinah-ziyarat", label: "Madinah Ziyarat" },
  { key: "train-station", label: "Train Station" },
] as const;

export type TransportLocation = (typeof transportLocations)[number]["key"];

export const transportLocationLabels: Record<TransportLocation, string> =
  Object.fromEntries(
    transportLocations.map((l) => [l.key, l.label])
  ) as Record<TransportLocation, string>;

/** Sharing-bus visa price band, tiered by group size. */
export type VisaTier = {
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
};

export type TransportVehicle = {
  id: string;
  name: string;
  /** Maximum travelers (adults; lap infants don't take a seat). */
  seats: number;
  active: boolean;
};

export const sectorKinds = ["airport", "intercity", "ziyarat", "other"] as const;
export type SectorKind = (typeof sectorKinds)[number];

export type TransportSector = {
  id: string;
  from: TransportLocation;
  to: TransportLocation;
  /** Optional variant note, e.g. "via Badr". */
  via: string;
  kind: SectorKind;
  /** Price per vehicle id. null/missing = quoted at inquiry. */
  prices: Record<string, number | null>;
  active: boolean;
  sortOrder: number;
};

export type TransportFees = {
  /** Visa for an infant, per infant. */
  infantVisa: number;
  /** Flat visa per person when ALL legs use private transport. */
  fullPrivateVisa: number;
  /** Flat visa per person when only some legs are private. */
  partialPrivateVisa: number;
  /** One-time fee per person when the customer arranges their own hotel. */
  selfHotelFee: number;
  /** Per person per night when Nusuk is not provided with a self hotel. */
  nusukPerPersonNight: number;
  /** Extra visa fee per person once the stay passes `longStayAfterDays`. */
  longStayFee: number;
  longStayAfterDays: number;
  longStayMaxDays: number;
  /** Shared SEI bus, per person per inter-city sector (partial private). */
  busPerPersonSector: number;
  /** Shown as notes only — not part of the estimate. */
  visaCancellation: number;
  nonTravelling: number;
};

export type TransportConfig = {
  visaTiers: VisaTier[];
  vehicles: TransportVehicle[];
  sectors: TransportSector[];
  fees: TransportFees;
};

// ---------------------------------------------------------------------------
// Routes: how the four journey combinations translate into hotel stays and
// transport legs. Derived data, not admin-editable — the prices are.
// ---------------------------------------------------------------------------

export type StayCity = "Makkah" | "Madina";

export type RouteLeg = { from: TransportLocation; to: TransportLocation };

export type RouteOption = {
  id: string;
  label: string;
  /** Short itinerary line, e.g. "Jeddah → Makkah → Madina → home". */
  summary: string;
  /** Hotel stays in journey order. Repeated city = a second stay. */
  stays: StayCity[];
  legs: RouteLeg[];
};

export const routeOptions: RouteOption[] = [
  {
    id: "single-makkah-first",
    label: "Makkah → Madina (single route)",
    summary: "Land in Jeddah, Makkah first, fly home from Madinah",
    stays: ["Makkah", "Madina"],
    legs: [
      { from: "jeddah-airport", to: "makkah-hotel" },
      { from: "makkah-hotel", to: "madinah-hotel" },
      { from: "madinah-hotel", to: "madinah-airport" },
    ],
  },
  {
    id: "single-madina-first",
    label: "Madina → Makkah (single route)",
    summary: "Land in Madinah, Madina first, fly home from Jeddah",
    stays: ["Madina", "Makkah"],
    legs: [
      { from: "madinah-airport", to: "madinah-hotel" },
      { from: "madinah-hotel", to: "makkah-hotel" },
      { from: "makkah-hotel", to: "jeddah-airport" },
    ],
  },
  {
    id: "multiple-makkah",
    label: "Makkah → Madina → Makkah (multiple route)",
    summary: "Land in Jeddah, Makkah, Madina, back to Makkah, fly home from Jeddah",
    stays: ["Makkah", "Madina", "Makkah"],
    legs: [
      { from: "jeddah-airport", to: "makkah-hotel" },
      { from: "makkah-hotel", to: "madinah-hotel" },
      { from: "madinah-hotel", to: "makkah-hotel" },
      { from: "makkah-hotel", to: "jeddah-airport" },
    ],
  },
  {
    id: "multiple-madina",
    label: "Madina → Makkah → Madina (multiple route)",
    summary: "Land in Madinah, Madina, Makkah, back to Madina, fly home from Madinah",
    stays: ["Madina", "Makkah", "Madina"],
    legs: [
      { from: "madinah-airport", to: "madinah-hotel" },
      { from: "madinah-hotel", to: "makkah-hotel" },
      { from: "makkah-hotel", to: "madinah-hotel" },
      { from: "madinah-hotel", to: "madinah-airport" },
    ],
  },
];

export const transportStyles = ["sharing", "full-private", "partial-private"] as const;
export type TransportStyle = (typeof transportStyles)[number];

export const transportStyleLabels: Record<TransportStyle, string> = {
  sharing: "Sharing bus",
  "full-private": "Full private transport",
  "partial-private": "Partial private transport",
};

/** Visa price per adult for a sharing-bus group of `pax`, or null if no tier. */
export function sharingVisaPrice(
  tiers: VisaTier[],
  pax: number
): number | null {
  const tier = tiers.find((t) => pax >= t.minPax && pax <= t.maxPax);
  return tier ? tier.pricePerPerson : null;
}

/** Active sectors matching a leg (direct first, then variants like via Badr). */
export function sectorsForLeg(
  sectors: TransportSector[],
  leg: RouteLeg
): TransportSector[] {
  return sectors
    .filter((s) => s.active && s.from === leg.from && s.to === leg.to)
    .sort((a, b) => (a.via ? 1 : 0) - (b.via ? 1 : 0) || a.sortOrder - b.sortOrder);
}

export function sectorLabel(sector: TransportSector): string {
  const base = `${transportLocationLabels[sector.from]} → ${transportLocationLabels[sector.to]}`;
  return sector.via ? `${base} (${sector.via})` : base;
}

// ---------------------------------------------------------------------------
// Seed config — SEI Season 1448H sheet values as the starting reference.
// ---------------------------------------------------------------------------

const seedVehicles: TransportVehicle[] = [
  { id: "car", name: "Car", seats: 3, active: true },
  { id: "staria", name: "Staria", seats: 7, active: true },
  { id: "gmc", name: "GMC", seats: 7, active: true },
  { id: "hiace", name: "Hi-Ace", seats: 10, active: true },
  { id: "coaster", name: "Coaster", seats: 19, active: true },
  { id: "bus", name: "Bus", seats: 49, active: true },
];

function prices(
  car: number | null,
  staria: number | null,
  gmc: number | null,
  hiace: number | null,
  coaster: number | null
): Record<string, number | null> {
  return { car, staria, gmc, hiace, coaster, bus: null };
}

const seedSectors: TransportSector[] = [
  { id: "jed-mak", from: "jeddah-airport", to: "makkah-hotel", via: "", kind: "airport", prices: prices(250, 270, 370, 320, 520), active: true, sortOrder: 1 },
  { id: "mak-jed", from: "makkah-hotel", to: "jeddah-airport", via: "", kind: "airport", prices: prices(220, 220, 320, 295, 420), active: true, sortOrder: 2 },
  { id: "medapt-med", from: "madinah-airport", to: "madinah-hotel", via: "", kind: "airport", prices: prices(150, 185, 270, 270, 370), active: true, sortOrder: 3 },
  { id: "med-medapt", from: "madinah-hotel", to: "madinah-airport", via: "", kind: "airport", prices: prices(120, 140, 170, 270, 320), active: true, sortOrder: 4 },
  // Makkah → Madina is not on the SEI sheet; prices stay empty ("at inquiry")
  // until the admin fills in Al Raqeem's own rate.
  { id: "mak-med", from: "makkah-hotel", to: "madinah-hotel", via: "", kind: "intercity", prices: prices(null, null, null, null, null), active: true, sortOrder: 5 },
  { id: "med-mak", from: "madinah-hotel", to: "makkah-hotel", via: "", kind: "intercity", prices: prices(370, 420, 720, 520, 820), active: true, sortOrder: 6 },
  { id: "med-mak-badr", from: "madinah-hotel", to: "makkah-hotel", via: "via Badr", kind: "intercity", prices: prices(470, 520, 820, 670, 970), active: true, sortOrder: 7 },
  { id: "med-jed", from: "madinah-hotel", to: "jeddah-airport", via: "", kind: "airport", prices: prices(370, 420, 720, 520, 820), active: true, sortOrder: 8 },
  { id: "jed-med", from: "jeddah-airport", to: "madinah-hotel", via: "", kind: "airport", prices: prices(420, 470, 820, 620, 970), active: true, sortOrder: 9 },
  { id: "med-ziyarat", from: "madinah-hotel", to: "madinah-ziyarat", via: "", kind: "ziyarat", prices: prices(170, 220, 270, 320, 370), active: true, sortOrder: 10 },
  { id: "mak-ziyarat", from: "makkah-hotel", to: "makkah-ziyarat", via: "", kind: "ziyarat", prices: prices(170, 220, 270, 320, 370), active: true, sortOrder: 11 },
  { id: "train-hotel", from: "train-station", to: "makkah-hotel", via: "Makkah & Madinah", kind: "other", prices: prices(120, 145, 220, 220, 320), active: true, sortOrder: 12 },
];

export const defaultTransportConfig: TransportConfig = {
  visaTiers: [
    { minPax: 1, maxPax: 1, pricePerPerson: 725 },
    { minPax: 2, maxPax: 2, pricePerPerson: 700 },
    { minPax: 3, maxPax: 3, pricePerPerson: 675 },
    { minPax: 4, maxPax: 4, pricePerPerson: 650 },
    { minPax: 5, maxPax: 49, pricePerPerson: 600 },
  ],
  vehicles: seedVehicles,
  sectors: seedSectors,
  fees: {
    infantVisa: 460,
    fullPrivateVisa: 550,
    partialPrivateVisa: 600,
    selfHotelFee: 25,
    nusukPerPersonNight: 4,
    longStayFee: 200,
    longStayAfterDays: 35,
    longStayMaxDays: 85,
    busPerPersonSector: 25,
    visaCancellation: 200,
    nonTravelling: 600,
  },
};
