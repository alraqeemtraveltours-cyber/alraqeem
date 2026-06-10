import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
import { PageHero } from "@/components/Shared";
import { getPackages } from "@/lib/packagesStore";
import { images } from "@/lib/images";
import { site, telLink, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Al Raqeem Travel & Tours in Charsadda. Call, WhatsApp or visit our office for Umrah packages, tours and visa services.",
};

export default async function ContactPage() {
  const packageOptions = (await getPackages())
    .filter((p) => p.category !== "Umrah & Hajj")
    .map((p) => p.title);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Three ways to reach us. All of them answered."
        description="Call, message us on WhatsApp, or visit our office in Charsadda. We reply the same day."
        image={images.istanbul}
      />

      <section className="py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <p className="eyebrow">Visit</p>
              <h2 className="mt-1 text-xl">Head Office</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {site.address}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {site.hours}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-card">
              <p className="eyebrow">Call</p>
              <h2 className="mt-1 text-xl">Phone</h2>
              <a
                href={telLink()}
                className="mt-2 block font-display text-2xl text-brand-blue hover:underline"
              >
                {site.phone}
              </a>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-card">
              <p className="eyebrow">Message</p>
              <h2 className="mt-1 text-xl">WhatsApp & Email</h2>
              <a
                href={waLink("Assalam o Alaikum, I have a question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange mt-3 w-full"
              >
                Open WhatsApp Chat
              </a>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 block text-center text-sm font-semibold text-brand-blue hover:underline"
              >
                {site.email}
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <InquiryForm packageOptions={packageOptions} />
          </div>
        </div>
      </section>
    </>
  );
}
