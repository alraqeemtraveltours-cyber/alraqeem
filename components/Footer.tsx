import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { cities } from "@/lib/cities";
import {
  defaultSettings,
  waHref,
  telHref,
  type SiteSettings,
} from "@/lib/settings";

const socialDefs = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
] as const;

export default function Footer({
  settings = defaultSettings,
}: {
  settings?: SiteSettings;
}) {
  const socials = socialDefs
    .map((s) => ({ ...s, url: settings[s.key] }))
    .filter((s) => s.url);

  return (
    <footer className="bg-ink text-slate-300">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/logo.png"
            alt={`${settings.name} logo`}
            width={200}
            height={200}
            className="h-20 w-auto"
          />
          <p className="mt-5 text-sm leading-relaxed text-slate-400">
            {settings.name} is a full-service travel company based in Charsadda,
            serving pilgrims and travelers across Pakistan. A sister company of{" "}
            {site.sisterCompany}.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:border-brand-orange hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-orange">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/packages" className="hover:text-white">All Packages</Link></li>
            <li><Link href="/tickets" className="hover:text-white">Flight Deals</Link></li>
            <li><Link href="/visa-services" className="hover:text-white">Visa Services</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-white">Travel Blog</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-orange">
            Areas We Serve
          </h3>
          <ul className="space-y-2.5 text-sm">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link href={`/areas/${c.slug}`} className="hover:text-white">
                  Travel Agency in {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-orange">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li>{settings.address}</li>
            <li>
              <a href={telHref(settings.phone)} className="hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
            <li>{settings.hours}</li>
            <li>
              <a
                href={waHref(
                  settings.whatsapp,
                  "Assalam o Alaikum, I want to ask about your packages."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange mt-1 !py-2 text-xs"
              >
                WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <p>Umrah | Hajj | Flight Deals | Visa Services</p>
        </div>
      </div>
    </footer>
  );
}
