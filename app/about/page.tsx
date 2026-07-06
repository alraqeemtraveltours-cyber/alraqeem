import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { CtaBand, PageHero } from "@/components/Shared";
import JsonLd from "@/components/JsonLd";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import { travelAgencySchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Al Raqeem Travel & Tours is a Charsadda-based travel company and sister concern of Al Nafi Travels, serving pilgrims and travelers across Pakistan.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const values = [
  {
    title: "Amanah",
    text: "Your money and your journey are a trust. We treat both with the seriousness they deserve, with every cost documented and explained.",
  },
  {
    title: "Clarity",
    text: "No fine print surprises. What we quote is what you pay, and what we promise is what you receive.",
  },
  {
    title: "Presence",
    text: "We answer the phone. We reply on WhatsApp. We are in the office when you walk in. Service means being reachable.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={travelAgencySchema()} />
      <PageHero
        eyebrow="About us"
        title="A new name built on an established foundation"
        description={`A Charsadda-based travel company and sister concern of ${site.sisterCompany}, serving pilgrims and travelers across Pakistan.`}
        image={images.madinah}
      />

      <section className="py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <p className="text-lg leading-relaxed text-slate-700">
            {site.name} was founded in Charsadda as the sister company of{" "}
            {site.sisterCompany}, carrying forward years of experience in
            serving pilgrims and travelers from Khyber Pakhtunkhwa, Punjab and
            beyond.
          </p>
          <p className="mt-5 leading-relaxed text-slate-600">
            The name Al Raqeem comes from the Quran, from Surah Al Kahf, where
            it is mentioned alongside the People of the Cave, a reminder that
            every journey is recorded and every trust must be honored. We
            chose it deliberately: in an industry where promises are cheap, our
            name itself is a commitment to accountability.
          </p>
          <p className="mt-5 leading-relaxed text-slate-600">
            From our head office in Charsadda, we serve clients across
            Islamabad, Lahore, Rawalpindi, Peshawar, Tangi, Shabqadar and all
            of Pakistan. Most of our work arrives the same way it always has:
            one family travels with us, and then their relatives, neighbors and
            friends follow, and that only happens when people are treated right.
          </p>
          <p className="mt-5 leading-relaxed text-slate-600">
            Whether it is a parent's first Umrah, a honeymoon in Turkey, or a
            family holiday in Dubai, our approach never changes: clear pricing,
            complete arrangements, and support that lasts until you are home
            safely.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="What we stand for"
            title="Three values, applied to every booking"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-3xl border-t-4 border-brand-blue bg-paper p-7"
              >
                <h3 className="text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Come meet us in Charsadda"
        subtitle="The best way to know a travel company is across a desk, over a cup of tea. Our door is open."
      />
    </>
  );
}
