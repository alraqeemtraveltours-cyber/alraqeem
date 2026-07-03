"use client";

import { useState } from "react";

// On-page FAQ. Rendered as plain content with no FAQPage markup by design.
const faqs = [
  {
    q: "How much does an Umrah package cost from Pakistan?",
    a: "Umrah package pricing from Pakistan rests on three factors: your travel dates, the hotel distance from the Haram, and room sharing. Economy programs cost less than premium five star stays that face the Haram, and Ramadan dates in 2026 sit at the top of the range. Send your dates and group size on WhatsApp for an exact quote the same day.",
  },
  {
    q: "What is included in an Umrah package?",
    a: "Each Umrah package covers the Saudi e-visa, return flights, hotels in Makkah and Madinah, ground transport between the two cities, and guided Ziyarat at both holy sites. Economy programs place pilgrims within walking distance of the Haram, while premium programs add five star hotels, private transport, and daily breakfast and dinner. Our desk confirms every inclusion in writing before you pay.",
  },
  {
    q: "How far are the hotels from the Haram?",
    a: "Hotel distance from the Haram shapes both the comfort and the price of every Umrah package. Economy programs book hotels within walking distance, a short walk to the mataf. Premium programs place pilgrims in five star hotels facing the Haram, steps from the gates. Our team names the exact hotel and its distance for your chosen dates before you confirm the booking.",
  },
  {
    q: "Do you arrange Umrah for families and elderly parents?",
    a: "Our desk arranges Umrah for families and elderly parents every season. Group bookings keep relatives on the same flights and in connected hotel rooms. For senior pilgrims, we request wheelchair assistance at the airports and reserve hotels closest to the Haram gates to shorten the walk. Tell us the ages and any medical needs, and we plan the whole journey around them.",
  },
  {
    q: "How do I apply for Hajj from Pakistan?",
    a: "Hajj from Pakistan runs through two routes. The Government scheme opens on the Ministry of Religious Affairs portal at mora.gov.pk, where you register free during the announced window. Our private Hajj packages form the second route, with documents, trained group leaders, and Mina and Arafat camp services arranged for you. Message our team to compare both routes for the upcoming season.",
  },
  {
    q: "Which cities do you serve, and do you book from Peshawar or Charsadda?",
    a: "Our Charsadda head office serves travelers across Charsadda, Peshawar, Islamabad, Rawalpindi, Lahore, Tangi and Shabqadar. Bookings from Peshawar and Charsadda run every day, with departures arranged from Bacha Khan International Airport in Peshawar or Islamabad International Airport, whichever carries the better fare for your dates. Document collection reaches nearby towns, so distance from the office never blocks a booking.",
  },
  {
    q: "How much is a UAE or Saudi visit visa and what documents are needed?",
    a: "UAE visit visas come as 30 day or 60 day single entry, with multiple entry options at higher fees. Saudi visit and Umrah e-visas follow their own tariff. Core documents stay simple: a passport valid for at least six months, a white background photograph, and a confirmed return ticket. Visa fees move with exchange rates, so our desk quotes the current figure on WhatsApp.",
  },
  {
    q: "How do I pay and how do I book?",
    a: "Booking starts with one WhatsApp message or a visit to the Charsadda office. Our team sends package options with full pricing the same day, and once you choose, a deposit secures your seats and rooms. Balance settlement follows before departure. Payment runs through bank transfer or in person at the office, and every amount stays confirmed in writing.",
  },
  {
    q: "What is the difference between Umrah and Hajj?",
    a: "Umrah is the minor pilgrimage, performed year round in Ihram, completed with Tawaf around the Kaaba and Sa'i between Safa and Marwah. Hajj is the obligatory pilgrimage of Dhul Hijjah, which keeps the Umrah rites and adds the standing at Arafat, the night at Muzdalifah, and the days at Mina, registered through MORA and Nusuk. Our desk arranges both from Pakistan.",
  },
  {
    q: "When is the best time for Umrah, and is Ramadan better?",
    a: "Umrah runs throughout the year, so the best time depends on weather, crowds, and your budget. Ramadan carries the greatest reward, with Taraweeh in the Haram and the nights of Laylat al-Qadr, and it fills the earliest. Cooler months outside Ramadan stay calmer and lighter. Tell our team your window and we plan the journey around it.",
  },
  {
    q: "What documents do I need for Umrah from Pakistan?",
    a: "Umrah from Pakistan needs a passport valid for at least six months, a white background photograph, and the Saudi Umrah e-visa, which our desk prepares and files for you. A vaccination certificate applies where Saudi authorities require it in 2026. Our team checks every page of your file before it is submitted, since small errors cause most refusals.",
  },
  {
    q: "What package durations do you offer, from 7 to 30 days?",
    a: "Our Umrah and Hajj packages run from 7 to 30 days, so you match the trip to your leave and budget. Fifteen and twenty one day Umrah programs suit most pilgrims, while Ramadan durations flex for the last Ashra. Longer stays allow more time in Makkah and Madinah. Our desk builds the night split around your dates.",
  },
  {
    q: "Which international tours and visit visas do you handle?",
    a: "Beyond the pilgrimage, our desk arranges tours to Dubai, Turkey, Baku, and a Malaysia and Thailand combo, with visa, flights, hotels, and sightseeing in one booking. For visit visas, we prepare and file for the UAE, Saudi Arabia, Turkey, Malaysia, Thailand, Azerbaijan, Schengen states, and the United Kingdom, checking every document before submission.",
  },
];

export default function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="mx-auto mt-10 max-w-3xl space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <li
            key={f.q}
            className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-display text-base text-brand-blue-deep sm:text-lg">
                {f.q}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A8853A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {isOpen && (
              <div
                id={`faq-panel-${i}`}
                className="px-5 pb-5 text-sm leading-relaxed text-slate-600"
              >
                {f.a}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
