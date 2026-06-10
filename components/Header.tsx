"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site, telLink } from "@/lib/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/visa-services", label: "Visa Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="container-site flex h-20 items-center justify-between sm:h-24">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo-mark.png"
            alt={`${site.name} logo`}
            width={280}
            height={272}
            priority
            className="h-14 w-auto sm:h-[68px]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pathname === item.href
                  ? "bg-brand-blue text-white"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a href={telLink()} className="btn-orange ml-3 !py-2.5 text-sm">
            Call Now
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white lg:hidden"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-ink px-4 pb-6 pt-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-4 py-3.5 text-base font-semibold ${
                pathname === item.href
                  ? "bg-brand-blue text-white"
                  : "text-slate-200 active:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a href={telLink()} className="btn-orange mt-3 w-full">
            Call {site.phone}
          </a>
        </nav>
      )}
    </header>
  );
}
