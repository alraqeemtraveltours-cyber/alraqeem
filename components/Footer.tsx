import Image from "next/image";
import Link from "next/link";
import { site, telLink, waLink } from "@/lib/site";
import { cities } from "@/lib/cities";

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/logo-mark.png"
            alt={`${site.name} logo`}
            width={220}
            height={214}
            className="h-16 w-auto"
          />
          <p className="mt-5 text-sm leading-relaxed text-slate-400">
            {site.name} is a full-service travel company based in Charsadda,
            serving pilgrims and travelers across Pakistan. A sister company of{" "}
            {site.sisterCompany}.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-orange">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/packages" className="hover:text-white">All Packages</Link></li>
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
            <li>{site.address}</li>
            <li>
              <a href={telLink()} className="hover:text-white">{site.phone}</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li>{site.hours}</li>
            <li>
              <a
                href={waLink("Assalam o Alaikum, I want to ask about your packages.")}
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
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Umrah | Hajj | International Tours | Visa Services</p>
        </div>
      </div>
    </footer>
  );
}
