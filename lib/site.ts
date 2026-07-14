// =====================================================================
// EDIT THIS FILE FIRST.
// Every placeholder for Al Raqeem Travel & Tours lives here.
// Change a value once and it updates across the entire website.
// =====================================================================

export const site = {
  name: "Al Raqeem Travel & Tours",
  shortName: "Al Raqeem",
  tagline: "Your trusted partner for Umrah, Hajj and worldwide travel",

  // Live domain. www.alraqeemtravels.com is retired. Do not reintroduce it.
  url: "https://alraqeem.com.pk",

  // Primary mobile + WhatsApp (WhatsApp in international format, no + or spaces).
  phone: "03125446922",
  whatsapp: "923125446922",

  // Secondary office / landline number.
  landline: "09165100133",

  email: "info@alraqeem.com.pk",

  // Head office address.
  address:
    "Office 1 and 2, 1st Floor, Aman Plaza, Mardan Road, Charsadda, Khyber Pakhtunkhwa, Pakistan",

  hours: "Monday to Saturday, 9:00 AM to 8:00 PM",

  // Sister company
  sisterCompany: "Al Nafi Travels",

  // Freshness signal. Bump this month and year whenever page content is
  // reviewed or updated, so every page shows an honest last updated date.
  lastUpdated: "July 2026",

  // Verifiable credentials. REAL values only. Any left blank are omitted from
  // the page and the schema, so nothing is ever fabricated.
  credentials: {
    // TODO: company / firm registration number (e.g. SECP or partnership registration).
    companyNumber: "",
    // TODO: MORA attested Umrah operator licence number.
    moraLicence: "",
    // TODO: IATA or DTS accreditation number.
    iata: "",
  },

  // Founder / lead consultant shown in the trust sections. The whole founder
  // line stays hidden everywhere until a real name is filled in.
  founder: {
    // TODO: real founder name, e.g. "Muhammad Ali".
    name: "",
    role: "Founder and travel consultant",
  },
};

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink() {
  return `tel:${site.phone.replace(/\s/g, "")}`;
}

// Google Maps search link for the head office address.
export function mapsLink() {
  const query = encodeURIComponent(
    "Aman Plaza, Mardan Road, Charsadda, Khyber Pakhtunkhwa, Pakistan"
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
