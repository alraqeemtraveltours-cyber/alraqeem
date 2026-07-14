export type TripType = "One-way" | "Return";

export type Ticket = {
  slug: string;
  airline: string;
  sector: string; // e.g. "Islamabad → Jeddah"
  category: string; // dynamic ticket category
  tripType: TripType;
  fare: number | null; // PKR; null = "Call for fare"
  baggage: string; // e.g. "40 kg"
  description: string;
  image?: string;
  featured?: boolean;
  expiryDate?: string | null; // fare validity (ISO yyyy-mm-dd)
};

export const tripTypes: TripType[] = ["One-way", "Return"];

export function formatFare(fare: number | null) {
  if (fare === null) return "Call for fare";
  return `PKR ${fare.toLocaleString("en-PK")}`;
}

// Fallback flight deals used when Supabase is not configured.
export const seedTickets: Ticket[] = [
  {
    slug: "isb-jed-umrah-return",
    airline: "Saudia",
    sector: "Islamabad → Jeddah",
    category: "Umrah & Hajj Flights",
    tripType: "Return",
    fare: 165000,
    baggage: "40 kg",
    description:
      "Direct return fares to Jeddah for Umrah travellers from Islamabad. Limited seats at this rate.",
    featured: true,
    expiryDate: null,
  },
  {
    slug: "pew-jed-umrah-return",
    airline: "Airblue",
    sector: "Peshawar → Jeddah",
    category: "Umrah & Hajj Flights",
    tripType: "Return",
    fare: 158000,
    baggage: "30 kg",
    description:
      "Convenient return fares from Peshawar to Jeddah, ideal for Umrah groups from KP.",
    featured: true,
    expiryDate: null,
  },
  {
    slug: "isb-dxb-return",
    airline: "Emirates",
    sector: "Islamabad → Dubai",
    category: "International Flights",
    tripType: "Return",
    fare: 135000,
    baggage: "30 kg",
    description:
      "Return tickets to Dubai with checked baggage. Great for tourism and visit-visa travellers.",
    featured: true,
    expiryDate: null,
  },
  {
    slug: "lhe-ist-return",
    airline: "Turkish Airlines",
    sector: "Lahore → Istanbul",
    category: "International Flights",
    tripType: "Return",
    fare: 215000,
    baggage: "30 kg",
    description:
      "Return fares to Istanbul on Turkish Airlines. Connect onward across Europe at competitive rates. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "khi-jed-umrah-return",
    airline: "PIA",
    sector: "Karachi → Jeddah",
    category: "Umrah & Hajj Flights",
    tripType: "Return",
    fare: 148000,
    baggage: "40 kg",
    description:
      "Direct return fares from Karachi to Jeddah for Umrah travellers. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "lhe-med-umrah-return",
    airline: "Saudia",
    sector: "Lahore → Madinah",
    category: "Umrah & Hajj Flights",
    tripType: "Return",
    fare: 172000,
    baggage: "40 kg",
    description:
      "Land in Madinah and begin your Umrah from Masjid an-Nabawi. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "isb-med-umrah-return",
    airline: "Serene Air",
    sector: "Islamabad → Madinah",
    category: "Umrah & Hajj Flights",
    tripType: "Return",
    fare: 168000,
    baggage: "35 kg",
    description:
      "Return fares from Islamabad to Madinah, ideal for pilgrims starting the journey in the Prophet's city. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "khi-dxb-return",
    airline: "flydubai",
    sector: "Karachi → Dubai",
    category: "Gulf & Middle East Flights",
    tripType: "Return",
    fare: 98000,
    baggage: "30 kg",
    description:
      "Budget-friendly return fares from Karachi to Dubai for visit and work travellers. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "isb-shj-return",
    airline: "Air Arabia",
    sector: "Islamabad → Sharjah",
    category: "Gulf & Middle East Flights",
    tripType: "Return",
    fare: 92000,
    baggage: "30 kg",
    description:
      "Low-cost return fares to Sharjah, minutes from Dubai by road. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "isb-doh-return",
    airline: "Qatar Airways",
    sector: "Islamabad → Doha",
    category: "Gulf & Middle East Flights",
    tripType: "Return",
    fare: 125000,
    baggage: "30 kg",
    description:
      "Return fares to Doha with onward connections worldwide. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "khi-mct-return",
    airline: "Oman Air",
    sector: "Karachi → Muscat",
    category: "Gulf & Middle East Flights",
    tripType: "Return",
    fare: 78000,
    baggage: "30 kg",
    description:
      "Short-hop return fares from Karachi to Muscat. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "lhe-kwi-return",
    airline: "Jazeera Airways",
    sector: "Lahore → Kuwait",
    category: "Gulf & Middle East Flights",
    tripType: "Return",
    fare: 105000,
    baggage: "30 kg",
    description:
      "Return fares from Lahore to Kuwait City for family visits and workers. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "isb-bah-return",
    airline: "Gulf Air",
    sector: "Islamabad → Bahrain",
    category: "Gulf & Middle East Flights",
    tripType: "Return",
    fare: 112000,
    baggage: "30 kg",
    description:
      "Return fares from Islamabad to Bahrain. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "isb-bak-return",
    airline: "Azerbaijan Airlines",
    sector: "Islamabad → Baku",
    category: "International Flights",
    tripType: "Return",
    fare: 138000,
    baggage: "30 kg",
    description:
      "Return fares to Baku for the Flame Towers, Old City, and Caspian coast. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "lhe-kul-return",
    airline: "Malaysia Airlines",
    sector: "Lahore → Kuala Lumpur",
    category: "International Flights",
    tripType: "Return",
    fare: 168000,
    baggage: "30 kg",
    description:
      "Return fares to Kuala Lumpur, the gateway to Malaysia and onward to Thailand. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "isb-bkk-return",
    airline: "Thai Airways",
    sector: "Islamabad → Bangkok",
    category: "International Flights",
    tripType: "Return",
    fare: 175000,
    baggage: "30 kg",
    description:
      "Return fares to Bangkok for Thailand's cities and islands. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
  {
    slug: "isb-lhr-return",
    airline: "PIA",
    sector: "Islamabad → London",
    category: "International Flights",
    tripType: "Return",
    fare: 265000,
    baggage: "30 kg",
    description:
      "Direct return fares from Islamabad to London Heathrow. Fares may change with availability, confirm on WhatsApp.",
    expiryDate: null,
  },
];
