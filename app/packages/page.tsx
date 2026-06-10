import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PackageCard from "@/components/PackageCard";
import { CtaBand, PageHero } from "@/components/Shared";
import { packages, categories } from "@/lib/packages";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Umrah, Hajj & Tour Packages",
  description:
    "Browse all Al Raqeem Travel & Tours packages: Umrah and Hajj, Dubai, Turkey, Baku, Malaysia, Hunza, Skardu, Swat and Kashmir. Clear pricing, complete service.",
};

const categoryIntro: Record<string, string> = {
  "Umrah & Hajj":
    "Pilgrimage packages built around your comfort and worship, from economy to premium 5-star.",
  International:
    "Visa, flights, hotels and sightseeing combined into one booking for the world's favorite destinations.",
  Domestic:
    "Northern Pakistan's valleys and lakes with comfortable transport and trusted hotels.",
};

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our packages"
        title="Twelve journeys, one standard of care"
        description="Prices shown are starting rates per person and vary by travel dates and hotel selection. Packages marked Contact for price are quoted on your exact dates."
        image={images.kaaba}
      />

      {categories.map((cat, i) => (
        <section
          key={cat}
          className={`py-16 sm:py-20 ${i % 2 === 1 ? "bg-white" : ""}`}
        >
          <div className="container-site">
            <SectionHeading
              eyebrow={`${packages.filter((p) => p.category === cat).length} packages`}
              title={cat}
              description={categoryIntro[cat]}
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {packages
                .filter((p) => p.category === cat)
                .map((p) => (
                  <PackageCard key={p.slug} pkg={p} />
                ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand
        title="Don't see your destination?"
        subtitle="We build custom packages for any destination and group size. Tell us where you want to go."
      />
    </>
  );
}
