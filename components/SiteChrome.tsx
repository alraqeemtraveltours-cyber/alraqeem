"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import type { SiteSettings } from "@/lib/settings";

/**
 * Renders the public site chrome (header / footer / WhatsApp button)
 * everywhere EXCEPT the /admin dashboard, which has its own layout.
 */
export default function SiteChrome({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppFloat settings={settings} />
    </>
  );
}
