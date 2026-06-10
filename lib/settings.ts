import { site } from "@/lib/site";

export type SiteSettings = {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
};

// Defaults come from lib/site.ts; the DB row overrides these when present.
export const defaultSettings: SiteSettings = {
  name: site.name,
  tagline: site.tagline,
  phone: site.phone,
  whatsapp: site.whatsapp,
  email: site.email,
  address: site.address,
  hours: site.hours,
  facebook: "",
  instagram: "",
  youtube: "",
  tiktok: "",
};

export function waHref(whatsapp: string, message: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
