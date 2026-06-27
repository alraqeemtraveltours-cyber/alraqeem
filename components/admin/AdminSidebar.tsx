"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Dashboard", exact: true, icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/packages", label: "Packages", icon: "M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
  { href: "/admin/tickets", label: "Tickets", icon: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zM13 5v14" },
  { href: "/admin/categories", label: "Categories", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/admin/blogs", label: "Blogs", icon: "M4 4h11l5 5v11a0 0 0 0 1 0 0H4zM14 4v5h5M8 13h8M8 17h8" },
  { href: "/admin/media", label: "Media", icon: "M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="border-b border-white/10 bg-ink text-white lg:flex lg:min-h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex flex-col items-center px-6 py-5">
        <Image src="/logo.png" alt="Al Raqeem" width={200} height={200} className="h-20 w-auto object-contain" priority />
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex lg:flex-1 lg:flex-col lg:gap-1.5 lg:px-3 lg:pb-6">
        {links.map((l) => {
          const active = isActive(l.href, l.exact);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-brand-blue text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
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
              {l.label}
            </Link>
          );
        })}
        <form action={adminLogout} className="lg:mt-auto lg:pt-4">
          <button
            type="submit"
            className="flex w-full shrink-0 items-center gap-3 rounded-xl bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </button>
        </form>
      </nav>
    </aside>
  );
}
