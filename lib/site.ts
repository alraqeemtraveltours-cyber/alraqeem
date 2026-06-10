// =====================================================================
// EDIT THIS FILE FIRST.
// Every placeholder for Al Raqeem Travel & Tours lives here.
// Change a value once and it updates across the entire website.
// =====================================================================

export const site = {
  name: "Al Raqeem Travel & Tours",
  shortName: "Al Raqeem",
  tagline: "Your trusted partner for Umrah, Hajj and worldwide travel",

  // PLACEHOLDER: replace with your real domain after purchase
  url: "https://www.alraqeemtravels.com",

  // PLACEHOLDER: replace with real numbers (WhatsApp without + or spaces)
  phone: "+92 300 0000000",
  whatsapp: "923000000000",

  // PLACEHOLDER: replace with real email
  email: "info@alraqeemtravels.com",

  // PLACEHOLDER: replace with exact office address
  address: "Main Bazaar Road, Charsadda, Khyber Pakhtunkhwa, Pakistan",

  hours: "Monday to Saturday, 9:00 AM to 8:00 PM",

  // Sister company
  sisterCompany: "Al Nafi Travels",
};

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink() {
  return `tel:${site.phone.replace(/\s/g, "")}`;
}
