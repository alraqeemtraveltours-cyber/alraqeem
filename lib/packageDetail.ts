// =====================================================================
// Detail page content for the eight packages. Every field is grounded in
// real repo data (title, category, duration, highlights, description) or
// standard true requirements. Pricing is inquiry based, so no numbers.
// Unknown slugs (admin added) fall back to derived content, never a crash.
// =====================================================================
import type { TravelPackage } from "@/lib/packages";

export type Faq = { q: string; a: string };

export type DetailContent = {
  overview: string;
  whoFor: string[];
  faqs: Faq[];
  // Hajj page shows a government MORA companion note.
  moraNote?: boolean;
};

function pricingFaq(name: string): Faq {
  return {
    q: `How much does the ${name} cost?`,
    a: `${name} pricing is quoted on inquiry because airfare and hotel rates shift every week. Our team checks live fares for your exact travel dates and sends the current best price on WhatsApp, with no hidden charges and no stale published numbers. Message our desk with your dates and group size for a same day quote.`,
  };
}

export const detailContent: Record<string, DetailContent> = {
  "economy-umrah-15-days": {
    overview:
      "Economy Umrah Package from Pakistan suits first time and budget conscious pilgrims who want a complete, guided journey at an honest cost. Our team arranges return airfare from Peshawar or Islamabad, hotels within walking distance of the Haram, the Saudi e-visa, ground transport between Makkah and Madinah, and guided Ziyarat at both holy sites. Fifteen days allows unhurried worship across both cities, with our desk handling every document and booking so you focus on your prayers.",
    whoFor: [
      "First time pilgrims from Pakistan",
      "Budget conscious families and individuals",
      "Travelers who want a complete package at an honest cost",
      "Groups departing from Peshawar or Islamabad",
    ],
    faqs: [
      pricingFaq("Economy Umrah Package"),
      {
        q: "What is included in the Economy Umrah Package?",
        a: "Economy Umrah covers return airfare from Peshawar or Islamabad, hotels within walking distance of the Haram, the Saudi e-visa, ground transport between Makkah and Madinah, and guided Ziyarat at both holy sites. Our desk confirms every inclusion in writing before you pay, so nothing on the journey surprises you.",
      },
      {
        q: "How close are the Economy Umrah hotels to the Haram?",
        a: "Economy Umrah books hotels within walking distance of the Haram, a short walk to the mataf for your daily prayers. Our team names the exact hotel for your travel dates before you confirm, since availability changes through the year and the closest options book early.",
      },
      {
        q: "Which cities does the flight depart from?",
        a: "Economy Umrah flights depart from Peshawar or Islamabad, whichever carries the better fare and schedule for your dates. Our desk arranges ground transport onward, and travelers from nearby towns coordinate airport pickup with our team when they book.",
      },
    ],
  },

  "premium-umrah-21-days": {
    overview:
      "Premium Umrah Package from Pakistan serves pilgrims who want deep comfort alongside their worship. Our team books five star hotels near or facing the Haram in Makkah and Madinah, direct flights with checked baggage, private transport with a personal guide, and a daily breakfast and dinner buffet. Twenty one days gives a calm, unhurried stay across both cities, with the Saudi Umrah e-visa processed through Nusuk and every detail handled by our desk from departure to safe return.",
    whoFor: [
      "Pilgrims who want five star comfort near the Haram",
      "Families traveling together in one group",
      "Elderly pilgrims who value short walking distances",
      "Repeat pilgrims seeking a longer, calmer stay",
    ],
    faqs: [
      pricingFaq("Premium Umrah Package"),
      {
        q: "What makes the Premium Umrah Package different?",
        a: "Premium Umrah books five star hotels near or facing the Haram, direct flights with checked baggage, private transport with a personal guide, and a daily breakfast and dinner buffet. Twenty one days across Makkah and Madinah gives a slower, more comfortable pace, with the Saudi Umrah e-visa processed through Nusuk by our team.",
      },
      {
        q: "Which five star hotels does the Premium Umrah Package use?",
        a: "Premium Umrah books five star hotels near or facing the Haram in Makkah and Madinah. Exact hotel names are confirmed for your travel dates before you pay, since the closest five star properties are limited and availability shifts through the year. Message our desk for the current hotels on your dates.",
      },
      {
        q: "How close are the Premium Umrah hotels to the Haram?",
        a: "Premium Umrah places pilgrims in five star hotels near or facing the Haram, steps from the gates, so elderly travelers and families walk the shortest distance to prayer. The exact hotel and its position are confirmed for your dates before you book, since the closest options are limited.",
      },
      {
        q: "What is the Makkah and Madinah night split on the Premium Umrah Package?",
        a: "Premium Umrah runs 21 days across Makkah and Madinah, and the exact night split between the two cities is set for your travel dates and group. Your time matches your priorities, whether that is more nights in Makkah for worship or a longer stay in Madinah. Our desk confirms the split with your quote.",
      },
      {
        q: "Why is the Premium Umrah Package 21 days?",
        a: "Twenty one days gives an unhurried Premium Umrah, with time for repeated Umrah, calm daily prayers in both Harams, and full Ziyarat without rushing. Longer stays suit first time and elderly pilgrims who want to settle in, and repeat pilgrims who value depth over speed. Shorter durations are arranged on request.",
      },
      {
        q: "Why choose Premium over Economy Umrah?",
        a: "Premium Umrah upgrades the stay to five star hotels near or facing the Haram, fewer travelers per room, private transport with a personal guide, and daily breakfast and dinner, where Economy keeps hotels within walking or shuttle distance and shared rooms. Both cover the visa, flights, and guided Ziyarat. Compare the tiers below.",
      },
      {
        q: "What room configuration does the Premium Umrah use?",
        a: "Room sharing on Premium Umrah is arranged as double, twin, or triple to suit couples, families, and small groups, rather than the quad sharing of the economy tier. Tell our desk how your group prefers to share, and we confirm the configuration and the hotel with your quote.",
      },
      {
        q: "Are meals included on the Premium Umrah Package?",
        a: "Yes. Premium Umrah includes a daily breakfast and dinner buffet at your hotel, so you break your fast and end your day without arranging meals separately. Any specific dietary needs are noted when you book, and our desk confirms the meal plan for your chosen hotel.",
      },
      {
        q: "Is private transport included on the Premium Umrah Package?",
        a: "Premium Umrah includes private transport with a personal guide across Makkah and Madinah, rather than shared coaches. Our team arranges airport transfers, intercity travel, and Ziyarat movement, so your group travels on its own schedule throughout the journey.",
      },
      {
        q: "Who is the Premium Umrah Package for?",
        a: "Premium Umrah suits pilgrims who want five star comfort near the Haram, families traveling together, elderly pilgrims who value short walking distances, and repeat pilgrims seeking a longer, calmer stay. Tell our desk your group and any needs, and we shape the arrangements around them, from connected rooms to airport assistance.",
      },
      {
        q: "How does the Saudi Umrah visa process work on the Premium Umrah Package?",
        a: "Our team processes your Saudi Umrah e-visa through the official Nusuk system and handles the full file, from the passport scan to submission. Our desk is a private agency, not a government office, so we prepare and file your paperwork with care rather than promise a shortcut nobody controls. Verify the current rules at the official Saudi source before you travel.",
      },
      {
        q: "What are the refund and cancellation terms for the Premium Umrah Package?",
        a: "Refund and cancellation terms for the Premium Umrah Package follow how far ahead you cancel and the hotel and airline rules that apply. Our desk sets out the terms in writing before you pay, with no hidden charges. Ask our team for the full payment, refund, and cancellation policy when you book.",
      },
    ],
  },

  "ramadan-umrah-special": {
    overview:
      "Ramadan Umrah Package from Pakistan places you in Makkah and Madinah during the most blessed nights of the year. Our team arranges last Ashra stays, hotels booked months ahead, Itikaf on request, and flexible durations from ten to thirty days. Ramadan demand runs extremely high, so seats and rooms fill early. Message our desk well ahead of your dates to secure Taraweeh in the Haram and a place for the nights of Laylat al-Qadr.",
    whoFor: [
      "Pilgrims seeking Taraweeh and Laylat al-Qadr in the Haram",
      "Travelers planning Itikaf in the last Ashra",
      "Families wanting flexible Ramadan durations",
      "Early planners who book months in advance",
    ],
    faqs: [
      pricingFaq("Ramadan Umrah Package"),
      {
        q: "How early should I book Ramadan Umrah?",
        a: "Ramadan Umrah fills months in advance, and the last Ashra sells out first. For Ramadan 2027, our team books hotels and seats as early as possible, so message our desk two to three months ahead to secure your preferred nights, duration, and hotel near the Haram before availability closes.",
      },
      {
        q: "Why does Ramadan Umrah cost more than other months?",
        a: "Ramadan Umrah sits at the top of the year for demand, and the last ten nights peak hardest. Hotels near the Haram raise their rates for the season, airline seats tighten, and the closest properties fill first. Our team quotes the current best price for your exact dates, since Ramadan rates move week to week.",
      },
      {
        q: "When does the last Ashra fall, and how do I plan for Laylat al-Qadr?",
        a: "The last Ashra runs the final ten nights of Ramadan, nights 21 to 30, when Laylat al-Qadr falls on one of the odd nights. Exact Gregorian dates follow the moon sighting for Ramadan 2027. Book two to three months ahead, since hotels near the Haram for these nights close first.",
      },
      {
        q: "Are Itikaf arrangements available on the Ramadan Umrah?",
        a: "Itikaf arrangements are available on request during the last Ashra of Ramadan. Our team plans your hotel stay and durations around Itikaf so your worship continues without disruption. Tell our desk your intended nights when you book, since these arrangements depend on early hotel availability.",
      },
      {
        q: "Which hotels are near the Haram during Ramadan?",
        a: "Ramadan Umrah books hotels near the Haram so your walk to Taraweeh and Qiyam stays short during peak crowds. Exact hotel names are confirmed for your dates before you pay, since the closest Ramadan rooms fill months ahead. Message our desk early for the current options on your nights.",
      },
      {
        q: "Are Suhoor and Iftar included in the Ramadan Umrah?",
        a: "Meal arrangements for Ramadan Umrah, including Suhoor before dawn and Iftar at sunset, depend on your hotel and package version. Our desk confirms the meal plan with your quote, and many hotels near the Haram serve both through the month. Tell us any dietary needs when you book.",
      },
      {
        q: "What is the reward of Umrah in Ramadan?",
        a: "A sound Hadith in Bukhari and Muslim relates that the Prophet, peace be upon him, said an Umrah in Ramadan carries the reward of a Hajj. The reward, alongside Laylat al-Qadr and Itikaf in the last ten nights, draws pilgrims from across Pakistan, so the season books early.",
      },
      {
        q: "What durations are available for Ramadan Umrah?",
        a: "Ramadan Umrah runs across flexible durations from ten to thirty days, covering the first Ashra, the last Ashra, or the full month. Our team matches your stay to your work and family schedule, then books hotels and flights around the nights that matter most to you.",
      },
      {
        q: "If Ramadan is fully booked, do you offer Umrah in Shawwal?",
        a: "Yes. When Ramadan dates or the closest hotels sell out, our desk arranges Umrah in Shawwal after Eid, with calmer crowds, easier hotel availability, and the same complete service. Message our team, and we quote the Shawwal option alongside any remaining Ramadan nights.",
      },
      {
        q: "Is Ramadan Umrah suitable for elderly pilgrims when crowds peak?",
        a: "Ramadan crowds peak in the last Ashra, so for elderly pilgrims our team books hotels closest to the Haram to shorten the walk, requests wheelchair assistance at the airports, and plans rest between prayers. Tell our desk about any medical needs, and we shape the stay around them.",
      },
    ],
  },

  "hajj-package": {
    moraNote: true,
    overview:
      "Hajj Package from Pakistan delivers a complete, guided pilgrimage with trained group leaders and scholars. Our team supports government Hajj scheme registration through MORA, plus Mina and Arafat camp accommodation, Muzdalifah movement, and pre-departure training so you arrive prepared for every rite. Quotas stay limited every year, so early registration matters. For the government scheme, register free on the official MORA portal, then choose our private Hajj route for full document support and guided camp services from departure to safe return.",
    whoFor: [
      "First time Hajj pilgrims from Pakistan",
      "Pilgrims who want trained group leaders and scholars",
      "Families performing Hajj together",
      "Travelers seeking full document and camp support",
    ],
    faqs: [
      pricingFaq("Hajj Package"),
      {
        q: "What is the difference between the government and private Hajj schemes?",
        a: "The government Hajj scheme runs through the Ministry of Religious Affairs, MORA, on a balloting system, with a limited annual quota and an advance deposit during the announced window. The private route books through a Saudi approved operator without balloting, on a first come basis. Verify the current cycle on the official MORA portal, and our desk guides your free MORA registration while arranging the private package around your dates.",
      },
      {
        q: "How do I check that a Hajj operator is approved?",
        a: "Saudi Arabia lists approved Hajj and Umrah providers on the official Nusuk platform, so you confirm any operator before you pay. Ask our desk for the registration details, then verify them on Nusuk. Booking through an approved provider is the surest guard against Hajj fraud, so never pay an operator you have not checked.",
      },
      {
        q: "What is a Maktab category, and why does it matter?",
        a: "The Maktab is your service group in Mina, and its category sets your tent location and comfort. Category A tents sit closer to the Jamarat with air conditioning and catered meals, while Category B tents sit farther out at a lower cost. Your Maktab category shapes the walking distance during the days of Tashreeq, so our desk confirms it with your package before you pay.",
      },
      {
        q: "What is the difference between shifting and non shifting Hajj packages?",
        a: "A non shifting package keeps you in one Mina tent through the whole stay, closer to the Jamarat, at a higher cost. A shifting package moves you to farther accommodation on the busiest nights, at a lower cost. Tell our desk your budget and your walking comfort, and we match the package and the Maktab category to them.",
      },
      {
        q: "What are the tent facilities like in Mina and Arafat?",
        a: "Facilities follow your Maktab category. Category A camps offer air conditioned tents, catered buffet meals, sofa beds or mattresses, and washrooms within the camp, closer to the Jamarat. The exact camp is confirmed for your package, since the Maktab is assigned through the scheme, so message our desk for the current details on your dates.",
      },
      {
        q: "How long is the Hajj trip, and what durations do you offer?",
        a: "Hajj trip length varies by scheme, airline schedule, and whether you travel Makkah first or Madinah first. Our desk confirms the exact day count and the Makkah, Madinah, and Aziziyah split for your booking, since the dates move with the Hajj calendar each year. Message our team with your preferred window for the current options.",
      },
      {
        q: "Which hotels do you use in Makkah, Madinah, and Aziziyah?",
        a: "Hotels in Makkah, Madinah, and Aziziyah are set for your travel dates and scheme, with the exact names and distances confirmed before you pay. The closer hotels near the Haram and the Aziziyah base for the Mina days book early, so message our desk for the current properties on your dates.",
      },
      {
        q: "What are the rituals across the days of Hajj?",
        a: "Hajj runs from the 8th to the 13th of Dhul Hijjah. Pilgrims enter Ihram and move to Mina on the 8th, stand at Arafat on the 9th, then pass the night at Muzdalifah. The 10th brings the stoning at Jamarat al Aqabah, Qurbani, Halq or Taqsir, and Tawaf al Ifadah, followed by the days of Tashreeq in Mina and the farewell Tawaf. See the Hajj journey above for the full flow.",
      },
      {
        q: "What documents do I need for the Hajj visa?",
        a: "The Hajj visa needs a passport valid for at least six months, your national identity card, passport photographs with a white background, a confirmed return ticket, a vaccination certificate where Saudi authorities require it, your blood group, and a named nominee. Our team prepares and files your paperwork, and you verify the current requirements at the official Saudi source before you travel.",
      },
      {
        q: "Is Hajj training included before departure?",
        a: "Yes. Scholar led Hajj training is part of the package, with sessions that walk your group through Ihram, the rites at Arafat and Mina, the stoning, and the Tawaf, plus video and audio guidance to revise before you travel. First time pilgrims arrive knowing each step, so the days of Hajj stay calm and clear.",
      },
      {
        q: "Do women need a Mehram to perform Hajj?",
        a: "Saudi rules on women travelling without a Mehram have shifted in recent cycles, with women joining organized groups under set conditions. Rules move year to year, so confirm the current position for your cycle at the official Saudi source. Our desk arranges group travel for women where the rules allow, with the details set at booking.",
      },
      {
        q: "Is Qurbani or Dam included in the Hajj Package?",
        a: "Qurbani, also called Dam, is arranged where your package includes it, and is confirmed in writing before you pay. Some packages handle the Qurbani through the official Saudi channel on your behalf, while others leave it for you to arrange. Ask our desk which applies to your package, so nothing is missed on the 10th of Dhul Hijjah.",
      },
      {
        q: "When does Hajj registration open, and how does the quota work?",
        a: "MORA announces the government Hajj scheme each year with a limited quota and a fixed application window, allocated by balloting. Register free on the official MORA portal during that window, and message our desk in parallel to reserve a private route place, since quotas and private seats both fill quickly. Verify the current dates and quota on the MORA portal, not from unofficial sources.",
      },
    ],
  },

  "dubai-5-days": {
    overview:
      "Dubai City Tour from Pakistan packs the emirate's highlights into five days and four nights. Our team arranges return airfare, the UAE visit visa, a four star hotel with breakfast, a desert safari with BBQ dinner, a Burj Khalifa and Dubai Mall visit, and a Marina dhow cruise. Visa, flights, hotel, and sightseeing sit in one booking, which makes this a smooth first international trip for couples and families traveling from Pakistan.",
    whoFor: [
      "Couples and honeymooners",
      "Families with children",
      "First time international travelers from Pakistan",
      "Travelers who want visa, flights, and hotel in one booking",
    ],
    faqs: [
      pricingFaq("Dubai City Tour"),
      {
        q: "Does the Dubai package include the visa and flights?",
        a: "Dubai City Tour includes return airfare and the UAE visit visa, along with a four star hotel and breakfast. Our team prepares and checks your visa documents before filing, so your file clears cleanly. Visa, flights, hotel, and tours arrive in one booking with no separate arrangements to chase.",
      },
      {
        q: "What is included in the Dubai City Tour?",
        a: "Dubai City Tour covers return airfare, the UAE visit visa, a four star hotel with breakfast, a desert safari with BBQ dinner, a Burj Khalifa and Dubai Mall visit, and a Marina dhow cruise. Five days and four nights leave time for the emirate's landmark sights at a relaxed pace.",
      },
      {
        q: "Is the Dubai tour suitable for families?",
        a: "Dubai City Tour works well for families, with a four star hotel, a desert safari, and the Burj Khalifa and Dubai Mall on the itinerary. Our team adjusts the pace for children and elders, and arranges the UAE visit visa for every traveler in your group.",
      },
    ],
  },

  "turkey-7-days": {
    overview:
      "Turkey Tour Istanbul and Cappadocia from Pakistan runs seven days and six nights across two unforgettable regions. Our team arranges return airfare, Turkey e-visa support, guided tours of Istanbul's old city, a Cappadocia visit with an optional hot air balloon ride, a Bosphorus cruise, and halal meals throughout. Ottoman history and valley landscapes combine in one booking, a favorite for honeymoons and families traveling from Pakistan.",
    whoFor: [
      "Honeymooners and couples",
      "Families who enjoy history and landscapes",
      "First time Turkey travelers from Pakistan",
      "Travelers who want halal meals arranged throughout",
    ],
    faqs: [
      pricingFaq("Turkey Tour"),
      {
        q: "Does the Turkey tour include the visa and flights?",
        a: "Turkey Tour includes return airfare and Turkey e-visa support. Our team checks eligibility and prepares your file, filing the e-visa for eligible travelers and guiding the sticker visa for others. Flights, tours, a Bosphorus cruise, and halal meals arrive in one booking managed by our desk.",
      },
      {
        q: "What are the best months for the Turkey tour?",
        a: "Turkey rewards spring and autumn travel, when Istanbul and Cappadocia stay comfortable for walking and balloon rides. Summer brings warmer days and larger crowds, while winter turns Cappadocia snowy and quiet. Tell our team your preferred window, and our desk builds the itinerary around it.",
      },
      {
        q: "Is the hot air balloon ride included?",
        a: "The Cappadocia hot air balloon ride is an optional add-on rather than a fixed inclusion, since flights depend on weather and demand. Our team books it alongside your package when you request it, and confirms timing on the ground so you catch a clear sunrise over the valleys.",
      },
    ],
  },

  "baku-5-days": {
    overview:
      "Baku Azerbaijan from Pakistan offers a short, easy international escape across five days and four nights. Our team arranges return airfare, the e-visa, a city center hotel with breakfast, an Old City and Flame Towers tour, and a Gabala day trip with a cable car ride. Walkable streets and simple visas make Baku a smooth first trip abroad for couples and families traveling from Pakistan.",
    whoFor: [
      "First time international travelers from Pakistan",
      "Couples wanting a short getaway",
      "Families who enjoy walkable cities",
      "Travelers who want an easy visa process",
    ],
    faqs: [
      pricingFaq("Baku Azerbaijan tour"),
      {
        q: "How easy is the Baku visa for Pakistani travelers?",
        a: "Azerbaijan runs an e-visa that stays among the simpler options for Pakistani passport holders. Our team prepares and checks your documents, then files the e-visa so it clears without avoidable errors. The visa arrives inside your package, with no separate embassy visit to arrange.",
      },
      {
        q: "What is included in the Baku package?",
        a: "Baku Azerbaijan covers return airfare, the e-visa, a city center hotel with breakfast, an Old City and Flame Towers tour, and a Gabala day trip with a cable car ride. Five days and four nights leave room for walkable sightseeing and a mountain excursion at an easy pace.",
      },
      {
        q: "Is Baku a good first trip abroad?",
        a: "Baku suits first time international travelers, with short flights, a simple e-visa, and a compact, walkable city center. Our team handles the visa, hotel, and tours in one booking, so travelers new to international trips move through the journey with clear support from our desk.",
      },
    ],
  },

  "malaysia-thailand-8-days": {
    overview:
      "Malaysia and Thailand Combo from Pakistan brings two countries into one eight day, seven night booking. Our team arranges Kuala Lumpur and Bangkok in a single trip, a Genting Highlands day tour, an optional Phuket beach extension, and visa processing for both countries. City lights and beaches sit side by side, which makes this a full Far East experience for families and couples traveling from Pakistan.",
    whoFor: [
      "Families wanting two countries in one trip",
      "Couples seeking cities and beaches together",
      "First time Far East travelers from Pakistan",
      "Travelers who want both visas handled in one booking",
    ],
    faqs: [
      pricingFaq("Malaysia and Thailand Combo"),
      {
        q: "Does the combo include visas for both countries?",
        a: "Malaysia and Thailand Combo includes visa processing for both countries. Our team prepares and checks each file before filing, so your Malaysia and Thailand entries clear cleanly. Two visas, flights, hotels, and tours arrive in one booking, with our desk coordinating the full route for you.",
      },
      {
        q: "What is included in the combo tour?",
        a: "Malaysia and Thailand Combo covers Kuala Lumpur and Bangkok in one trip, a Genting Highlands day tour, an optional Phuket beach extension, and visa processing for both countries. Eight days and seven nights balance city sightseeing with a beach option for a full Far East experience.",
      },
      {
        q: "Is the Phuket beach extension available?",
        a: "The Phuket beach extension is an optional add-on to the Kuala Lumpur and Bangkok route. Our team arranges the extra nights, transfers, and beach stay when you request it, and confirms the updated itinerary in writing so your full trip stays clear from the start.",
      },
    ],
  },
};

// -------- Derivation helpers (real data only) --------

// Duration band from the duration string, using the largest day count.
export function durationBand(
  duration: string
): "short" | "mid" | "long" | null {
  const nums = (duration.match(/\d+/g) || []).map(Number);
  if (nums.length === 0) return null;
  const max = Math.max(...nums);
  if (max <= 10) return "short";
  if (max <= 20) return "mid";
  return "long";
}

// Tier from the package name, where the name genuinely states it. Ramadan is
// its own seasonal tier, keyed off the slug so the chip and quick facts label it.
export function tierOf(
  pkg: TravelPackage
): "Economy" | "Premium" | "Ramadan" | null {
  const t = pkg.title.toLowerCase();
  if (t.includes("economy")) return "Economy";
  if (t.includes("premium")) return "Premium";
  if (pkg.slug === "ramadan-umrah-special" || t.includes("ramadan"))
    return "Ramadan";
  return null;
}

// Departure cities. Pilgrimage travel departs from Peshawar and Islamabad
// across the site; tour origins are not stated per package, so they omit.
export function departureCities(pkg: TravelPackage): string[] {
  return pkg.category === "Umrah & Hajj" ? ["Peshawar", "Islamabad"] : [];
}

// The real hotel or proximity phrasing from the highlights, when present.
export function hotelHighlight(pkg: TravelPackage): string | null {
  return (
    pkg.highlights.find((h) => /hotel|haram|walking|facing|star/i.test(h)) ??
    null
  );
}

export const standardExclusions = [
  "Personal expenses such as shopping and phone credit",
  "Anything not listed under what is included",
  "Optional excursions and private upgrades",
  "Travel insurance, unless stated in your quote",
];

export function documentsFor(pkg: TravelPackage): string[] {
  if (pkg.category === "Umrah & Hajj") {
    return [
      "Passport valid for at least six months with blank pages",
      "National identity card, CNIC",
      "Passport size photographs with a white background",
      "Umrah or Hajj visa, processed by our team",
      "Vaccination certificate where required by Saudi authorities",
    ];
  }
  return [
    "Passport valid for at least six months with blank pages",
    "National identity card, CNIC",
    "Passport size photographs with a white background",
    "Visit visa for the destination, processed by our team",
    "Confirmed return ticket and hotel booking, arranged in your package",
  ];
}

export const bookingSteps = [
  "Message our team on WhatsApp or visit the Charsadda office with your travel dates.",
  "Receive a quote for your exact dates, with the current best price and no hidden charges.",
  "Confirm your package and submit your documents for processing.",
  "Pay by bank transfer or in person, and receive written confirmation.",
  "Travel with your documents in hand and our desk one WhatsApp message away.",
];

// The three ten-night stretches of Ramadan. Structure only; exact Gregorian
// dates follow the moon sighting and are confirmed at booking, not fabricated.
export const ramadanAshras = [
  {
    name: "First Ashra",
    nights: "Nights 1 to 10",
    detail:
      "The opening ten nights of Ramadan. Pilgrims settle into fasting, Taraweeh, and daily prayers in Masjid al-Haram, with the lightest crowds of the month.",
    last: false,
  },
  {
    name: "Middle Ashra",
    nights: "Nights 11 to 20",
    detail:
      "The middle ten nights continue the routine of worship and Ziyarat, calmer than the final stretch, and a steady choice for a first Ramadan Umrah.",
    last: false,
  },
  {
    name: "Last Ashra",
    nights: "Nights 21 to 30",
    detail:
      "The final ten nights carry the greatest reward. Laylat al-Qadr falls on one of the odd nights, Itikaf is observed in the Haram, and Qiyam extends deep into the night. Hotels near the Haram fill first, so the last Ashra books earliest.",
    last: true,
  },
];

// Ramadan stay tiers. Proximity and sharing described honestly, no invented
// hotel names and no price. Exact hotels and the night split route to inquiry.
export const ramadanTiers = [
  {
    name: "Budget Ramadan",
    proximity: "Shuttle served or a longer walk to the Haram",
    detail:
      "Shared rooms and a complete guided service at the lowest Ramadan cost. Suits first or middle Ashra travelers who want the blessed month without the last Ashra peak.",
    last: false,
  },
  {
    name: "Standard Ramadan",
    proximity: "A shorter walk to the Haram",
    detail:
      "Moderate room sharing and closer hotels than the budget tier, a balance of comfort and cost across any Ashra of the month.",
    last: false,
  },
  {
    name: "Premium last Ashra",
    proximity: "Closest available near the Haram",
    detail:
      "The last ten nights with fewer travelers per room and hotels as near the Haram as availability allows, with Itikaf arranged on request for Laylat al-Qadr.",
    last: true,
  },
];

// General, well known Ramadan wellbeing guidance. No medical promises.
export const ramadanFastingTips = [
  {
    title: "Eat a steady Suhoor",
    detail:
      "Take a balanced Suhoor before Fajr, with slow release foods and water, so your fast holds through the long Haram days.",
  },
  {
    title: "Hydrate after Iftar",
    detail:
      "Drink water steadily between Iftar and Suhoor rather than all at once, and go easy on caffeine before the night prayers.",
  },
  {
    title: "Break your fast simply",
    detail:
      "Open your fast with dates and water in the Sunnah way, then pray Maghrib before a fuller meal, to keep energy for Taraweeh.",
  },
  {
    title: "Guidance for elderly pilgrims",
    detail:
      "Rest between prayers, carry any regular medication, and speak with your doctor before you travel so the fast and the crowds stay manageable.",
  },
];

// Hajj scheme routes. Scheme mechanics only, no unverified quota or dates,
// no fabricated approval. Current cycle facts route to the MORA portal.
export const hajjSchemes = [
  {
    name: "Government scheme",
    lead: "MORA balloting",
    icon: "shield",
    detail:
      "The Ministry of Religious Affairs runs the government Hajj scheme on a balloting system, with a limited annual quota and an advance deposit during the announced application window. Registration is free on the official MORA portal.",
  },
  {
    name: "Private package",
    lead: "No balloting, first come",
    icon: "route",
    detail:
      "The private route books through a Saudi approved operator without balloting, on a first come basis. Seats and Maktab categories are limited, so early booking holds your place and your preferred camp.",
  },
  {
    name: "Sponsorship route",
    lead: "Invitation based",
    icon: "users",
    detail:
      "The sponsorship route travels on an invitation from a resident or a sponsor inside the Kingdom, subject to Saudi rules for the cycle. Our desk sets out the current conditions when you ask.",
  },
];

// Maktab category, the core Hajj comfort decision in Mina.
export const maktabCategories = [
  {
    name: "Category A",
    tag: "Non shifting, near Jamarat",
    detail:
      "Category A keeps you in one Mina tent throughout, closer to the Jamarat, with air conditioning and catered meals. The shorter walk during the days of Tashreeq suits elderly pilgrims and families, at a higher cost.",
    highlight: true,
  },
  {
    name: "Category B",
    tag: "Shifting, farther out",
    detail:
      "Category B sits farther from the Jamarat and shifts you to other accommodation on the busiest nights, at a lower cost. Fitter pilgrims who accept a longer walk choose this tier to keep the package affordable.",
    highlight: false,
  },
];

// Mina and Arafat camp facilities. Framed by category, since the Maktab is
// assigned through the scheme; the exact camp is confirmed per booking.
export const minaFacilities = [
  {
    icon: "hotel",
    title: "Air conditioned tents",
    detail:
      "Category A camps run air conditioned tents through the Mina and Arafat days.",
  },
  {
    icon: "meal",
    title: "Buffet meals",
    detail:
      "Catered buffet meals are served in the camp across the days of Hajj.",
  },
  {
    icon: "moon",
    title: "Sofa beds or mattresses",
    detail:
      "Sleeping arrangements range from sofa beds to mattresses by category and camp.",
  },
  {
    icon: "shield",
    title: "Washrooms in the camp",
    detail:
      "Washroom blocks sit within the camp, with the ratio set by your Maktab category.",
  },
  {
    icon: "walk",
    title: "Close to the Jamarat",
    detail:
      "Category A camps sit closer to the Jamarat, shortening the walk for the stoning.",
  },
];

// The Hajj rites across the 8th to 13th of Dhul Hijjah. Fixed, well documented
// rites, framed as the typical flow. Lunar days only, no unverified Gregorian
// dates for the coming cycle.
export const hajjJourney = [
  {
    day: "Before the 8th",
    title: "Ihram, Tawaf al Qudum, and Sa'i",
    detail:
      "Enter the state of Ihram, perform the arrival Tawaf around the Kaaba, and complete Sa'i between Safa and Marwah in Makkah.",
  },
  {
    day: "8th of Dhul Hijjah",
    title: "Tarwiyah, move to Mina",
    detail:
      "Travel to Mina and spend the day and night in prayer and rest, preparing for the standing at Arafat.",
  },
  {
    day: "9th of Dhul Hijjah",
    title: "The standing at Arafat, then Muzdalifah",
    detail:
      "Stand at Arafat through the day in dua and worship, the pillar of Hajj, then move to Muzdalifah for the night and gather pebbles.",
  },
  {
    day: "10th of Dhul Hijjah",
    title: "Ramy, Qurbani, Halq, and Tawaf al Ifadah",
    detail:
      "Stone Jamarat al Aqabah, offer Qurbani, shave or shorten the hair, and perform Tawaf al Ifadah, the day of Eid al Adha.",
  },
  {
    day: "11th to 12th of Dhul Hijjah",
    title: "The days of Tashreeq in Mina",
    detail:
      "Stay in Mina and stone the three Jamarat each day, with the 13th an option for those who remain longer.",
  },
  {
    day: "Before departure",
    title: "Tawaf al Wada, the farewell",
    detail:
      "Complete the farewell Tawaf in Makkah before you leave, and travel to Madinah for the Rawdah and Ziyarat where your program includes it.",
  },
];

// Hajj visa document list. Standard requirements, framed to verify at the
// official Saudi source, since specifics move by cycle.
export const hajjVisaDocs = [
  "Passport valid for at least six months with blank pages",
  "National identity card, CNIC",
  "Passport size photographs with a white background",
  "Confirmed return ticket for your Hajj dates",
  "Vaccination certificate where Saudi authorities require it",
  "Blood group record",
  "A named nominee, next of kin",
];

// Pre-departure Hajj training. Real, well documented preparation.
export const hajjTraining = [
  {
    title: "Scholar led sessions",
    detail:
      "Group sessions with a scholar walk through Ihram, the rites at Arafat and Mina, the stoning, and the Tawaf, with time for questions.",
  },
  {
    title: "Video and audio guidance",
    detail:
      "Video and audio guides let your group revise each step at home before departure, so the days of Hajj stay clear.",
  },
  {
    title: "Group leaders on the ground",
    detail:
      "Trained group leaders travel with you and guide each rite in order, from the move to Mina to the farewell Tawaf.",
  },
];

// Standard, well documented Ziyarat sites in Makkah and Madinah. Guided
// Ziyarat covers a subset; the exact plan is confirmed for each booking.
export const ziyaratSites = {
  makkah: [
    "Jabal al-Nour and the Cave of Hira",
    "Jabal Thawr and the Cave of Thawr",
    "Mina",
    "Mount Arafat and the plains of Arafat",
    "Muzdalifah",
    "Masjid Aisha at Taneem",
    "Jannat al-Mualla",
  ],
  madinah: [
    "Masjid an-Nabawi and the Rawdah",
    "Quba Mosque",
    "Masjid al-Qiblatain",
    "the Seven Mosques",
    "Mount Uhud and the martyrs of Uhud",
    "Jannat al-Baqi",
    "the date orchards of Madinah",
  ],
};

// Typical itinerary flow. Real rites and places only, framed as a typical
// flow, not fixed dates. No invented Makkah and Madinah night counts, since
// the real split is not in the repo (recorded in the gaps report).
export function itinerary(
  pkg: TravelPackage
): { phase: string; detail: string }[] {
  const isHajj = /hajj/i.test(pkg.slug);
  const isUmrah = /umrah/i.test(pkg.slug) || /umrah/i.test(pkg.title);
  if (isHajj) {
    return [
      {
        phase: "Arrival and Makkah",
        detail:
          "Arrive in the Kingdom, transfer to your Makkah hotel, and perform Umrah before Hajj where your program includes it.",
      },
      {
        phase: "Days in Makkah",
        detail:
          "Pray in Masjid al-Haram and prepare for the days of Hajj with your trained group leaders.",
      },
      {
        phase: "Mina, Arafat, and Muzdalifah",
        detail:
          "Move to Mina, stand at Arafat on the ninth of Dhul Hijjah, and spend the night at Muzdalifah, guided at every step.",
      },
      {
        phase: "Return to Makkah",
        detail:
          "Complete the stoning, the sacrifice, Halq or Taqsir, and the Tawaf of Hajj.",
      },
      {
        phase: "Madinah",
        detail:
          "Travel to Madinah for prayers at Masjid an-Nabawi, the Rawdah, and guided Ziyarat.",
      },
      {
        phase: "Return home",
        detail:
          "Transfer to the airport for your return flight to Pakistan.",
      },
    ];
  }
  if (pkg.slug === "ramadan-umrah-special") {
    return [
      {
        phase: "Arrival in Makkah",
        detail:
          "Arrive in the Kingdom and transfer to your Makkah hotel with our ground team, in time for the night prayers.",
      },
      {
        phase: "Umrah and daily Taraweeh",
        detail:
          "Perform your Umrah, then settle into daily prayers and Taraweeh in Masjid al-Haram through the fasting days.",
      },
      {
        phase: "The last ten nights",
        detail:
          "Observe the last Ashra with Qiyam deep into the night and Itikaf on request, seeking Laylat al-Qadr on the odd nights.",
      },
      {
        phase: "Days in Madinah",
        detail:
          "Travel to Madinah for prayers at Masjid an-Nabawi, the Rawdah, and guided Ziyarat of Quba, Uhud, and Jannat al-Baqi.",
      },
      {
        phase: "Return home",
        detail:
          "Transfer to the airport for your return flight to Pakistan.",
      },
    ];
  }
  if (isUmrah) {
    return [
      {
        phase: "Arrival and transfer",
        detail:
          "Arrive in the Kingdom and transfer to your Makkah hotel with our ground team.",
      },
      {
        phase: "Umrah in Makkah",
        detail:
          "Enter Ihram, perform Tawaf around the Kaaba and Sa'i between Safa and Marwah, then complete Halq or Taqsir.",
      },
      {
        phase: "Days in Makkah",
        detail:
          "Pray your daily prayers in Masjid al-Haram, with time for extra Umrah and rest between prayers.",
      },
      {
        phase: "Transfer to Madinah",
        detail: "Travel to Madinah by road with our ground team.",
      },
      {
        phase: "Days in Madinah",
        detail:
          "Pray at Masjid an-Nabawi, visit the Rawdah, and join guided Ziyarat of the historical sites.",
      },
      {
        phase: "Return home",
        detail:
          "Transfer to the airport for your return flight to Pakistan.",
      },
    ];
  }
  return [
    {
      phase: "Arrival",
      detail:
        "Arrive at your destination, clear the visit visa, and transfer to your hotel with local support.",
    },
    {
      phase: "Guided sightseeing",
      detail:
        "Cover the main sights and excursions listed in your package with local guides.",
    },
    {
      phase: "Free time and add-ons",
      detail:
        "Enjoy free time, with optional excursions arranged on request.",
    },
    {
      phase: "Return home",
      detail:
        "Transfer to the airport for your return flight to Pakistan.",
    },
  ];
}

// Build a full 10 to 15 FAQ set for a detail page: the package-specific
// questions, plus tailored questions built from that package's real data.
// Generated questions are skipped when the base already covers the topic, so
// nothing repeats within the page, and every answer stays grounded in the repo.
export function detailFaqs(pkg: TravelPackage): Faq[] {
  // Ramadan uses "Package" as its visible name while the slug stays "special".
  const name =
    pkg.slug === "ramadan-umrah-special" ? "Ramadan Umrah Package" : pkg.title;
  const isUmrah = /umrah/i.test(pkg.slug) || /umrah/i.test(pkg.title);
  const isHajj = /hajj/i.test(pkg.slug);
  const isPilg = pkg.category === "Umrah & Hajj";
  const hotel = hotelHighlight(pkg);
  const deps = departureCities(pkg).join(" and ");
  const whoForList = detailContent[pkg.slug]?.whoFor ?? [];
  const base = detailContent[pkg.slug]?.faqs ?? [pricingFaq(name)];
  const baseText = base.map((f) => f.q.toLowerCase()).join(" ");
  const has = (re: RegExp) => re.test(baseText);
  const nearness =
    hotel && /walking/i.test(hotel)
      ? "within walking distance of the Haram"
      : hotel && /facing/i.test(hotel)
        ? "facing the Haram"
        : hotel && /haram/i.test(hotel)
          ? "near the Haram"
          : null;

  const cand: { when: boolean; f: Faq }[] = [
    {
      when: !has(/includ|cover/),
      f: {
        q: `What is included in the ${name}?`,
        a: `Every inclusion in the ${name} is listed above under what is included, from flights and the visa to hotels, ground transport, and guided ${isPilg ? "Ziyarat" : "sightseeing"}. Our desk confirms each item in writing before you pay, so the journey holds no surprises.`,
      },
    },
    {
      when: !has(/not included|exclud/),
      f: {
        q: `What is not included in the ${name}?`,
        a: `The ${name} excludes personal expenses such as shopping, anything not listed under what is included, optional excursions and upgrades, and travel insurance unless stated in your quote. Our team spells out every cost before you pay, so nothing appears later.`,
      },
    },
    {
      when: isPilg && !!nearness && !has(/hotel|haram|close|far|stay/),
      f: {
        q: `How close are the hotels to the Haram on the ${name}?`,
        a: `Hotels on the ${name} sit ${nearness}, so you reach your prayers with a short walk. Exact hotel names, star level, and room sharing are confirmed for your travel dates before you pay, since the closest options fill early.`,
      },
    },
    {
      when: isUmrah && !has(/sharing|room/),
      f: {
        q: `What room sharing options come with the ${name}?`,
        a: `Room sharing on the ${name} follows your group size and budget, arranged as quad, triple, or double to fit. Tell our desk how many travelers share a room, and we quote hotels near the Haram to match, confirmed for your dates before you pay.`,
      },
    },
    {
      when: isPilg && deps.length > 0 && !has(/cities|depart|fly from|peshawar/),
      f: {
        q: `Which cities does the ${name} depart from?`,
        a: `The ${name} departs from ${deps}, whichever carries the better fare and schedule for your dates. Our team arranges onward ground transport, and travelers from nearby towns coordinate airport pickup when they book.`,
      },
    },
    {
      when: isPilg && !has(/visa/),
      f: {
        q: `Does the ${name} include the Saudi visa?`,
        a: `Yes. The ${name} includes the Saudi ${isHajj ? "Hajj" : "Umrah e-"}visa, prepared and filed by our team. Verify the current rules at the official Saudi source before you travel, and our desk checks every page of your file so it clears without avoidable delays.`,
      },
    },
    {
      when: isUmrah && !has(/ziyarat/),
      f: {
        q: `Is guided Ziyarat part of the ${name}?`,
        a: `Guided Ziyarat in Makkah and Madinah is part of the ${name}. Our team plans visits to the historical sites around your prayers at Masjid al-Haram and Masjid an-Nabawi, with the exact schedule confirmed for your travel dates.`,
      },
    },
    {
      when: !isPilg && !has(/visa|flight/),
      f: {
        q: `Does the ${name} include the visa and flights?`,
        a: `Yes. The ${name} includes the visit visa and return flights, prepared and booked by our team. Hotels and sightseeing arrive in the same booking, and our desk checks every document before filing, so your visa clears without avoidable delays.`,
      },
    },
    {
      when: !isPilg && !has(/best|time|month|season/),
      f: {
        q: `What is the best time to travel on the ${name}?`,
        a: `The best time for the ${name} depends on weather, crowds, and budget. Cooler, quieter months keep sightseeing comfortable, while peak season books earliest. Tell our team your window, and our desk builds the trip around the dates that suit you.`,
      },
    },
    {
      when: whoForList.length > 0 && !has(/suited|for\?|families/),
      f: {
        q: `Who is the ${name} best for?`,
        a: `The ${name} suits ${whoForList
          .slice(0, 3)
          .join(", ")
          .toLowerCase()}. Share your group size and any needs with our desk, and we shape the arrangements around them, from connected rooms to airport assistance for elders.`,
      },
    },
    {
      when: !has(/duration|how long|days/),
      f: {
        q: `How long is the ${name}?`,
        a: `The ${name} runs ${pkg.duration}, ${isPilg ? "split across Makkah and Madinah" : "across the destinations in your itinerary"}. The exact day split is confirmed for your travel dates. See the sample itinerary above for the typical flow, from arrival to your safe return home.`,
      },
    },
    {
      when: true,
      f: {
        q: `What documents do I need for the ${name}?`,
        a: `The ${name} needs a passport valid for at least six months, your national identity card, passport photographs, and the ${isPilg ? "Umrah or Hajj visa" : "visit visa"}, which our desk prepares and files.${isPilg ? " A vaccination certificate applies where Saudi authorities require it." : ""} Our team checks every page before submission.`,
      },
    },
    {
      when: !has(/book|how do i get/),
      f: {
        q: `How do I book the ${name}?`,
        a: `Booking the ${name} starts with one WhatsApp message or a visit to the Charsadda office. Our team sends options and a quote for your exact dates, a deposit secures your seats and rooms, and the balance settles before departure, every amount confirmed in writing.`,
      },
    },
    {
      when: !has(/pay|deposit/),
      f: {
        q: `How do payments and deposits work on the ${name}?`,
        a: `Payment for the ${name} runs through bank transfer or in person at the Charsadda office. A deposit holds your seats and rooms once you confirm, and the balance settles before departure, with no hidden charges added later and every amount confirmed in writing.`,
      },
    },
    {
      when: true,
      f: {
        q: `What support do I get during the ${name}?`,
        a: `Our desk stays with you throughout the ${name}, on WhatsApp from your first inquiry to your safe return. ${isPilg ? "Trained group leaders travel with pilgrimage groups, and o" : "O"}ur Charsadda office answers questions in person, so support never depends on a distant call center.`,
      },
    },
  ];

  const out: Faq[] = [...base];
  const seen = new Set(base.map((f) => f.q.toLowerCase().replace(/[^a-z0-9]/g, "")));
  for (const c of cand) {
    if (!c.when) continue;
    const key = c.f.q.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c.f);
    if (out.length >= 15) break;
  }
  return out;
}

// Content for any package, with a safe fallback for admin added slugs.
export function getDetail(pkg: TravelPackage): DetailContent {
  const mapped = detailContent[pkg.slug];
  if (mapped) return mapped;
  const base = pkg.description
    ? pkg.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    : `${pkg.title} from Pakistan, arranged end to end by our team across ${pkg.duration}.`;
  return {
    overview: base,
    whoFor: [
      "Travelers from Pakistan seeking a complete, arranged trip",
      "Families and groups booking together",
      "First time travelers who want documents handled",
    ],
    faqs: [
      pricingFaq(pkg.title),
      {
        q: `What is included in the ${pkg.title}?`,
        a: `The ${pkg.title} covers the items listed under what is included on this page. Our desk confirms every inclusion in writing before you pay, so the journey holds no surprises. Message our team for the current details and a quote for your exact dates.`,
      },
    ],
  };
}
