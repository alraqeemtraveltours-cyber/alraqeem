import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import SiteChrome from "@/components/SiteChrome";
import JsonLd from "@/components/JsonLd";
import { getSettings } from "@/lib/settingsStore";
import { siteSchemaGraph } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Umrah, Hajj & Tours from Pakistan`,
    template: `%s | ${site.name}`,
  },
  description:
    "Al Raqeem Travel & Tours, based in Charsadda, offers Umrah and Hajj packages, international tours and visa services across Islamabad, Lahore, Rawalpindi, Peshawar and all of Pakistan.",
  keywords: [
    "Umrah packages Pakistan",
    "Hajj packages",
    "travel agency Charsadda",
    "travel agency Peshawar",
    "Dubai visa Pakistan",
    "tour packages Pakistan",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | Umrah, Hajj & Tours from Pakistan`,
    description:
      "Umrah and Hajj packages, international tours and visa services across Pakistan. Head office in Charsadda.",
    images: ["/logo.png"],
  },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A211A",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Grammarly,
          etc.) inject attributes like cz-shortcut-listen onto <body> before
          React hydrates. This scopes the suppression to <body>'s own
          attributes only — real mismatches inside the tree still warn. */}
      <body suppressHydrationWarning>
        <JsonLd data={siteSchemaGraph()} />
        <NextTopLoader
          color="#C5A253"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #C5A253, 0 0 5px #C5A253"
          zIndex={1600}
        />
        <SiteChrome settings={settings}>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
