import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import TicketCard from "@/components/TicketCard";
import { CtaBand, PageHero } from "@/components/Shared";
import { getTickets } from "@/lib/ticketsStore";
import { getCategoryNames } from "@/lib/categoriesStore";
import { images } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Flight Deals & Air Tickets",
  description:
    "Discounted air tickets and flight deals from Pakistan for Umrah, Gulf and international routes. Book with Al Raqeem Travel & Tours.",
};

export default async function TicketsPage() {
  const tickets = await getTickets();
  const catNames = await getCategoryNames("ticket");
  const extras = tickets
    .map((t) => t.category)
    .filter((c) => c && !catNames.includes(c));
  const categories = [...catNames, ...Array.from(new Set(extras))];

  return (
    <>
      <PageHero
        eyebrow="Flight deals"
        title="Air tickets at honest, upfront fares"
        description="Current fares on popular routes. Seats at these prices are limited — message us to confirm availability and book."
        image={images.dubai}
      />

      {categories.map((cat, i) => {
        const inCat = tickets.filter((t) => t.category === cat);
        if (inCat.length === 0) return null;
        return (
          <section
            key={cat}
            className={`py-16 sm:py-20 ${i % 2 === 1 ? "bg-white" : ""}`}
          >
            <div className="container-site">
              <SectionHeading
                eyebrow={`${inCat.length} fares`}
                title={cat}
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {inCat.map((t) => (
                  <TicketCard key={t.slug} ticket={t} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {tickets.length === 0 && (
        <section className="py-20">
          <div className="container-site text-center text-slate-500">
            No flight deals are listed right now. Please check back soon.
          </div>
        </section>
      )}

      <CtaBand
        title="Looking for a specific route?"
        subtitle="Tell us your route and dates on WhatsApp and we'll send you the best available fare the same day."
      />
    </>
  );
}
