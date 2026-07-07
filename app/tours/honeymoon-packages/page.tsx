import type { Metadata } from "next";
import TourFacet from "@/components/packages/TourFacet";
import { tourFacets } from "@/lib/tourFacets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Honeymoon Tour Packages from Pakistan | Al Raqeem" },
  description:
    "Honeymoon tour packages from Pakistan. Cappadocia balloons in Turkey, the Baku Caspian, the islands of Malaysia and Thailand, and Dubai. Quoted on inquiry.",
  keywords: [
    "honeymoon tour packages from Pakistan",
    "honeymoon packages from Pakistan",
    "Turkey honeymoon package",
    "Malaysia honeymoon package",
    "Baku honeymoon package",
  ],
  alternates: { canonical: "/tours/honeymoon-packages" },
  openGraph: { url: "/tours/honeymoon-packages" },
};

export default function Page() {
  return <TourFacet facet={tourFacets["honeymoon-packages"]} />;
}
