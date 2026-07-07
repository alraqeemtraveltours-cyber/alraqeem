import type { Metadata } from "next";
import TourFacet from "@/components/packages/TourFacet";
import { tourFacets } from "@/lib/tourFacets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Beach and Adventure Tour Packages from Pakistan | Al Raqeem",
  },
  description:
    "Beach and adventure tour packages from Pakistan. Thailand and Malaysia islands, Baku mountains, Cappadocia balloons, and the Dubai desert. Quoted on inquiry.",
  keywords: [
    "beach tour packages from Pakistan",
    "adventure tour packages from Pakistan",
    "island holidays from Pakistan",
    "Thailand beach package",
    "desert safari tour",
  ],
  alternates: { canonical: "/tours/beach-and-adventure-tours" },
  openGraph: { url: "/tours/beach-and-adventure-tours" },
};

export default function Page() {
  return <TourFacet facet={tourFacets["beach-and-adventure-tours"]} />;
}
