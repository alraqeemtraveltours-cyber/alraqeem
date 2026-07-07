import type { Metadata } from "next";
import TourFacet from "@/components/packages/TourFacet";
import { tourFacets } from "@/lib/tourFacets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Group Tour Packages from Pakistan | Al Raqeem" },
  description:
    "Group tour packages from Pakistan for families, offices, and communities. Dubai, Turkey, Baku, and the Far East, one booking and one quote. Inquiry priced.",
  keywords: [
    "group tour packages from Pakistan",
    "group tours from Pakistan",
    "office trip packages",
    "community group tours",
    "custom group tours from Pakistan",
  ],
  alternates: { canonical: "/tours/group-tours" },
  openGraph: { url: "/tours/group-tours" },
};

export default function Page() {
  return <TourFacet facet={tourFacets["group-tours"]} />;
}
