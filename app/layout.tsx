import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
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
  icons: { icon: "/logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A211A",
};

const schema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: site.name,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: `${site.url}/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Main Bazaar Road",
    addressLocality: "Charsadda",
    addressRegion: "Khyber Pakhtunkhwa",
    addressCountry: "PK",
  },
  areaServed: [
    "Islamabad",
    "Lahore",
    "Rawalpindi",
    "Peshawar",
    "Charsadda",
    "Tangi",
    "Shabqadar",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
