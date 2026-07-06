// Single source of truth for the Search and Inquiry widget. Every option list,
// tiers, durations, destinations, countries, cabin classes, airlines, and the
// per vertical field definitions live here, so adding an option happens in one
// place. Only verticals Al Raqeem actually offers are listed. Inquiry model, no
// prices anywhere in this config.

export type WidgetFieldType = "select" | "text" | "date" | "toggle";

export type WidgetField = {
  key: string;
  label: string;
  type: WidgetFieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  // A core criterion for the vertical, enforced before the lead modal opens.
  core?: boolean;
  // Narrow field, three across on a row, for adults, children, infants.
  narrow?: boolean;
  showIf?: (c: Record<string, string>) => boolean;
};

export type WidgetVertical = {
  id: string;
  label: string;
  icon: string;
  fields: WidgetField[];
};

// Shared option lists.
export const PASSENGERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10 plus"];
export const CHILD_COUNT = ["0", "1", "2", "3", "4", "5", "6"];
export const FROM_CITIES = ["Peshawar", "Islamabad"];
export const CABIN_CLASSES = ["Economy", "Business", "First"];
export const VISA_COUNTRIES = [
  "UAE",
  "Saudi Arabia",
  "Turkey",
  "Malaysia",
  "Thailand",
  "Azerbaijan",
  "Schengen",
  "United Kingdom",
];
// Real partner and served airlines named across the repo.
export const AIRLINES = [
  "Any airline",
  "PIA",
  "AirSial",
  "Airblue",
  "Qatar Airways",
  "Etihad Airways",
  "Saudia",
  "Emirates",
  "Turkish Airlines",
  "flydubai",
];

// Country dial codes for the lead number, Pakistan default plus served markets.
export const DIAL_CODES = [
  { code: "+92", label: "PK +92" },
  { code: "+966", label: "SA +966" },
  { code: "+971", label: "AE +971" },
  { code: "+44", label: "UK +44" },
  { code: "+90", label: "TR +90" },
  { code: "+60", label: "MY +60" },
  { code: "+66", label: "TH +66" },
  { code: "+994", label: "AZ +994" },
  { code: "+1", label: "US +1" },
];

export const VERTICALS: WidgetVertical[] = [
  {
    id: "umrah",
    label: "Umrah",
    icon: "moon",
    fields: [
      {
        key: "duration",
        label: "Duration",
        type: "select",
        options: ["7 days", "10 days", "14 days", "15 days", "21 days", "28 days"],
        placeholder: "Select duration",
        required: true,
        core: true,
      },
      {
        key: "packageType",
        label: "Package type",
        type: "select",
        options: ["Economy", "Premium", "5 Star", "Ramadan", "Umrah plus Tour combo"],
        placeholder: "Select package",
        required: true,
        core: true,
      },
      { key: "passengers", label: "Passengers", type: "select", options: PASSENGERS, placeholder: "How many" },
      { key: "from", label: "Departing from", type: "select", options: FROM_CITIES, placeholder: "Select city" },
    ],
  },
  {
    id: "hajj",
    label: "Hajj",
    icon: "person",
    fields: [
      {
        key: "scheme",
        label: "Scheme",
        type: "select",
        options: ["Private Hajj", "Government scheme via MORA"],
        placeholder: "Select scheme",
        required: true,
        core: true,
      },
      { key: "passengers", label: "Passengers", type: "select", options: PASSENGERS, placeholder: "How many" },
      { key: "from", label: "Departing from", type: "select", options: FROM_CITIES, placeholder: "Select city" },
    ],
  },
  {
    id: "tours",
    label: "Tours",
    icon: "pin",
    fields: [
      {
        key: "destination",
        label: "Destination",
        type: "select",
        options: ["Dubai", "Turkey", "Baku", "Malaysia and Thailand", "Other"],
        placeholder: "Select destination",
        required: true,
        core: true,
      },
      {
        key: "destinationOther",
        label: "Your destination",
        type: "text",
        placeholder: "Type your destination",
        required: true,
        showIf: (c) => c.destination === "Other",
      },
      { key: "passengers", label: "Passengers", type: "select", options: PASSENGERS, placeholder: "How many" },
      {
        key: "when",
        label: "Departure date or month",
        type: "text",
        placeholder: "For example March 2027",
      },
      { key: "from", label: "Departing from", type: "select", options: FROM_CITIES, placeholder: "Select city" },
    ],
  },
  {
    id: "visa",
    label: "Visa",
    icon: "document",
    fields: [
      {
        key: "country",
        label: "Going to",
        type: "select",
        options: VISA_COUNTRIES,
        placeholder: "Select country",
        required: true,
        core: true,
      },
      {
        key: "visaType",
        label: "Visa type",
        type: "select",
        options: ["Visit", "Tourist"],
        placeholder: "Select type",
        required: true,
      },
    ],
  },
  {
    id: "flights",
    label: "Flights",
    icon: "plane",
    fields: [
      {
        key: "trip",
        label: "Trip",
        type: "select",
        options: ["Return", "One way"],
        placeholder: "Return or one way",
        required: true,
        core: true,
      },
      { key: "fromCity", label: "From", type: "text", placeholder: "Departure city", required: true, core: true },
      { key: "toCity", label: "To", type: "text", placeholder: "Destination city", required: true, core: true },
      { key: "depart", label: "Departure date", type: "date", required: true, core: true },
      {
        key: "returnDate",
        label: "Return date",
        type: "date",
        required: true,
        showIf: (c) => c.trip === "Return",
      },
      { key: "adults", label: "Adults", type: "select", options: PASSENGERS, placeholder: "Adults", required: true, narrow: true },
      { key: "children", label: "Children", type: "select", options: CHILD_COUNT, placeholder: "Children", narrow: true },
      { key: "infants", label: "Infants", type: "select", options: CHILD_COUNT, placeholder: "Infants", narrow: true },
      { key: "cabin", label: "Cabin class", type: "select", options: CABIN_CLASSES, placeholder: "Select cabin" },
      { key: "preferredAirline", label: "Preferred airline", type: "select", options: AIRLINES, placeholder: "Any airline" },
      { key: "directOnly", label: "Direct flights only", type: "toggle" },
      { key: "withLuggage", label: "With checked luggage", type: "toggle" },
    ],
  },
];

export function verticalById(id: string): WidgetVertical {
  return VERTICALS.find((v) => v.id === id) ?? VERTICALS[0];
}

// Resolve the mode, active vertical, and any context prefill from the route.
// A non-null result means single mode, the homepage and unknown paths return
// null, which the widget reads as full mode with empty fields.
export function widgetContext(
  pathname: string
): { vertical: string; values: Record<string, string> } | null {
  const p = (pathname || "/").toLowerCase();
  if (p.startsWith("/umrah/economy"))
    return { vertical: "umrah", values: { packageType: "Economy", duration: "15 days" } };
  if (p.startsWith("/umrah/premium"))
    return { vertical: "umrah", values: { packageType: "Premium", duration: "21 days" } };
  if (p.startsWith("/umrah/ramadan"))
    return { vertical: "umrah", values: { packageType: "Ramadan" } };
  if (p.startsWith("/tours/dubai")) return { vertical: "tours", values: { destination: "Dubai" } };
  if (p.startsWith("/tours/turkey")) return { vertical: "tours", values: { destination: "Turkey" } };
  if (p.startsWith("/tours/baku")) return { vertical: "tours", values: { destination: "Baku" } };
  if (p.startsWith("/tours/malaysia"))
    return { vertical: "tours", values: { destination: "Malaysia and Thailand" } };
  // Silo hubs, vertical selected with empty fields.
  if (p.startsWith("/umrah")) return { vertical: "umrah", values: {} };
  if (p.startsWith("/hajj")) return { vertical: "hajj", values: {} };
  if (p.startsWith("/tours")) return { vertical: "tours", values: {} };
  if (p.startsWith("/visa")) return { vertical: "visa", values: {} };
  if (p.startsWith("/tickets") || p.startsWith("/flight"))
    return { vertical: "flights", values: {} };
  return null;
}
