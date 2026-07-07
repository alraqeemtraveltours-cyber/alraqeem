import type { Metadata } from "next";
import TourFacet from "@/components/packages/TourFacet";
import { tourFacets } from "@/lib/tourFacets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Family Tour Packages from Pakistan | Al Raqeem" },
  description:
    "Family tour packages from Pakistan. Theme parks in Dubai and Singapore, Genting in Malaysia, and gentle city tours in Turkey and Baku. Quoted on inquiry.",
  keywords: [
    "family tour packages from Pakistan",
    "family holiday packages from Pakistan",
    "Dubai family package",
    "Singapore family package",
    "Malaysia family package",
  ],
  alternates: { canonical: "/tours/family-packages" },
  openGraph: { url: "/tours/family-packages" },
};

export default function Page() {
  return <TourFacet facet={tourFacets["family-packages"]} />;
}
