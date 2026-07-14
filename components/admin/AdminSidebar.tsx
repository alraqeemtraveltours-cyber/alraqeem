"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminLogout } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Dashboard", exact: true, icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/packages", label: "Packages", icon: "M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
  { href: "/admin/tickets", label: "Tickets", icon: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zM13 5v14" },
  { href: "/admin/calculator", label: "Calculator Prices", icon: "M4 3h16v18H4zM8 7h8M8 11h2M12 11h2M16 11h1M8 15h2M12 15h2M16 15h1M8 18h6" },
  { href: "/admin/categories", label: "Categories", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/admin/blogs", label: "Blogs", icon: "M4 4h11l5 5v11a0 0 0 0 1 0 0H4zM14 4v5h5M8 13h8M8 17h8" },
  { href: "/admin/media", label: "Media", icon: "M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { href: "/admin/hotels", label: "Hotels", icon: "M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h1M14 7h1M9 11h1M14 11h1M10 21v-3h4v3" },
  { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className={`relative border-b border-white/10 bg-ink text-white transition-all duration-300 lg:flex lg:min-h-screen lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r ${collapsed ? "lg:w-20" : "lg:w-64"}`}>
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/10 bg-ink p-1.5 text-slate-300 shadow-lg transition hover:bg-white/10 hover:text-white lg:flex"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`transition-transform ${collapsed ? "rotate-180" : ""}`}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div className="flex flex-col items-center px-6 py-5">
        <Image
          src="/logo.png"
          alt="Al Raqeem"
          width={200}
          height={200}
          className={`w-auto object-contain transition-all duration-300 ${collapsed ? "h-12 lg:h-10" : "h-20"}`}
          priority
        />
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex lg:flex-1 lg:flex-col lg:gap-1.5 lg:px-3 lg:pb-6">
        {links.map((l) => {
          const active = isActive(l.href, l.exact);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition lg:justify-start ${collapsed ? "lg:mx-auto lg:w-11 lg:justify-center lg:gap-0 lg:px-0" : ""} ${
                active
                  ? "bg-brand-orange text-brand-blue-deep shadow-[0_8px_20px_rgba(197,162,83,0.18)]"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
              title={collapsed ? l.label : undefined}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={l.icon} />
              </svg>
              <span className={collapsed ? "lg:hidden" : ""}>{l.label}</span>
              {collapsed && (
                <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-2 hidden -translate-y-1/2 rounded-md bg-black/90 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100 lg:block">
                  {l.label}
                </span>
              )}
            </Link>
          );
        })}
        <form action={adminLogout} className="lg:mt-auto lg:pt-4">
          <button
            type="submit"
            className={`group relative flex w-full shrink-0 items-center gap-3 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white ${collapsed ? "lg:mx-auto lg:w-11 lg:justify-center lg:gap-0 lg:px-0" : ""}`}
            title={collapsed ? "Logout" : undefined}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
            {collapsed && (
              <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-2 hidden -translate-y-1/2 rounded-md bg-black/90 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100 lg:block">
                Logout
              </span>
            )}
          </button>
        </form>
      </nav>
    </aside>
  );
}
