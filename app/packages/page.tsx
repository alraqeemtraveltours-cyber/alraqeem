import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PackageCard from "@/components/PackageCard";
import { CtaBand, PageHero } from "@/components/Shared";
import { categories } from "@/lib/packages";
import { getPackages } from "@/lib/packagesStore";
import { images } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Umrah, Hajj & Tour Packages",
  description:
    "Browse all Al Raqeem Travel & Tours packages: Umrah and Hajj, Dubai, Turkey, Baku and Malaysia. Clear pricing, complete service.",
};

const categoryIntro: Record<string, string> = {
  "Umrah & Hajj":
    "Pilgrimage packages built around your comfort and worship, from economy to premium 5-star.",
  International:
    "Visa, flights, hotels and sightseeing combined into one booking for the world's favorite destinations.",
};

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <>
      <PageHero
        eyebrow="Our packages"
        title="Curated journeys, one standard of care"
        description="Prices shown are starting rates per person and vary by travel dates and hotel selection. Packages marked Contact for price are quoted on your exact dates."
        image={images.kaaba}
      />

      {categories.map((cat, i) => {
        const inCat = packages.filter((p) => p.category === cat);
        if (inCat.length === 0) return null;
        return (
          <section
            key={cat}
            className={`py-16 sm:py-20 ${i % 2 === 1 ? "bg-white" : ""}`}
          >
            <div className="container-site">
              <SectionHeading
                eyebrow={`${inCat.length} packages`}
                title={cat}
                description={categoryIntro[cat]}
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {inCat.map((p) => (
                  <PackageCard key={p.slug} pkg={p} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <CtaBand
        title="Don't see your destination?"
        subtitle="We build custom packages for any destination and group size. Tell us where you want to go."
      />
    </>
  );
}
