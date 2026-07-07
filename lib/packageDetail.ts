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
      "Economy Umrah Package from Pakistan suits first time and budget conscious pilgrims who want a complete, guided journey at an honest cost. Our team arranges return airfare from Peshawar or Islamabad, comfortable economy hotels within walking or shuttle distance of the Haram, quad or triple sharing, the Saudi e-visa through Nusuk, ground transport between Makkah and Madinah, and guided Ziyarat at both holy sites. Fifteen days allows unhurried worship across both cities, with our desk handling every document and booking so you focus on your prayers.",
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
        a: "Economy Umrah covers return airfare from Peshawar or Islamabad, comfortable economy hotels within walking or shuttle distance of the Haram, quad or triple sharing, the Saudi e-visa through Nusuk, ground transport between Makkah and Madinah, and guided Ziyarat at both holy sites. Our desk confirms every inclusion in writing before you pay, so nothing on the journey surprises you.",
      },
      {
        q: "How close are the Economy Umrah hotels to the Haram?",
        a: "Economy Umrah books hotels within walking or shuttle distance of the Haram, a short walk or ride to the mataf for your daily prayers. Our team names the exact hotel and its distance for your travel dates before you confirm, since availability changes through the year and the closest options book early.",
      },
      {
        q: "Which cities does the Economy Umrah depart from?",
        a: "Economy Umrah flights depart from Bacha Khan International in Peshawar or Islamabad International, whichever carries the better fare and schedule for your dates. Our desk arranges ground transport onward, and travelers from Charsadda, Tangi, Shabqadar, and nearby towns coordinate airport pickup with our team when they book.",
      },
      {
        q: "Is the Economy Umrah Package worth it?",
        a: "The Economy Umrah Package suits pilgrims who want a complete, guided Umrah at the lowest honest cost. You trade five star comfort and the very closest hotels for quad or triple sharing and a short walk or shuttle to the Haram, while the visa, flights, ground transport, and guided Ziyarat stay fully covered. First time and budget conscious pilgrims get the full spiritual journey without the premium price.",
      },
      {
        q: "How is the Economy Umrah different from the Premium package?",
        a: "Economy Umrah books economy tier hotels within walking or shuttle distance of the Haram with quad or triple sharing, while Premium books five star hotels near or facing the Haram with smaller rooms, private transport, and daily meals. Both cover the visa, return flights, and guided Ziyarat. See how this compares below, then choose the tier that fits your budget and comfort.",
      },
      {
        q: "What is the difference between quad and triple sharing?",
        a: "Quad sharing places four pilgrims in one room and carries the lowest cost, while triple sharing places three and costs a little more for extra space. Economy Umrah offers both, so tell our desk how your group prefers to share, and we confirm the room and the hotel with your quote.",
      },
      {
        q: "Does the Economy Umrah Package include flights?",
        a: "Yes. The Economy Umrah Package includes return airfare from Peshawar or Islamabad, booked on the carrier with the best fare and schedule for your dates. Flights, the Saudi e-visa, hotels, and ground transport arrive in one booking, so you travel without arranging any part separately.",
      },
      {
        q: "Are meals included in the Economy Umrah Package?",
        a: "Economy packages are usually room only or with breakfast, since keeping meals flexible holds the cost down near the Haram, where affordable food sits close by. Our desk confirms the exact meal plan for your hotel with your quote, so you know before you pay what is arranged and what you cover yourself.",
      },
      {
        q: "Do you offer the Economy Umrah for a family or two persons on a budget?",
        a: "Yes. The Economy Umrah Package works for couples, small families, and two person bookings, with quad or triple rooms arranged to keep the cost per pilgrim low. Tell our desk your group size and any needs, from connected rooms to airport assistance for elders, and we shape the booking around them.",
      },
      {
        q: "Do women need a Mehram for the Economy Umrah?",
        a: "Saudi rules on women travelling without a Mehram have shifted in recent years, with women joining organized groups under set conditions. Rules move year to year, so confirm the current position for your dates at the official Saudi source. Our desk arranges group travel for women where the rules allow, with the details set at booking.",
      },
      {
        q: "When is Umrah cheaper, and are Rajab and Shaban good months?",
        a: "Umrah costs less outside Ramadan and the Hajj season, when demand and hotel rates ease. Rajab and Shaban, the months before Ramadan, bring calmer crowds and lower fares while the reward of Umrah stays the same. Our desk quotes the current best price for your dates, so ask about off peak windows to stretch a budget further.",
      },
      {
        q: "How many days is the Economy Umrah, and how does it compare to 21 days?",
        a: "The Economy Umrah Package runs 15 days across Makkah and Madinah, enough for unhurried worship at both Harams and full guided Ziyarat. Longer 21 day packages add more nights for repeat Umrah and a slower pace, at a higher cost. The exact night split between the two cities is confirmed for your travel dates.",
      },
    ],
  },

  "premium-umrah-21-days": {
    overview:
      "Premium Umrah Package from Pakistan serves pilgrims who want a luxury, first class stay and deep comfort alongside their worship. Our team books five star hotels near or facing the Haram in Makkah and Madinah, direct flights with checked baggage, private transport with a personal guide, and a daily breakfast and dinner buffet. Twenty one days gives a calm, unhurried stay across both cities, with the Saudi Umrah e-visa processed through Nusuk and every detail handled by our desk from departure to safe return.",
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
        q: "Is a 21 day Umrah worth it?",
        a: "A 21 day Premium Umrah gives calm, unhurried worship, with time for repeated Umrah, daily prayers in both Harams, and full Ziyarat without rushing between cities. Five star hotels near the Haram and private transport suit families, elderly pilgrims, and repeat pilgrims who value comfort and a slower pace. Shorter durations are arranged on request for those with less time.",
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
        q: "Which Ashra is best for Umrah in Ramadan?",
        a: "Each Ashra of Ramadan carries its own draw. The first and middle ten nights bring calmer crowds and a steadier pace, while the last Ashra holds Laylat al-Qadr, the Night of Power, and Itikaf, at the highest demand and cost. Tell our desk which nights matter most to you, and we build the stay around them.",
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
      {
        q: "Is Ramadan Umrah crowded?",
        a: "Ramadan draws the largest crowds of the year at both Harams, and the last ten nights peak hardest. Booking early holds a hotel close to the Haram, which shortens the walk through the busiest nights. For a calmer, lower cost stay, ask our desk about Umrah in Shawwal after Eid ul Fitr.",
      },
    ],
  },

  "hajj-package": {
    moraNote: true,
    overview:
      "Hajj Package from Pakistan delivers a complete, guided pilgrimage with trained group leaders and scholars. Our team supports government Hajj scheme registration through MORA, plus Mina and Arafat camp accommodation, Muzdalifah movement, and pre-departure training so you arrive prepared for every rite. Most pilgrims from Pakistan perform Hajj al Tamattu, joining Umrah and Hajj in one journey, with the Ifrad and Qiran forms also arranged on request. Quotas stay limited every year, so early registration matters. For the government scheme, register free on the official MORA portal, then choose our private Hajj route for full document support and guided camp services from departure to safe return.",
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
        a: "Hajj trip length varies by scheme, airline schedule, and whether you travel Makkah first or Madinah first. Our desk confirms the exact day count and the Makkah, Madinah, and Aziziyah split for your booking, since the dates move with the Hajj calendar each year. Transfers between Makkah and Madinah run by road or on the Haramain high speed rail where your package includes it. Message our team with your preferred window for the current options.",
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
        a: "Saudi rules on women travelling without a Mehram have shifted from one cycle to the next, with women joining organized groups under set conditions. Rules move year to year, so confirm the current position for your cycle at the official Saudi source. Our desk arranges group travel for women where the rules allow, with the details set at booking.",
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
      pricingFaq("Dubai Tour Package"),
      {
        q: "Is a UAE visa required for the Dubai tour, and is it included?",
        a: "Yes, Pakistani travelers need a UAE visit visa for Dubai, and the Dubai Tour Package includes it. Our team prepares and files your visa with the rest of your documents, and you verify the current rules at the official UAE government portal. Flights, hotel, and tours arrive in the same booking with no separate arrangements to chase.",
      },
      {
        q: "What is included in the Dubai Tour Package?",
        a: "The Dubai Tour Package covers return airfare, the UAE visit visa, a four star hotel with breakfast, a desert safari with BBQ dinner, a Burj Khalifa and Dubai Mall visit, and a Dubai Marina dhow cruise. Five days and four nights leave time for the city's landmark sights at a relaxed pace.",
      },
      {
        q: "How many days in Dubai is enough?",
        a: "Five days and four nights cover Dubai's headline sights, the city tour, the Burj Khalifa, the desert safari, and a Marina cruise, without rushing. Travelers who want Abu Dhabi, Atlantis, or extra beach days add a night or two, which our desk arranges on request.",
      },
      {
        q: "What is the best time to visit Dubai?",
        a: "November to March brings cooler, dry weather that suits sightseeing and the desert safari, and it is the peak season. Summer runs hotter and quieter, with lower rates and indoor attractions like the malls and aquariums. Tell our desk your window, and we build the trip around it.",
      },
      {
        q: "Is the Dubai tour family friendly?",
        a: "Yes. The Dubai Tour Package suits families, couples, and honeymooners, with a four star hotel, a desert safari, and the Burj Khalifa and Dubai Mall on the plan. Our team adjusts the pace for children and elders, and arranges the UAE visit visa for every traveler in your group.",
      },
      {
        q: "Which attractions will I see on the Dubai tour?",
        a: "The Dubai Tour Package takes in the Burj Khalifa, Dubai Mall, a desert safari in the dunes, and a Dubai Marina dhow cruise. Optional excursions to Palm Jumeirah, Atlantis Aquaventure, and Abu Dhabi with the Sheikh Zayed Grand Mosque are arranged on request.",
      },
      {
        q: "Do you customize the Dubai tour or add another country?",
        a: "Yes. Our desk shapes the Dubai tour around your dates, hotel choice, and excursions, and pairs Dubai with Baku, Turkey, or the Maldives for a combo trip. Tell us your plan, and we quote the customized route for your group.",
      },
      {
        q: "Which cities do you fly from for the Dubai tour?",
        a: "Our desk arranges Dubai flights from Karachi, Lahore, Islamabad, or Peshawar, on the carrier with the best fare and schedule for your dates. Travelers from Charsadda and nearby towns depart from Peshawar or Islamabad, with airport pickup coordinated when you book.",
      },
      {
        q: "How do I get around in Dubai?",
        a: "Private transfers and guided tours cover the sightseeing days, with airport pickups and hotel transfers arranged by our team. Between the planned days you explore Dubai on the clean, driverless Metro or by taxi and ride hailing at your own pace, with our desk on WhatsApp throughout.",
      },
      {
        q: "Is the Dubai tour good for a honeymoon?",
        a: "Dubai works well for a honeymoon, with a four star stay, a desert safari, a Marina dhow cruise, and time along Jumeirah Beach. Our desk arranges a couples pace and optional upgrades, from a higher star hotel to a private tour, quoted with your dates.",
      },
      {
        q: "Do I travel in a group or a private tour on the Dubai package?",
        a: "Both suit the Dubai Tour Package. Join a group departure for the friendliest price, or ask our desk for a private, customized tour with your own vehicle and pace. Tell us your group size and preference, and we quote the option that fits.",
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
        q: "Is a Turkey e visa required, and is it included?",
        a: "Yes, Pakistani travelers need a Turkey visa, and the tour includes e visa support. Our team checks eligibility and prepares your file, filing the e visa for eligible travelers and guiding the sticker visa for others. Verify the current rules at the official Turkey e visa portal, and flights, tours, and halal meals arrive in the same booking.",
      },
      {
        q: "What is included in the Turkey tour package?",
        a: "The Turkey tour covers return airfare, Turkey e visa support, hotels with breakfast, guided tours of Istanbul's old city, a Cappadocia visit with an optional hot air balloon ride, a Bosphorus cruise, domestic flights between the cities, and halal meals throughout. Seven days and six nights balance Ottoman history in Istanbul with the valleys of Cappadocia.",
      },
      {
        q: "How many days in Turkey is enough?",
        a: "Seven days and six nights cover Istanbul and Cappadocia at a relaxed pace, the old city, the Bosphorus, and the fairy chimneys, without rushing. Travelers who add Antalya, Pamukkale, or Ephesus extend by a few nights, which our desk arranges on request.",
      },
      {
        q: "What is the best time to visit Turkey?",
        a: "Spring, from April to June, and autumn, from September to October, bring the most comfortable weather for walking Istanbul and flying the Cappadocia balloons. Summer runs warmer and busier, and winter turns Cappadocia snowy and quiet. Tell our team your window, and our desk builds the trip around it.",
      },
      {
        q: "Is the hot air balloon ride in Cappadocia included?",
        a: "The Cappadocia hot air balloon ride is an optional add on rather than a fixed inclusion, since flights depend on weather and demand. Our team books it alongside your package when you request it, and confirms timing on the ground so you catch a clear sunrise over the valleys.",
      },
      {
        q: "How do I get around in Turkey?",
        a: "Private transfers and guided tours cover the sightseeing days, with the Istanbul to Cappadocia leg by domestic flight or overnight coach arranged by our team. In Istanbul you also ride the trams, ferries, and the metro at your own pace, with our desk on WhatsApp throughout.",
      },
      {
        q: "Is the Turkey tour good for a honeymoon?",
        a: "Turkey suits honeymooners, with the Bosphorus, the Cappadocia valleys, and an optional dawn balloon flight. Our desk arranges a couples pace, a cave hotel in Cappadocia on request, and quiet dinners, quoted with your dates. Families and first time travelers get the same care at their own pace.",
      },
      {
        q: "Do you customize the Turkey tour or add Antalya and Pamukkale?",
        a: "Yes. Our desk shapes the tour around your dates, hotel choice, and excursions, and extends the route to Antalya, Pamukkale, Ephesus, or Bursa on request. Tell us your plan, and we quote the customized route for your group.",
      },
      {
        q: "Do you offer an Umrah and Turkey combo?",
        a: "Yes. Our desk pairs an Umrah with a Turkey stopover for pilgrims who want to visit Istanbul on the same journey. Share your dates and group size, and we quote the combined route, with the Saudi and Turkey documents both handled by our team.",
      },
      {
        q: "How do I travel between Istanbul and Cappadocia?",
        a: "Domestic flights connect Istanbul and Cappadocia in about ninety minutes, and the tour includes them so you keep more time for sightseeing. Our team books the internal flights and the airport transfers, so your group moves between the cities without arranging anything separately.",
      },
      {
        q: "What documents do I need for the Turkey tour?",
        a: "The Turkey tour needs a passport valid for at least six months, your national identity card, passport photographs, and the Turkey visa, which our desk prepares and files. A confirmed return ticket and hotel booking are arranged inside your package, and our team checks every page before submission.",
      },
    ],
  },

  "baku-5-days": {
    overview:
      "Baku Azerbaijan from Pakistan is a short, easy escape to the Land of Fire, five days and four nights on the Caspian shore. Our team arranges return airfare, the Azerbaijan e visa, a city center hotel with breakfast, a guided tour of the Icherisheher Old City and the Flame Towers, the fire sites at Ateshgah and Yanardag with the Gobustan mud volcanoes, and a full Gabala day with the Tufandag cable car. Walkable streets and a simple e visa make Baku a smooth first trip abroad for couples and families traveling from Pakistan.",
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
      {
        q: "How many days do I need for a Baku tour?",
        a: "Five days and four nights cover Baku well, the Icherisheher Old City and the Flame Towers, the Gobustan and Absheron fire sites, and a full Gabala day. Add a night or two for Sheki and its Khan Palace or the Shahdag resort. Tell our desk your dates and we shape the length around them.",
      },
      {
        q: "What is the best time to visit Baku?",
        a: "April to June and September to October bring mild, comfortable weather for sightseeing. Summer runs warm and lively along Baku Boulevard, while winter is cold and opens the Shahdag ski season. Share your travel window and our team plans the trip around the season you choose.",
      },
      {
        q: "What are the fire sites on the Baku tour?",
        a: "The fire sites are the Ateshgah Fire Temple, built around a natural gas flame on the Absheron peninsula, and Yanardag, a hillside that has burned for centuries. Both sit a short drive from the city and give Azerbaijan its name, the Land of Fire. The Absheron day covers them alongside Gobustan.",
      },
      {
        q: "What does the Gabala day trip include?",
        a: "The Gabala day trip travels into the Caucasus foothills for the Tufandag cable car and its mountain views, with a stop at Nohur Lake. In the green season the route often adds the Yeddi Gozal waterfalls. Our desk confirms the exact stops for your travel dates before you go.",
      },
      {
        q: "How do I get around in Baku?",
        a: "Private transfers and guided tours cover the sightseeing days and the day trips to Gobustan and Gabala, with airport pickups arranged by our team. The compact Old City and Baku Boulevard are walkable, and the Baku metro is simple for short hops, with our desk on WhatsApp throughout.",
      },
      {
        q: "Is the Baku tour suitable for a honeymoon?",
        a: "Baku suits honeymooners, with the Old City lanes, Baku Boulevard along the Caspian, the Flame Towers light show, and a mountain day in Gabala. Our team arranges a comfortable hotel and a relaxed pace, and adds quiet dinners or extra Gabala nights on request for couples traveling from Pakistan.",
      },
      {
        q: "Do you customize the Baku itinerary?",
        a: "Yes. Our desk adds Sheki with its Khan Palace and Caravanserai, the Shahdag resort, extra Gabala nights, or a slower city pace, and builds the days around your group. Share how many travelers and what you want to see, and we send a plan and a quote for your exact dates.",
      },
      {
        q: "Do you offer a Dubai and Baku combined tour?",
        a: "Yes. Our desk builds a Dubai plus Baku trip in one booking, pairing the Dubai city and desert with the Baku Old City and fire sites. The route, the nights in each city, and the flights are arranged together, so tell us your dates and we quote the combined tour for your group.",
      },
      {
        q: "Which airlines fly to Baku from Pakistan?",
        a: "Our desk books Baku flights on the carrier with the best fare and schedule for your dates, among Azerbaijan Airlines, Pegasus, and Qatar Airways, connecting through the Gulf or Istanbul. Travelers depart from Karachi, Lahore, Islamabad, or Peshawar, with airport transfers arranged when you book.",
      },
      {
        q: "Is Baku a Muslim friendly destination with halal food?",
        a: "Azerbaijan is a majority Muslim country, and halal food is widely available across Baku. Mosques include the Bibi Heybat and the Taza Pir, and prayer is simple to arrange around the touring. Our desk plans meals and stops so travelers from Pakistan stay comfortable throughout the trip.",
      },
    ],
  },

  "malaysia-thailand-8-days": {
    overview:
      "Malaysia and Thailand Combo from Pakistan brings two countries into one eight day, seven night booking. Our team arranges Kuala Lumpur with the Petronas Twin Towers and Batu Caves, a Genting Highlands day, and Bangkok with the Grand Palace and its riverside temples, plus the Malaysia and Thailand e visas, hotels, and the internal flight. An optional Phuket beach extension adds the islands. City lights and beaches sit side by side, a full Far East experience for families and couples traveling from Pakistan.",
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
        a: "The Phuket beach extension is an optional add on to the Kuala Lumpur and Bangkok route. Our team arranges the extra nights, transfers, and beach stay when you request it, and confirms the updated itinerary in writing so your full trip stays clear from the start.",
      },
      {
        q: "Is a visa required for Malaysia and Thailand from Pakistan?",
        a: "Yes, Pakistani travelers need entry for both, the Malaysia e visa and the Thailand e visa. Our team prepares and files each, checking every document first so the files clear cleanly. Both visas arrive inside your package, so there is no separate embassy running to arrange.",
      },
      {
        q: "How many days do I need for the Malaysia and Thailand tour?",
        a: "Eight days and seven nights cover Kuala Lumpur and Bangkok with a Genting Highlands day, a comfortable pace for both cities. Add two or three nights for a Phuket or Krabi beach stay, or a Singapore leg. Tell our desk your dates and we shape the length around them.",
      },
      {
        q: "What is the best time to visit Malaysia and Thailand?",
        a: "November to February is the cooler, drier window across both countries and the most comfortable for sightseeing. The monsoon months bring rain and lower rates. Share your travel window and our team plans the route and the cities around the season you choose.",
      },
      {
        q: "Is halal food available in Malaysia and Thailand?",
        a: "Malaysia is a Muslim majority country, so halal food is widely available across Kuala Lumpur and Genting. In Thailand, halal restaurants sit in the tourist areas of Bangkok and Phuket, and our desk plans meals and stops so travelers from Pakistan stay comfortable throughout the trip.",
      },
      {
        q: "Is the Malaysia and Thailand tour good for families?",
        a: "The combo suits families, with the Petronas Towers and Batu Caves in Kuala Lumpur, the theme parks of Genting Highlands, the temples and river of Bangkok, and easy beaches on the Phuket extension. Our team sets a steady pace and connected rooms, and adjusts the days for younger children on request.",
      },
      {
        q: "Do you customize the Malaysia and Thailand itinerary?",
        a: "Yes. Our desk adds a Phuket or Krabi beach stay, a Singapore leg, extra Genting time, or a slower pace, and builds the days around your group. Share how many travelers and what you want to see, and we send a plan and a quote for your exact dates.",
      },
      {
        q: "Which airlines fly to Kuala Lumpur and Bangkok from Pakistan?",
        a: "Our desk books the combo on the carrier with the best fare and schedule for your dates, among Thai Airways, Malaysia Airlines, AirAsia, Emirates, and Qatar Airways, with the internal Kuala Lumpur to Bangkok flight included. Travelers depart from Karachi, Lahore, Islamabad, or Peshawar.",
      },
      {
        q: "Is the Malaysia and Thailand tour suitable for a honeymoon?",
        a: "The combo works well for honeymooners, pairing the city lights of Kuala Lumpur and Bangkok with quiet beaches on the Phuket extension. Our team arranges a comfortable hotel, a relaxed pace, and add ons like an island day or a couples dinner on request for travelers from Pakistan.",
      },
    ],
  },

  malaysia: {
    overview:
      "Malaysia Tour Package from Pakistan is one of the easiest first trips abroad for a Muslim family, six days and five nights in a Muslim majority country where halal food is everywhere and mosques sit on every route. Our team arranges return airfare, the Malaysia e visa, a city hotel with breakfast, a Kuala Lumpur city tour with the Petronas Twin Towers and Batu Caves, a Genting Highlands day, and Putrajaya, with Langkawi as an optional island add on. Green, walkable, and welcoming, Kuala Lumpur suits families, couples, and first time travelers from Pakistan.",
    whoFor: [
      "Muslim families wanting a halal friendly first trip abroad",
      "Couples and honeymooners seeking city and nature together",
      "First time international travelers from Pakistan",
      "Groups who want an easy visa and short flights",
    ],
    faqs: [
      pricingFaq("Malaysia Tour Package"),
      {
        q: "Is a Malaysia visa required for Pakistani travelers?",
        a: "Yes, Pakistani passport holders need the Malaysia e visa or the eNTRI entry, applied online before travel. Our team prepares and files it, checking every document first so the file clears cleanly. The visa arrives inside your package, so there is no separate embassy visit to arrange.",
      },
      {
        q: "Is Malaysia halal and Muslim friendly?",
        a: "Malaysia is a Muslim majority country, so halal food is everywhere and mosques like the National Mosque and the Putra Mosque sit on the tour route. Prayer is simple to fit around the sightseeing, which makes Malaysia one of the most comfortable first trips abroad for a family from Pakistan.",
      },
      {
        q: "How many days do I need for a Malaysia tour?",
        a: "Six days and five nights cover Kuala Lumpur, a Genting Highlands day, and Putrajaya at a comfortable pace. Add two or three nights for Langkawi, Malacca, or a Penang leg. Tell our desk your dates and we shape the length around them.",
      },
      {
        q: "What is the best time to visit Malaysia?",
        a: "Malaysia is warm and tropical year round, so any month works. Brief afternoon showers pass quickly, and the drier stretches and school holidays are busiest. Share your travel window and our team plans the days and the cities around it.",
      },
      {
        q: "What is included in the Malaysia package?",
        a: "The Malaysia package covers return airfare, the Malaysia e visa, a city hotel with breakfast, the Kuala Lumpur city tour with the Petronas Twin Towers and Batu Caves, a Genting Highlands day, Putrajaya, transfers, and an English speaking guide. Optional Langkawi and Malacca add ons arrive on request.",
      },
      {
        q: "Is Malaysia good for families?",
        a: "Malaysia suits families, with the Petronas Towers and Batu Caves in Kuala Lumpur, the theme parks and cable car of Genting Highlands, halal food everywhere, and short, easy transfers. Our team sets a steady pace and connected rooms, and adjusts the days for younger children on request.",
      },
      {
        q: "How do I get around on the Malaysia tour?",
        a: "Private transfers and guided tours cover the sightseeing days, with airport pickups and hotel transfers arranged by our team. Between the planned days you explore Kuala Lumpur on foot or by the easy MRT and monorail at your own pace, with our desk on WhatsApp throughout.",
      },
      {
        q: "Do you customize the Malaysia itinerary?",
        a: "Yes. Our desk adds Langkawi, Malacca, Penang, or a Singapore leg, extra Genting time, or a slower pace, and builds the days around your group. Share how many travelers and what you want to see, and we send a plan and a quote for your exact dates.",
      },
      {
        q: "Which airlines fly to Kuala Lumpur from Pakistan?",
        a: "Our desk books Kuala Lumpur flights on the carrier with the best fare and schedule for your dates, among Malaysia Airlines, AirAsia, Thai Airways, Emirates, and Qatar Airways. Travelers depart from Karachi, Lahore, Islamabad, or Peshawar, with airport transfers arranged when you book.",
      },
      {
        q: "Is the Malaysia tour suitable for a honeymoon?",
        a: "Malaysia works well for honeymooners, pairing the city lights of Kuala Lumpur with the cool hills of Genting and the beaches of an optional Langkawi add on. Our team arranges a comfortable hotel, a relaxed pace, and quiet dinners or an island day on request for couples traveling from Pakistan.",
      },
      {
        q: "Do you offer Malaysia combined with Thailand or Singapore?",
        a: "Yes. Our desk builds Malaysia with Thailand or with Singapore, or all three in one trip, pairing Kuala Lumpur and Genting with Bangkok and Pattaya or the Marina Bay of Singapore. See our combo tours, and tell us your dates for a plan and a quote across the countries you choose.",
      },
    ],
  },

  thailand: {
    overview:
      "Thailand Tour Package from Pakistan pairs the temples of Bangkok with the beaches of Pattaya across six days and five nights. Our team arranges return airfare, the Thailand visa, a city hotel with breakfast, the Grand Palace and the riverside temples, a Coral Island day, Nong Nooch and the Sanctuary of Truth, with Phuket and the Phi Phi Islands as an optional southern add on. Halal food is widely available in Bangkok, so a Muslim traveler from Pakistan eats comfortably, and the city lights, gold temples, and easy beaches make Thailand a favourite for families and couples.",
    whoFor: [
      "Families wanting temples, culture, and beaches together",
      "Couples and honeymooners seeking city and coast",
      "First time Far East travelers from Pakistan",
      "Groups who want a full week of sightseeing",
    ],
    faqs: [
      pricingFaq("Thailand Tour Package"),
      {
        q: "Is a Thailand visa required for Pakistani travelers?",
        a: "Yes, Pakistani passport holders need a Thailand visa, most easily the Thailand e visa applied online, since the visa exemption for short stays does not cover Pakistani passports. The rules move from cycle to cycle, so verify the current position at the official Thai source. Our team prepares and files the visa so it clears cleanly.",
      },
      {
        q: "How many days do I need for a Thailand tour?",
        a: "Six days and five nights cover Bangkok and Pattaya at a comfortable pace, the temples, a Coral Island day, and the Pattaya sights. Add two or three nights for Phuket, Krabi, or the islands. Tell our desk your dates and we shape the length around them.",
      },
      {
        q: "What is the best time to visit Thailand?",
        a: "November to February is the cool, dry season and the most comfortable for sightseeing and the beaches. The green season from June brings short showers and lower rates. Share your travel window and our team plans the route and the cities around it.",
      },
      {
        q: "What is included in the Thailand package?",
        a: "The Thailand package covers return airfare, the Thailand visa, a city hotel with breakfast, the Bangkok temples and Grand Palace tour, a Coral Island day at Pattaya, Nong Nooch and the Sanctuary of Truth, transfers, and an English speaking guide. Optional Phuket and island add ons arrive on request.",
      },
      {
        q: "Is Thailand good for families?",
        a: "Thailand suits families, with the gold temples and river of Bangkok, the beaches and Coral Island of Pattaya, and easy add ons like SEA LIFE Ocean World. Our team sets a steady pace and connected rooms, and adjusts the days for younger children on request.",
      },
      {
        q: "Is halal food available in Thailand?",
        a: "Halal food is widely available in Bangkok, with halal restaurants in the main tourist and shopping areas and near the mosques of the city. Our desk plans meals and stops so travelers from Pakistan stay comfortable across Bangkok and Pattaya throughout the trip.",
      },
      {
        q: "How do I get around on the Thailand tour?",
        a: "Private transfers and guided tours cover the sightseeing days and the Bangkok to Pattaya drive, with airport pickups arranged by our team. Between the planned days you explore Bangkok on foot or by the BTS Skytrain and river boats at your own pace, with our desk on WhatsApp throughout.",
      },
      {
        q: "Do you customize the Thailand itinerary?",
        a: "Yes. Our desk adds Phuket, Krabi, or the islands, a Chiang Mai leg, extra Pattaya time, or a slower pace, and builds the days around your group. Share how many travelers and what you want to see, and we send a plan and a quote for your exact dates.",
      },
      {
        q: "Which airlines fly to Bangkok from Pakistan?",
        a: "Our desk books Bangkok flights on the carrier with the best fare and schedule for your dates, among Thai Airways, Emirates, Qatar Airways, and other Gulf carriers. Travelers depart from Karachi, Lahore, Islamabad, or Peshawar, with airport transfers arranged when you book.",
      },
      {
        q: "Is the Thailand tour suitable for a honeymoon?",
        a: "Thailand works well for honeymooners, pairing the temples and river of Bangkok with the beaches of Pattaya or an optional Phuket and Krabi leg. Our team arranges a comfortable hotel, a relaxed pace, and quiet dinners or an island day on request for couples traveling from Pakistan.",
      },
      {
        q: "Do you offer Thailand combined with Malaysia or Singapore?",
        a: "Yes. Our desk builds Thailand with Malaysia, or all three with Singapore, in one trip, pairing Bangkok and Pattaya with Kuala Lumpur and Genting or the Marina Bay of Singapore. See our combo tours, and tell us your dates for a plan and a quote across the countries you choose.",
      },
    ],
  },

  singapore: {
    overview:
      "Singapore Tour Package from Pakistan is a compact, easy trip through one of the cleanest, safest cities in the world, five days and four nights on the bay. Our team arranges return airfare, the Singapore visa, a city hotel with breakfast, a city tour with the Merlion and Gardens by the Bay, a full Sentosa day with Universal Studios, and the Night Safari. Green streets, world class attractions, and simple transit make Singapore a smooth first trip abroad for families and couples traveling from Pakistan.",
    whoFor: [
      "Families wanting theme parks and a safe, easy city",
      "Couples seeking a short, polished getaway",
      "First time international travelers from Pakistan",
      "Travelers pairing Singapore with Malaysia",
    ],
    faqs: [
      pricingFaq("Singapore Tour Package"),
      {
        q: "Is a Singapore visa required for Pakistani travelers?",
        a: "Yes, Pakistani passport holders need a Singapore visa, applied through an authorized agent under the official system. Our team prepares and files the application, checking every document first so it clears cleanly. Verify the current rules at the official Singapore source before you travel.",
      },
      {
        q: "How many days do I need for a Singapore tour?",
        a: "Five days and four nights cover the city, a full Sentosa day, and the Night Safari at a comfortable pace. Add a night for more Sentosa time or a Malaysia leg across the causeway. Tell our desk your dates and we shape the length around them.",
      },
      {
        q: "What is the best time to visit Singapore?",
        a: "Singapore is warm and tropical year round, so any month works. Brief afternoon showers pass quickly, and the year end and school holidays are busiest. Share your travel window and our team plans the days and the attractions around it.",
      },
      {
        q: "What is included in the Singapore package?",
        a: "The Singapore package covers return airfare, the Singapore visa, a city hotel with breakfast, a city tour with the Merlion and Gardens by the Bay, a Sentosa day, the Night Safari, transfers, and an English speaking guide. Universal Studios and other attraction tickets arrive on request.",
      },
      {
        q: "Is Singapore good for families?",
        a: "Singapore suits families, with Universal Studios and the SEA Aquarium on Sentosa, Gardens by the Bay, the Night Safari, and clean, safe streets with easy transit. Our team sets a steady pace and connected rooms, and adjusts the days for younger children on request.",
      },
      {
        q: "Is halal food available in Singapore?",
        a: "Halal certified food is available across Singapore, with outlets in the malls and hawker centres and a cluster in the Kampong Glam and Arab Street area around the Sultan Mosque. Our desk plans meals and stops so travelers from Pakistan stay comfortable throughout the trip.",
      },
      {
        q: "How do I get around on the Singapore tour?",
        a: "Private transfers and guided tours cover the sightseeing days and Sentosa, with airport pickups arranged by our team. Between the planned days you explore the city on the clean, simple MRT at your own pace, with our desk on WhatsApp throughout.",
      },
      {
        q: "Do you customize the Singapore itinerary?",
        a: "Yes. Our desk adds a second Sentosa day, Universal Studios tickets, a Malaysia leg across the causeway, or a slower pace, and builds the days around your group. Share how many travelers and what you want to see, and we send a plan and a quote for your exact dates.",
      },
      {
        q: "Which airlines fly to Singapore from Pakistan?",
        a: "Our desk books Singapore flights on the carrier with the best fare and schedule for your dates, among Singapore Airlines, Emirates, Qatar Airways, and other Gulf carriers. Travelers depart from Karachi, Lahore, Islamabad, or Peshawar, with airport transfers arranged when you book.",
      },
      {
        q: "Do you offer Singapore combined with Malaysia or Thailand?",
        a: "Yes. Our desk builds Singapore with Malaysia across the causeway, or all three with Thailand, in one trip, pairing the Marina Bay with Kuala Lumpur and Genting or Bangkok and Pattaya. See our combo tours, and tell us your dates for a plan and a quote across the countries you choose.",
      },
    ],
  },

  "malaysia-thailand-singapore": {
    overview:
      "Malaysia Thailand Singapore Tour Package from Pakistan is the full Southeast Asia trio in one booking, nine days and eight nights across three countries. Our team arranges return airfare, the two inter country flights, all three visas, hotels with breakfast, and guided tours, from the temples of Bangkok and the beaches of Pattaya to Kuala Lumpur and Genting, and on to Singapore with Sentosa and the Night Safari. Temples, cities, hills, and islands in one journey, a grand tour for families and couples traveling from Pakistan.",
    whoFor: [
      "Families wanting three countries in one grand trip",
      "Couples seeking cities, temples, and islands together",
      "Travelers making the most of a long flight from Pakistan",
      "Groups who want every visa and flight in one booking",
    ],
    faqs: [
      pricingFaq("Malaysia Thailand Singapore Tour Package"),
      {
        q: "How many visas do I need for the three country tour?",
        a: "The trip needs three visas, for Thailand, Malaysia, and Singapore. Our team prepares and files each, checking every document first so the files clear cleanly. All three arrive inside your package, coordinated by our desk, so you handle one booking rather than three separate applications.",
      },
      {
        q: "How many days do I need for Malaysia, Thailand, and Singapore?",
        a: "Nine days and eight nights cover all three at a steady pace, Bangkok and Pattaya, Kuala Lumpur and Genting, and Singapore with Sentosa. Add nights for a beach leg in Phuket or Langkawi, or a fourth country. Tell our desk your dates and we shape the length around them.",
      },
      {
        q: "What is the best time for the three country tour?",
        a: "November to February is the cool, dry window across all three countries and the most comfortable for the temples, the hills, and the islands. The green season brings short showers and lower rates. Share your travel window and our team plans the route around it.",
      },
      {
        q: "What is included in the three country package?",
        a: "The package covers return airfare, the two inter country flights, all three visas, hotels with breakfast, the Bangkok and Pattaya tours, the Kuala Lumpur and Genting days, the Singapore city and Sentosa, transfers, and English speaking guides. Universal Studios and island add ons arrive on request.",
      },
      {
        q: "Is the three country tour good for families?",
        a: "The grand tour suits families, with the temples and beaches of Thailand, the towers and theme parks of Malaysia, and Universal Studios and the Night Safari in Singapore. Our team sets a steady pace, connected rooms, and short internal flights, and adjusts the days for younger children on request.",
      },
      {
        q: "Do you customize the three country itinerary?",
        a: "Yes. Our desk changes the nights in each country, adds a Phuket or Langkawi beach leg, a fourth country like Vietnam, or a slower pace, and builds the days around your group. Share how many travelers and what you want to see, and we send a plan and a quote for your exact dates.",
      },
      {
        q: "How do the flights between the countries work?",
        a: "Two short internal flights sit inside the package, Bangkok to Kuala Lumpur and Kuala Lumpur to Singapore, so you move between the countries without arranging them yourself. Our desk books the international flights from Pakistan and all transfers, and confirms the full routing in writing.",
      },
      {
        q: "Is the three country tour suitable for a honeymoon?",
        a: "The trio works well for honeymooners, pairing the temples and beaches of Thailand with the cities of Kuala Lumpur and Singapore. Our team arranges comfortable hotels, a relaxed pace, and add ons like an island day, a couples dinner, or a beach leg on request for travelers from Pakistan.",
      },
      {
        q: "Which airlines fly this Southeast Asia route from Pakistan?",
        a: "Our desk books the trip on the carrier with the best fare and schedule for your dates, among Thai Airways, Singapore Airlines, Malaysia Airlines, Emirates, and Qatar Airways, with the two internal sectors included. Travelers depart from Karachi, Lahore, Islamabad, or Peshawar.",
      },
      {
        q: "How does the three country tour compare with two countries?",
        a: "The two country combo pairs Malaysia and Thailand, while the three country grand tour adds Singapore and its Sentosa and Night Safari for a fuller trip. See our Malaysia and Thailand combo for the shorter route, and tell us which cities you want so we shape the plan and the quote.",
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

// What sets the economy price. Cost drivers only, no numbers, routed to a
// quote so cost queries land without a stale published figure.
export const economyCostDrivers = [
  {
    icon: "plane",
    factor: "Airline and travel dates",
    detail:
      "Airfare shifts with the carrier, the season, and how early you book, and it moves week to week.",
  },
  {
    icon: "hotel",
    factor: "Hotel tier and distance",
    detail:
      "A closer hotel or a higher tier lifts the price, while a short shuttle ride from a little farther out lowers it.",
  },
  {
    icon: "users",
    factor: "Room sharing",
    detail:
      "Quad sharing costs least and triple a little more, so your room choice shapes the price per pilgrim.",
  },
  {
    icon: "moon",
    factor: "Season",
    detail:
      "Ramadan and the Hajj season sit highest, while Rajab, Shaban, and other off peak months run lower.",
  },
];

// What sets the premium price. Cost drivers only, no numbers, routed to a
// quote. Names the honest reasons premium sits above economy.
export const premiumCostDrivers = [
  {
    icon: "hotel",
    factor: "Hotel proximity and tier",
    detail:
      "A five star hotel facing the Haram costs more than one a short walk away, so how near you stay sets much of the price.",
  },
  {
    icon: "users",
    factor: "Room configuration",
    detail:
      "Double and twin rooms cost more per pilgrim than triple sharing, so your room choice shapes the quote.",
  },
  {
    icon: "plane",
    factor: "Direct flights and dates",
    detail:
      "Direct flights with checked baggage and the travel season move the airfare, which shifts week to week.",
  },
  {
    icon: "clock",
    factor: "Length of stay",
    detail:
      "Twenty one days across Makkah and Madinah adds nights over a shorter Umrah, for a calmer, unhurried pace.",
  },
];

// What sets the Ramadan price. Cost drivers only, no numbers, routed to a
// quote. Ties the premium to the Ashra, proximity, duration, and timing.
export const ramadanCostDrivers = [
  {
    icon: "moon",
    factor: "Which Ashra you choose",
    detail:
      "The last ten nights carry the steepest premium, while the first and middle Ashra sit lower for the same blessed month.",
  },
  {
    icon: "hotel",
    factor: "Hotel proximity",
    detail:
      "A hotel closer to the Haram costs more, and the nearest rooms for Taraweeh and Qiyam sell out first.",
  },
  {
    icon: "clock",
    factor: "Duration",
    detail:
      "Ten to thirty days sets how many nights you stay, so a full Ramadan costs more than a single Ashra.",
  },
  {
    icon: "plane",
    factor: "Booking window",
    detail:
      "Airfare and rooms climb as Ramadan nears, so booking early holds a better price than a late one.",
  },
];

// What sets the Hajj price. Cost drivers only, no numbers, routed to a quote.
// Names the scheme, Maktab, hotels, and airline as the honest levers.
export const hajjCostDrivers = [
  {
    icon: "shield",
    factor: "Scheme and route",
    detail:
      "The government balloting scheme, a private package, or a sponsorship route each set a different base, since private and sponsorship carry their own costs.",
  },
  {
    icon: "pin",
    factor: "Maktab category",
    detail:
      "Category A, non shifting and closer to the Jamarat, costs more than the shifting Category B, the core Hajj price lever.",
  },
  {
    icon: "hotel",
    factor: "Hotels and duration",
    detail:
      "Closer Makkah, Madinah, and Aziziyah hotels and a longer stay lift the price, while a shorter trip lowers it.",
  },
  {
    icon: "plane",
    factor: "Airline and season",
    detail:
      "Direct flights and the peak Hajj window move the airfare, which our desk reads live for your dates.",
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
    title: "Yawm al Tarwiyah, move to Mina",
    detail:
      "Travel to Mina and spend the day and night in prayer and rest, preparing for the standing at Arafat.",
  },
  {
    day: "9th of Dhul Hijjah",
    title: "The Day of Arafah, then Muzdalifah",
    detail:
      "Stand at Arafat on the Day of Arafah in dua and worship, the pillar of Hajj, then move to Muzdalifah for the night and gather pebbles.",
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

// Dubai tour content. The day by day maps the real package inclusions to the
// five day flow; attractions and practical facts are public Dubai and UAE
// knowledge, not fabricated claims about the package. Exact hotel names route
// to inquiry.
export const dubaiItinerary = [
  {
    day: "Day 1",
    title: "Arrival in Dubai",
    caption: "The Dubai skyline with the Burj Khalifa at dusk",
    detail:
      "Land in Dubai, clear the UAE visit visa, and transfer to your four star hotel to settle in and rest.",
  },
  {
    day: "Day 2",
    title: "Dubai city tour, Burj Khalifa and Dubai Mall",
    caption: "The Burj Khalifa above Downtown Dubai",
    detail:
      "See the modern city, then visit the Burj Khalifa and Dubai Mall, with the Dubai Fountain show in the evening.",
  },
  {
    day: "Day 3",
    title: "Desert safari with BBQ dinner",
    caption: "Dune bashing on a Dubai desert safari at sunset",
    detail:
      "Head into the dunes for a desert safari with dune bashing, then a BBQ dinner and a cultural show under the stars.",
  },
  {
    day: "Day 4",
    title: "Dubai Marina dhow cruise",
    caption: "A dhow cruise on Dubai Marina at night",
    detail:
      "Spend the day at leisure, with an evening Dubai Marina dhow cruise and dinner along the waterfront. Optional excursions are arranged on request.",
  },
  {
    day: "Day 5",
    title: "Departure",
    caption: "Dubai International Airport for the flight home",
    detail:
      "Check out and transfer to the airport for your return flight to Pakistan.",
  },
];

// Named Dubai attractions. Included ones and clearly marked optional ones,
// so nothing reads as included that is not.
export const dubaiAttractions = [
  {
    name: "Burj Khalifa",
    caption: "The Burj Khalifa, the tallest building in the world",
    detail:
      "The tallest building in the world at over eight hundred metres, rising above Downtown Dubai. Ride to the At the Top observation decks for views across the city, the coast, and the desert. The Dubai Fountain dances at its feet each evening.",
  },
  {
    name: "Dubai Mall",
    caption: "The Dubai Fountain outside Dubai Mall",
    detail:
      "One of the largest shopping and entertainment centres on earth, beside the Burj Khalifa. Inside sit the Dubai Aquarium and Underwater Zoo, an indoor ice rink, and hundreds of shops. Outside, the Dubai Fountain show runs on the lake at dusk.",
  },
  {
    name: "Desert Safari",
    caption: "Camel rides on a Dubai desert safari",
    detail:
      "A drive into the red dunes for dune bashing in a four wheel drive, then camel rides, sandboarding, and henna at a desert camp. Dinner is a BBQ under the stars with a Tanoura and belly dance show. The safari runs from the afternoon into the evening.",
  },
  {
    name: "Dubai Marina",
    caption: "The towers and yachts of Dubai Marina",
    detail:
      "A waterfront district of glass towers, yachts, and the Marina Walk promenade. The evening dhow cruise sails the canal with dinner on board, past the lit skyline and the Bluewaters wheel. A calm close to a full day of sightseeing.",
  },
  {
    name: "Palm Jumeirah",
    caption: "Palm Jumeirah and Atlantis from the air",
    detail:
      "The palm shaped island built into the Arabian Gulf, home to Atlantis The Palm and its Aquaventure water park. The monorail runs the trunk to the crescent, and beach clubs line the fronds. On the optional excursion list rather than the base plan.",
  },
  {
    name: "Abu Dhabi and the Sheikh Zayed Grand Mosque",
    caption: "The Sheikh Zayed Grand Mosque in Abu Dhabi",
    detail:
      "A day trip to the UAE capital and its white marble grand mosque, one of the largest in the world, with its many domes and vast main prayer hall. The route often adds the Corniche and Emirates Palace. Arranged on request as an add on.",
  },
];

// Dubai gallery captions. Motif panels until real Dubai photos are supplied,
// each caption naming the entity for the alt text and, once real, ImageObject.
export const dubaiGallery = [
  "The Burj Khalifa above Downtown Dubai",
  "The Dubai Fountain at Dubai Mall",
  "A desert safari at sunset near Dubai",
  "Dubai Marina at night",
  "Palm Jumeirah from the air",
  "The Sheikh Zayed Grand Mosque in Abu Dhabi",
];

// Practical Dubai facts for a first time traveler, a full quick facts grid.
// Public UAE knowledge. Halal food is a real trust signal for this audience.
export const dubaiPractical = [
  {
    icon: "clock",
    label: "Best time to visit",
    value: "November to March, cooler and dry",
  },
  { icon: "tag", label: "Currency", value: "UAE dirham, AED" },
  { icon: "meal", label: "Halal food", value: "Widely available across the emirate" },
  { icon: "document", label: "Power and plugs", value: "Type G sockets, 230 volts" },
  { icon: "route", label: "Driving side", value: "Right hand side of the road" },
  {
    icon: "users",
    label: "Language",
    value: "Arabic, with English widely spoken",
  },
  { icon: "clock", label: "Time zone", value: "GMT plus 4" },
  { icon: "pin", label: "Top cities", value: "Dubai, Abu Dhabi, and Sharjah" },
];

// What sets the Dubai price. Cost drivers only, no numbers, routed to a quote.
export const dubaiCostDrivers = [
  {
    icon: "clock",
    factor: "Travel season",
    detail:
      "The cooler winter months and holidays sit highest, while summer runs lower for the same city.",
  },
  {
    icon: "hotel",
    factor: "Hotel and area",
    detail:
      "A higher star rating or a central area lifts the price, while a standard four star holds it down.",
  },
  {
    icon: "camera",
    factor: "Excursions and add ons",
    detail:
      "Optional trips like Abu Dhabi, Atlantis Aquaventure, or a yacht tour add to the base package.",
  },
  {
    icon: "plane",
    factor: "Airline and departure city",
    detail:
      "The carrier, the season, and whether you fly from Karachi, Lahore, Islamabad, or Peshawar move the airfare.",
  },
];

// Turkey tour content. The day by day maps the real package scope, Istanbul
// and Cappadocia across seven days and six nights; captions name the entity
// and double as alt text. Antalya and Pamukkale are marked optional, since the
// base package is Istanbul and Cappadocia. Exact hotels route to inquiry.
export const turkeyItinerary = [
  {
    day: "Day 1",
    title: "Arrival in Istanbul",
    caption: "Istanbul skyline over the Bosphorus at dusk",
    detail:
      "Land in Istanbul, clear the Turkey e visa, and transfer to your hotel with halal meals arranged.",
  },
  {
    day: "Day 2",
    title: "Istanbul old city",
    caption: "Hagia Sophia and the Blue Mosque in Sultanahmet",
    detail:
      "Guided tour of Sultanahmet with Hagia Sophia, the Blue Mosque, and the lanes of the Grand Bazaar.",
  },
  {
    day: "Day 3",
    title: "The Bosphorus and Topkapi",
    caption: "A Bosphorus cruise between Europe and Asia",
    detail:
      "Cruise the Bosphorus between two continents, then visit Topkapi Palace and the Basilica Cistern.",
  },
  {
    day: "Day 4",
    title: "Fly to Cappadocia",
    caption: "Cappadocia at sunrise with hot air balloons",
    detail:
      "Fly to Cappadocia for Goreme, the fairy chimneys, and an optional hot air balloon ride at dawn.",
  },
  {
    day: "Day 5",
    title: "Cappadocia valleys",
    caption: "The fairy chimneys and Uchisar castle in Cappadocia",
    detail:
      "Explore Uchisar, the valleys, and an underground city, with time among the rock churches of Goreme.",
  },
  {
    day: "Day 6",
    title: "Return to Istanbul",
    caption: "The covered lanes of the Grand Bazaar",
    detail:
      "Fly back to Istanbul for a free day, the Grand Bazaar, and Galata, with optional extensions on request.",
  },
  {
    day: "Day 7",
    title: "Departure",
    caption: "Istanbul airport departure for the flight home",
    detail:
      "Transfer to the airport for your return flight to Pakistan.",
  },
];

// Named Turkey attractions with captions. Included ones and clearly marked
// optional extensions, so nothing reads as included that is not.
export const turkeyAttractions = [
  {
    name: "Hagia Sophia",
    caption: "Hagia Sophia in Sultanahmet, Istanbul",
    detail:
      "The great Byzantine and Ottoman monument at the heart of old Istanbul.",
  },
  {
    name: "The Blue Mosque",
    caption: "The six minarets of the Blue Mosque",
    detail:
      "The Sultan Ahmed Mosque, known for its blue Iznik tiles, across from Hagia Sophia.",
  },
  {
    name: "The Bosphorus",
    caption: "A ferry crossing the Bosphorus strait",
    detail:
      "The strait between Europe and Asia, seen on the included cruise.",
  },
  {
    name: "Cappadocia and the hot air balloon",
    caption: "Hot air balloons over the Cappadocia valleys at sunrise",
    detail:
      "Fairy chimneys, Goreme, and an optional dawn balloon flight over the valleys.",
  },
  {
    name: "Topkapi Palace and the Grand Bazaar",
    caption: "The Grand Bazaar, one of the oldest covered markets",
    detail:
      "The Ottoman palace above the Bosphorus and the covered market of thousands of shops.",
  },
  {
    name: "Pamukkale and Antalya",
    caption: "The white travertine terraces of Pamukkale",
    detail:
      "The travertine terraces and the Mediterranean coast, on the optional extension list.",
  },
];

// Practical Turkey facts for a first time traveler. Public knowledge.
export const turkeyPractical = [
  {
    icon: "clock",
    label: "Best time to visit",
    value: "April to June and September to October",
  },
  { icon: "tag", label: "Currency", value: "Turkish lira, TRY" },
  { icon: "pin", label: "Time zone", value: "GMT plus 3" },
  {
    icon: "users",
    label: "Language",
    value: "Turkish, with English in tourist areas",
  },
  { icon: "route", label: "Driving side", value: "Right hand side of the road" },
];

// What sets the Turkey price. Cost drivers only, no numbers, routed to a quote.
export const turkeyCostDrivers = [
  {
    icon: "clock",
    factor: "Travel season",
    detail:
      "Spring and autumn sit highest for comfortable weather and the balloon flights, while winter runs lower.",
  },
  {
    icon: "hotel",
    factor: "Hotels and cities",
    detail:
      "A higher star rating or a cave hotel in Cappadocia lifts the price, while a standard four star holds it down.",
  },
  {
    icon: "camera",
    factor: "Excursions and the balloon",
    detail:
      "The optional hot air balloon, Pamukkale, and Antalya add to the base package.",
  },
  {
    icon: "plane",
    factor: "Airline and departure city",
    detail:
      "The carrier, the season, and whether you fly from Karachi, Lahore, Islamabad, or Peshawar move the airfare.",
  },
];

// Premium Umrah hotel and room gallery captions. Motif panels until real
// photos are supplied; each caption names the entity for the alt text and,
// once real, ImageObject. No specific hotel name is invented.
export const premiumGallery = [
  "A five star hotel room near the Haram in Makkah",
  "Masjid al-Haram and the Kaaba at Fajr",
  "A hotel near Masjid an-Nabawi in Madinah",
  "The Rawdah inside Masjid an-Nabawi",
  "A twin room set for a family stay",
  "The mataf around the Kaaba during Umrah",
];

// Gallery captions. Motif panels until real Turkey photos are supplied, each
// caption naming the entity for the alt text and, once real, ImageObject.
export const turkeyGallery = [
  "Hagia Sophia at dusk in Istanbul",
  "The Blue Mosque and its six minarets",
  "A Bosphorus cruise between two continents",
  "Hot air balloons over Cappadocia at sunrise",
  "The fairy chimneys of Goreme",
  "The Grand Bazaar of Istanbul",
];

// Baku tour content. The day by day maps the real five day flow, the attractions
// and practical facts are public Azerbaijan knowledge, not fabricated claims
// about the package. The exact hotel name and night plan route to inquiry.
export const bakuItinerary = [
  {
    day: "Day 1",
    title: "Arrival in Baku",
    caption: "The Flame Towers above the Baku skyline at dusk",
    detail:
      "Land in Baku, clear the Azerbaijan e visa, and transfer to your city center hotel to settle in and rest before the touring begins.",
  },
  {
    day: "Day 2",
    title: "Baku city and Old City tour",
    caption: "The Maiden Tower in the Icherisheher Old City of Baku",
    detail:
      "A guided tour of the Icherisheher Old City with the Maiden Tower and Shirvanshah Palace, then the Flame Towers, the Heydar Aliyev Center, Baku Boulevard, and Fountain Square.",
  },
  {
    day: "Day 3",
    title: "Gobustan and the Absheron fire sites",
    caption: "The mud volcanoes of Gobustan near Baku",
    detail:
      "Drive to Gobustan for the ancient petroglyphs and the bubbling mud volcanoes, then the Ateshgah Fire Temple and Yanardag, the burning mountain of the Absheron peninsula.",
  },
  {
    day: "Day 4",
    title: "Full day Gabala tour",
    caption: "The Tufandag cable car above Gabala",
    detail:
      "A full day tour to Gabala in the Caucasus foothills, with the Tufandag cable car for mountain views and a stop at Nohur Lake.",
  },
  {
    day: "Day 5",
    title: "Departure",
    caption: "Heydar Aliyev International Airport in Baku",
    detail:
      "Check out and transfer to Heydar Aliyev International Airport for your return flight to Pakistan.",
  },
];

// Named Baku attractions, public Azerbaijan knowledge with the fire sites that
// give the Land of Fire its name. Longer trips add Sheki and Shahdag on request.
export const bakuAttractions = [
  {
    name: "Icherisheher, the Old City",
    caption: "The Maiden Tower in the Old City of Baku",
    detail:
      "The walled Old City of Baku, a UNESCO site of cobbled lanes and stone houses. Inside stand the Maiden Tower and the Shirvanshah Palace, with the Little Venice canals and the Carpet Museum a short walk along Baku Boulevard.",
  },
  {
    name: "The Flame Towers",
    caption: "The Flame Towers lit above Baku at night",
    detail:
      "Three flame shaped towers that rise over the city and light up with an LED show after dark. Highland Park below gives the classic view across the bay, the Old City, and the modern skyline together.",
  },
  {
    name: "Ateshgah Fire Temple",
    caption: "The eternal flame at the Ateshgah Fire Temple",
    detail:
      "A fire temple on the Absheron peninsula, built around a natural gas flame that once drew Zoroastrian and Hindu pilgrims. The central altar still burns, one of the sites that earned Azerbaijan the name Land of Fire.",
  },
  {
    name: "Yanardag, the Burning Mountain",
    caption: "The natural flames of Yanardag near Baku",
    detail:
      "A hillside on Absheron that has burned without pause for centuries, fed by natural gas seeping through the rock. The flames run brightest after dark, a short drive from Baku and a highlight of the fire sites day.",
  },
  {
    name: "Gobustan National Park",
    caption: "Ancient petroglyphs at Gobustan National Park",
    detail:
      "A UNESCO reserve south of Baku with thousands of rock petroglyphs carved over millennia. Nearby, the field of mud volcanoes bubbles cold grey mud, one of the largest such clusters on earth.",
  },
  {
    name: "Gabala",
    caption: "The Tufandag cable car above Gabala",
    detail:
      "A resort town in the Caucasus foothills, reached on a full day trip. The Tufandag cable car climbs for mountain views, and the day often adds Nohur Lake and the Yeddi Gozal waterfalls in the green season.",
  },
];

// Gallery captions. Motif panels until real Baku photos are supplied, each
// caption naming the entity for the alt text and, once real, ImageObject.
export const bakuGallery = [
  "The Flame Towers above the Baku skyline",
  "The Maiden Tower in the Old City of Baku",
  "The eternal flame at the Ateshgah Fire Temple",
  "Yanardag, the burning mountain of Absheron",
  "The mud volcanoes of Gobustan",
  "The Tufandag cable car in Gabala",
];

// Practical Baku facts for a first time traveler, a full quick facts grid.
// Public Azerbaijan knowledge. Halal food is a real trust signal here.
export const bakuPractical = [
  {
    icon: "clock",
    label: "Best time to visit",
    value: "April to June and September to October",
  },
  { icon: "tag", label: "Currency", value: "Azerbaijani manat, AZN" },
  { icon: "meal", label: "Halal food", value: "Widely available across the city" },
  { icon: "clock", label: "Time zone", value: "GMT plus 4" },
  {
    icon: "users",
    label: "Language",
    value: "Azerbaijani, with Russian and some English",
  },
  { icon: "route", label: "Driving side", value: "Right hand side of the road" },
  { icon: "pin", label: "Top cities", value: "Baku, Gabala, and Sheki" },
];

// What sets the Baku price. Cost drivers only, no numbers, routed to a quote.
export const bakuCostDrivers = [
  {
    icon: "clock",
    factor: "Travel season",
    detail:
      "Spring and autumn sit highest for mild weather, summer runs warm and busy, and winter runs lower outside the Shahdag ski season.",
  },
  {
    icon: "hotel",
    factor: "Hotel and area",
    detail:
      "A higher star rating or a city center address near the Boulevard lifts the price, while a standard four star holds it down.",
  },
  {
    icon: "camera",
    factor: "Excursions and add ons",
    detail:
      "Optional days to Sheki and its Khan Palace, the Shahdag resort, or extra nights in Gabala add to the base package.",
  },
  {
    icon: "plane",
    factor: "Airline and departure city",
    detail:
      "The carrier, the season, and whether you fly from Karachi, Lahore, Islamabad, or Peshawar move the airfare.",
  },
];

// Far East content, the Malaysia and Thailand combo. The day by day maps the
// real eight day flow across Kuala Lumpur and Bangkok; attractions and practical
// facts are public knowledge, not fabricated claims. Exact hotels route to
// inquiry, and the Phuket beach leg is marked optional.
export const farEastItinerary = [
  {
    day: "Day 1",
    country: "Malaysia",
    title: "Arrival in Kuala Lumpur",
    caption: "The Kuala Lumpur skyline with the Petronas Twin Towers at dusk",
    detail:
      "Land in Kuala Lumpur, clear the Malaysia e visa, and transfer to your hotel to rest before the touring begins.",
  },
  {
    day: "Day 2",
    country: "Malaysia",
    title: "Kuala Lumpur city tour",
    caption: "The rainbow steps at Batu Caves near Kuala Lumpur",
    detail:
      "A guided city tour with the Petronas Twin Towers and KLCC, the KL Tower, Merdeka Square, the National Mosque, and the Batu Caves shrine on the city edge.",
  },
  {
    day: "Day 3",
    country: "Malaysia",
    title: "Genting Highlands day trip",
    caption: "The Awana Skyway cable car to Genting Highlands",
    detail:
      "A day trip into the cool hills, riding the Awana Skyway cable car to the Genting Highlands resort, its theme parks, and viewpoints above the clouds.",
  },
  {
    day: "Day 4",
    country: "Thailand",
    title: "Fly to Bangkok",
    caption: "The Bangkok skyline along the Chao Phraya River",
    detail:
      "Fly from Kuala Lumpur to Bangkok on the included inter country flight, transfer to your hotel, and spend the evening at leisure along the city streets.",
  },
  {
    day: "Day 5",
    country: "Thailand",
    title: "Bangkok temples and the Grand Palace",
    caption: "The Grand Palace and Wat Phra Kaew in Bangkok",
    detail:
      "A guided tour of the Grand Palace and Wat Phra Kaew, the reclining Buddha at Wat Pho, and Wat Arun, with a Chao Phraya river cruise.",
  },
  {
    day: "Day 6",
    country: "Thailand",
    title: "Pattaya and Coral Island",
    caption: "Longtail boats at Coral Island near Pattaya",
    detail:
      "A day to Pattaya on the coast, with a speedboat to Coral Island for the beaches, or a Bangkok floating market and shopping instead.",
  },
  {
    day: "Day 7",
    country: "Thailand",
    title: "Leisure or the Phuket beaches",
    caption: "Longtail boats at the Phi Phi Islands near Phuket",
    detail:
      "A leisure day in Bangkok, or on the Phuket extension, the beaches of Patong and a boat trip to the Phi Phi Islands.",
  },
  {
    day: "Day 8",
    country: "Thailand",
    title: "Departure",
    caption: "Suvarnabhumi Airport in Bangkok for the flight home",
    detail:
      "Check out and transfer to the airport for your return flight to Pakistan.",
  },
];

// Named Malaysia and Thailand attractions, public knowledge. The Phuket leg is
// clearly marked optional so nothing reads as included that is not.
export const farEastAttractions = [
  {
    name: "Petronas Twin Towers",
    caption: "The Petronas Twin Towers in Kuala Lumpur",
    detail:
      "The twin skyscrapers at the heart of Kuala Lumpur, joined by a skybridge and set above the KLCC park and its fountains. The towers light the skyline after dark, the classic first sight of the city.",
  },
  {
    name: "Batu Caves",
    caption: "The rainbow steps and statue at Batu Caves",
    detail:
      "A limestone hill of caves and a Hindu shrine on the edge of Kuala Lumpur, reached by a flight of two hundred and seventy two rainbow painted steps beneath a towering golden statue. A short, striking half day stop.",
  },
  {
    name: "Genting Highlands",
    caption: "The resort of Genting Highlands above the clouds",
    detail:
      "A hilltop resort in the cool highlands north of Kuala Lumpur, reached by the Awana Skyway cable car. Theme parks, viewpoints, and a mild climate make it a favourite family day out from the city heat.",
  },
  {
    name: "The Grand Palace and Wat Phra Kaew",
    caption: "The Grand Palace and Wat Phra Kaew in Bangkok",
    detail:
      "The former royal palace of Bangkok and the temple of the Emerald Buddha, a complex of gilded spires and detailed murals beside the Chao Phraya. The most visited landmark in the city and the heart of the temple tour.",
  },
  {
    name: "Wat Pho and Wat Arun",
    caption: "Wat Arun on the Chao Phraya River in Bangkok",
    detail:
      "Wat Pho holds the vast gold reclining Buddha, while Wat Arun, the Temple of Dawn, rises in porcelain tiled spires across the river. A short boat ride links them on the Bangkok temple day.",
  },
  {
    name: "Phuket and the Phi Phi Islands",
    caption: "Longtail boats at the Phi Phi Islands near Phuket",
    detail:
      "The beaches of Patong and a boat trip to the Phi Phi Islands of clear water and limestone cliffs. On the optional Phuket extension rather than the base eight day plan, arranged on request.",
  },
];

// Gallery captions. Motif panels until real photos are supplied, each caption
// naming the entity for the alt text and, once real, ImageObject.
export const farEastGallery = [
  "The Petronas Twin Towers in Kuala Lumpur",
  "The rainbow steps at Batu Caves",
  "Genting Highlands above the clouds",
  "The Grand Palace in Bangkok",
  "Wat Arun on the Chao Phraya River",
  "The Phi Phi Islands near Phuket",
];

// Practical Malaysia and Thailand facts for a first time traveler, a full quick
// facts grid. Public knowledge. Halal food is a real trust signal here.
export const farEastPractical = [
  {
    icon: "clock",
    label: "Best time to visit",
    value: "November to February, cooler and drier",
  },
  { icon: "tag", label: "Currency", value: "Malaysian ringgit and Thai baht" },
  {
    icon: "meal",
    label: "Halal food",
    value: "Widely in Malaysia, tourist areas in Thailand",
  },
  {
    icon: "clock",
    label: "Time zone",
    value: "GMT plus 8 Malaysia, GMT plus 7 Thailand",
  },
  {
    icon: "users",
    label: "Language",
    value: "Malay and Thai, English in tourist areas",
  },
  { icon: "route", label: "Driving side", value: "Left hand side of the road" },
  { icon: "pin", label: "Top cities", value: "Kuala Lumpur, Bangkok, and Phuket" },
];

// What sets the price. Cost drivers only, no numbers, routed to a quote.
export const farEastCostDrivers = [
  {
    icon: "clock",
    factor: "Travel season",
    detail:
      "The cool, dry months from November to February sit highest, while the monsoon season runs lower for the same route.",
  },
  {
    icon: "hotel",
    factor: "Hotels and cities",
    detail:
      "A higher star rating or a central Kuala Lumpur and Bangkok address lifts the price, while a standard four star holds it down.",
  },
  {
    icon: "camera",
    factor: "Excursions and the beach leg",
    detail:
      "The optional Phuket or Krabi beach extension, island boat trips, and the Genting theme parks add to the base package.",
  },
  {
    icon: "plane",
    factor: "Airline and departure city",
    detail:
      "The carrier, the season, and whether you fly from Karachi, Lahore, Islamabad, or Peshawar move the airfare.",
  },
];

// Data driven tour content, keyed by slug. New tour pages (the Malaysia,
// Thailand, Singapore silo and its combos) render from this map through one
// generic path in the detail template, so adding a country or a combo is a
// data entry, not new JSX. Dubai, Turkey, and Baku keep their own blocks.
export type TourStep = { day: string; country?: string; title: string; caption: string; detail: string };
export type TourAttraction = { name: string; caption: string; detail: string };
export type TourFact = { icon: string; label: string; value: string };
export type TourCostDriver = { icon: string; factor: string; detail: string };
export type TourVisaLink = { label: string; href: string };
export type TourContent = {
  name: string;
  durationWords: string;
  itinerary: TourStep[];
  itineraryNote: string;
  attractions: TourAttraction[];
  gallery: string[];
  practical: TourFact[];
  costDrivers: TourCostDriver[];
  seasonalNote: string;
  visaIntro: string;
  visaLinks: TourVisaLink[];
  // Optional lead passage, rendered after the overview and before the itinerary.
  // Malaysia uses it for the Muslim friendly and halal wedge.
  wedge?: { eyebrow: string; title: string; body: string };
};

export const tourContent: Record<string, TourContent> = {
  malaysia: {
    name: "Malaysia",
    durationWords: "six day",
    wedge: {
      eyebrow: "Muslim friendly Malaysia",
      title: "A halal, prayer easy trip for a Muslim family",
      body: "Malaysia is a Muslim majority country, so halal food is everywhere, from the hawker stalls of Kuala Lumpur to the food courts of Genting, and no separate hunt for a halal meal is needed. Mosques sit on the tour route, the blue roofed National Mosque near Merdeka Square and the rose tinted Putra Mosque on the lake in Putrajaya, with prayer rooms, or surau, in the malls, the airport, and most attractions. Modest, welcoming, and easy to pray in, Malaysia is one of the most comfortable first trips abroad for a family from Pakistan, which is the reason so many choose it over the other Far East cities.",
    },
    itineraryNote:
      "The flow above is the typical six day plan around Kuala Lumpur. Our desk adjusts the order and adds Langkawi, Malacca, or Putrajaya on request.",
    seasonalNote:
      "Malaysia is a year round tropical destination, so message us with your dates and our desk plans around the rain and the school holidays.",
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Kuala Lumpur",
        caption: "The Petronas Twin Towers over the Kuala Lumpur skyline at dusk",
        detail:
          "Land in Kuala Lumpur, clear the Malaysia e visa, and transfer to your hotel to rest before the touring begins.",
      },
      {
        day: "Day 2",
        title: "Kuala Lumpur city tour",
        caption: "The rainbow steps at Batu Caves near Kuala Lumpur",
        detail:
          "A guided city tour with the Petronas Twin Towers and KLCC, the KL Tower, Merdeka Square and the Sultan Abdul Samad Building, the National Mosque, and the Batu Caves shrine beneath the Lord Murugan statue.",
      },
      {
        day: "Day 3",
        title: "Genting Highlands day trip",
        caption: "The Awana Skyway cable car to Genting Highlands",
        detail:
          "A day trip into the cool hills, riding the Awana Skyway cable car to the Genting Highlands resort and theme parks, with a stop at the Chin Swee Caves Temple on the way up.",
      },
      {
        day: "Day 4",
        title: "Putrajaya and Bukit Bintang",
        caption: "The pink Putra Mosque on the lake in Putrajaya",
        detail:
          "Visit the garden city of Putrajaya and the pink Putra Mosque on the lake, then time at KLCC and the shops and food of Bukit Bintang back in the city.",
      },
      {
        day: "Day 5",
        title: "Leisure or Langkawi",
        caption: "The SkyBridge and cable car on Langkawi island",
        detail:
          "A leisure day in Kuala Lumpur, or an optional add on to Langkawi for the island cable car, Eagle Square, and the beaches, arranged on request.",
      },
      {
        day: "Day 6",
        title: "Departure",
        caption: "Kuala Lumpur International Airport for the flight home",
        detail:
          "Check out and transfer to Kuala Lumpur International Airport for your return flight to Pakistan.",
      },
    ],
    attractions: [
      {
        name: "Petronas Twin Towers",
        caption: "The Petronas Twin Towers in Kuala Lumpur",
        detail:
          "The twin skyscrapers at the heart of Kuala Lumpur, joined by a skybridge and set above the KLCC park and its fountains. The towers light the skyline after dark, the classic first sight of the city.",
      },
      {
        name: "Batu Caves",
        caption: "The rainbow steps and Lord Murugan statue at Batu Caves",
        detail:
          "A limestone hill of caves and a Hindu shrine on the edge of Kuala Lumpur, reached by two hundred and seventy two rainbow painted steps beneath the towering golden statue of Lord Murugan. A short, striking half day stop.",
      },
      {
        name: "Genting Highlands",
        caption: "The resort of Genting Highlands above the clouds",
        detail:
          "A hilltop resort in the cool highlands north of Kuala Lumpur, reached by the Awana Skyway cable car past the Chin Swee Caves Temple. Theme parks and a mild climate make it a favourite family day out from the city heat.",
      },
      {
        name: "The National Mosque, Masjid Negara",
        caption: "The National Mosque, Masjid Negara, in Kuala Lumpur",
        detail:
          "The national mosque of Malaysia, with its folded blue roof and tall minaret near Merdeka Square. Open to visitors outside prayer times, one of many easy places to pray in a Muslim majority country where halal food is everywhere.",
      },
      {
        name: "Langkawi",
        caption: "The SkyCab cable car and SkyBridge on Langkawi",
        detail:
          "An island of beaches and rainforest off the northwest coast, home to the SkyCab cable car, the curving SkyBridge, and the Eagle Square landmark. On the optional add on rather than the base city plan, arranged on request.",
      },
      {
        name: "Putrajaya and the Putra Mosque",
        caption: "The pink Putra Mosque on the lake in Putrajaya",
        detail:
          "The planned garden capital south of Kuala Lumpur, built around a lake and crossed by grand bridges. The rose tinted Putra Mosque on the waterfront is the signature sight, a calm half day from the city.",
      },
    ],
    gallery: [
      "The Petronas Twin Towers in Kuala Lumpur",
      "The rainbow steps at Batu Caves",
      "Genting Highlands above the clouds",
      "The National Mosque, Masjid Negara",
      "The pink Putra Mosque in Putrajaya",
      "The cable car and beaches of Langkawi",
    ],
    practical: [
      { icon: "clock", label: "Best time to visit", value: "Year round, tropical climate" },
      { icon: "tag", label: "Currency", value: "Malaysian ringgit, MYR" },
      {
        icon: "meal",
        label: "Halal food",
        value: "Everywhere, a Muslim majority country",
      },
      { icon: "clock", label: "Time zone", value: "GMT plus 8" },
      { icon: "users", label: "Language", value: "Malay, with English widely spoken" },
      { icon: "route", label: "Driving side", value: "Left hand side of the road" },
      { icon: "pin", label: "Top cities", value: "Kuala Lumpur, Genting, and Langkawi" },
    ],
    costDrivers: [
      {
        icon: "clock",
        factor: "Travel season",
        detail:
          "School holidays and the drier months sit highest, while quieter weeks and the wetter season run lower for the same cities.",
      },
      {
        icon: "hotel",
        factor: "Hotel and area",
        detail:
          "A higher star rating or a central Kuala Lumpur address near KLCC lifts the price, while a standard four star holds it down.",
      },
      {
        icon: "camera",
        factor: "Excursions and add ons",
        detail:
          "Optional days to Langkawi, Malacca, or the Genting theme parks add to the base city package.",
      },
      {
        icon: "plane",
        factor: "Airline and departure city",
        detail:
          "The carrier, the season, and whether you fly from Karachi, Lahore, Islamabad, or Peshawar move the airfare.",
      },
    ],
    visaIntro: "Verify the current rules and apply at the official",
    visaLinks: [{ label: "Malaysia e visa portal", href: "https://malaysiavisa.imi.gov.my" }],
  },

  thailand: {
    name: "Thailand",
    durationWords: "six day",
    itineraryNote:
      "The flow above is the typical six day plan across Bangkok and Pattaya. Our desk adjusts the order and adds Phuket, Krabi, or the islands on request.",
    seasonalNote:
      "November to February is the cool, dry season in Thailand and books earliest. Message us as soon as your dates are set.",
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Bangkok",
        caption: "The Bangkok skyline along the Chao Phraya River at dusk",
        detail:
          "Land in Bangkok, clear the Thailand visa, and transfer to your hotel to rest before the touring begins.",
      },
      {
        day: "Day 2",
        title: "Bangkok temples and the Grand Palace",
        caption: "The Grand Palace and Wat Phra Kaew in Bangkok",
        detail:
          "A guided tour of the Grand Palace and Wat Phra Kaew, the reclining Buddha at Wat Pho, Wat Arun across the river, and the Golden Buddha at Wat Traimit, with a Chao Phraya cruise.",
      },
      {
        day: "Day 3",
        title: "Transfer to Pattaya and Coral Island",
        caption: "Longtail boats at Coral Island near Pattaya",
        detail:
          "Drive to the coast at Pattaya, then a speedboat to Coral Island for the beaches and clear water, with water sports on request.",
      },
      {
        day: "Day 4",
        title: "Pattaya, Nong Nooch and the Sanctuary of Truth",
        caption: "The carved Sanctuary of Truth on the Pattaya shore",
        detail:
          "Explore Nong Nooch tropical garden with its cultural show, the all wood Sanctuary of Truth, and the Khao Chi Chan Laser Buddha carved into the hillside.",
      },
      {
        day: "Day 5",
        title: "Back to Bangkok, markets and shopping",
        caption: "A floating market near Bangkok",
        detail:
          "Return to Bangkok for a floating market and time to shop, with SEA LIFE Ocean World or Madame Tussauds as an optional add on.",
      },
      {
        day: "Day 6",
        title: "Departure",
        caption: "Suvarnabhumi Airport in Bangkok for the flight home",
        detail:
          "Check out and transfer to Suvarnabhumi Airport for your return flight to Pakistan.",
      },
    ],
    attractions: [
      {
        name: "The Grand Palace and Wat Phra Kaew",
        caption: "The Grand Palace and Wat Phra Kaew in Bangkok",
        detail:
          "The former royal palace of Bangkok and the temple of the Emerald Buddha, a complex of gilded spires and detailed murals beside the Chao Phraya. The most visited landmark in the city and the heart of the temple tour.",
      },
      {
        name: "Wat Pho and Wat Arun",
        caption: "Wat Arun on the Chao Phraya River in Bangkok",
        detail:
          "Wat Pho holds the vast gold reclining Buddha, while Wat Arun, the Temple of Dawn, rises in porcelain tiled spires across the river. A short boat ride links them on the Bangkok temple day.",
      },
      {
        name: "Wat Traimit and the Golden Buddha",
        caption: "The solid gold Buddha at Wat Traimit in Bangkok",
        detail:
          "The temple in Bangkok's Chinatown that holds the world's largest solid gold Buddha, cast in centuries past and hidden under plaster for years. The lanes of Yaowarat outside are a food and market highlight.",
      },
      {
        name: "Pattaya and Coral Island",
        caption: "The beach and clear water of Coral Island near Pattaya",
        detail:
          "The beach city on the Gulf coast, a short drive from Bangkok, with a speedboat trip to Coral Island for swimming and water sports. The evenings bring a lively waterfront and markets.",
      },
      {
        name: "Nong Nooch and the Sanctuary of Truth",
        caption: "The all wood Sanctuary of Truth in Pattaya",
        detail:
          "Nong Nooch tropical garden spreads over vast grounds with a cultural show, while the Sanctuary of Truth is a towering hand carved wooden temple on the shore, one of Pattaya's signature sights.",
      },
      {
        name: "Phuket and the Phi Phi Islands",
        caption: "Longtail boats at the Phi Phi Islands near Phuket",
        detail:
          "The beaches of Patong and a boat trip to the Phi Phi Islands and James Bond Island of clear water and limestone cliffs. On the optional southern extension rather than the base Bangkok and Pattaya plan.",
      },
    ],
    gallery: [
      "The Grand Palace in Bangkok",
      "Wat Arun on the Chao Phraya River",
      "The Golden Buddha at Wat Traimit",
      "Coral Island near Pattaya",
      "The Sanctuary of Truth in Pattaya",
      "The Phi Phi Islands near Phuket",
    ],
    practical: [
      { icon: "clock", label: "Best time to visit", value: "November to February, cool and dry" },
      { icon: "tag", label: "Currency", value: "Thai baht, THB" },
      { icon: "meal", label: "Halal food", value: "Widely available in Bangkok" },
      { icon: "clock", label: "Time zone", value: "GMT plus 7" },
      { icon: "users", label: "Language", value: "Thai, with English in tourist areas" },
      { icon: "route", label: "Driving side", value: "Left hand side of the road" },
      { icon: "pin", label: "Top cities", value: "Bangkok, Pattaya, and Phuket" },
    ],
    costDrivers: [
      {
        icon: "clock",
        factor: "Travel season",
        detail:
          "The cool, dry months from November to February sit highest, while the green season runs lower for the same cities.",
      },
      {
        icon: "hotel",
        factor: "Hotel and area",
        detail:
          "A higher star rating or a central Bangkok or beachfront Pattaya address lifts the price, while a standard four star holds it down.",
      },
      {
        icon: "camera",
        factor: "Excursions and the islands",
        detail:
          "Optional Phuket and Krabi, island boat trips, and the Bangkok theme attractions add to the base package.",
      },
      {
        icon: "plane",
        factor: "Airline and departure city",
        detail:
          "The carrier, the season, and whether you fly from Karachi, Lahore, Islamabad, or Peshawar move the airfare.",
      },
    ],
    visaIntro:
      "The Thailand visa rules for tourism move from cycle to cycle, so verify the current position for your passport and apply at the official",
    visaLinks: [{ label: "Thailand e visa portal", href: "https://www.thaievisa.go.th" }],
  },

  singapore: {
    name: "Singapore",
    durationWords: "five day",
    itineraryNote:
      "The flow above is the typical five day plan around Singapore. Our desk adjusts the order and adds a Sentosa day or a Malaysia leg on request.",
    seasonalNote:
      "Singapore is a year round destination, so message us with your dates and our desk plans around the school holidays and the events calendar.",
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Singapore",
        caption: "The Marina Bay Sands and the Singapore skyline at night",
        detail:
          "Land in Singapore, clear the visa, and transfer to your hotel to settle in before the touring begins.",
      },
      {
        day: "Day 2",
        title: "Singapore city tour",
        caption: "The Merlion and Marina Bay in Singapore",
        detail:
          "A guided city tour with the Merlion and Marina Bay, Gardens by the Bay and its Supertrees, and the streets of Chinatown, Little India, and Orchard Road.",
      },
      {
        day: "Day 3",
        title: "Sentosa Island",
        caption: "Universal Studios Singapore on Sentosa Island",
        detail:
          "A full day on Sentosa with Universal Studios, the SEA Aquarium, the cable car and beaches, and the Wings of Time show over the water after dark.",
      },
      {
        day: "Day 4",
        title: "Gardens, the Flyer and the Night Safari",
        caption: "The Supertrees at Gardens by the Bay in Singapore",
        detail:
          "Time at Gardens by the Bay and the Singapore Flyer, with the evening at the Night Safari, the world's first nocturnal wildlife park, or Bugis Street for shopping.",
      },
      {
        day: "Day 5",
        title: "Departure",
        caption: "Changi Airport in Singapore for the flight home",
        detail:
          "Check out and transfer to Changi Airport for your return flight to Pakistan.",
      },
    ],
    attractions: [
      {
        name: "Marina Bay Sands",
        caption: "The Marina Bay Sands over the Singapore waterfront",
        detail:
          "The three towered hotel crowned by a ship shaped SkyPark, the signature of the Singapore skyline. The bay below hosts the Spectra light and water show, and the ArtScience Museum sits alongside.",
      },
      {
        name: "Gardens by the Bay",
        caption: "The Supertree Grove at Gardens by the Bay",
        detail:
          "A futuristic garden on the waterfront, famous for the towering Supertrees and the Cloud Forest and Flower Dome conservatories. The Garden Rhapsody light show runs among the Supertrees each evening.",
      },
      {
        name: "Sentosa and Universal Studios",
        caption: "Universal Studios Singapore on Sentosa Island",
        detail:
          "The resort island reached by cable car and monorail, home to Universal Studios, the SEA Aquarium, beaches, and the Wings of Time show. A full family day of rides and sea life.",
      },
      {
        name: "The Merlion",
        caption: "The Merlion statue on Marina Bay in Singapore",
        detail:
          "The lion headed, fish bodied statue that is the emblem of Singapore, spouting water over Marina Bay against the skyline. The classic photo stop at the start of the city tour.",
      },
      {
        name: "The Night Safari",
        caption: "A tram on the Night Safari in Singapore",
        detail:
          "The world's first nocturnal wildlife park, toured by tram and walking trails after dark, with lions, elephants, and leopards in naturalistic habitats. A different evening from the city lights.",
      },
      {
        name: "The Singapore Flyer",
        caption: "The Singapore Flyer observation wheel over Marina Bay",
        detail:
          "One of the largest observation wheels in Asia, turning slowly over Marina Bay for views across the city, the port, and out to the islands. Best at dusk as the skyline lights up.",
      },
    ],
    gallery: [
      "The Marina Bay Sands over the Singapore waterfront",
      "The Supertree Grove at Gardens by the Bay",
      "Universal Studios on Sentosa Island",
      "The Merlion on Marina Bay",
      "The Night Safari in Singapore",
      "The Singapore Flyer over Marina Bay",
    ],
    practical: [
      { icon: "clock", label: "Best time to visit", value: "Year round destination" },
      { icon: "tag", label: "Currency", value: "Singapore dollar, SGD" },
      { icon: "meal", label: "Halal food", value: "Halal certified outlets across the city" },
      { icon: "clock", label: "Time zone", value: "GMT plus 8" },
      {
        icon: "users",
        label: "Language",
        value: "English, Malay, Mandarin, and Tamil",
      },
      { icon: "route", label: "Driving side", value: "Left hand side of the road" },
      { icon: "pin", label: "Top areas", value: "Marina Bay, Sentosa, and Orchard Road" },
    ],
    costDrivers: [
      {
        icon: "clock",
        factor: "Travel season",
        detail:
          "School holidays, the year end, and major events sit highest, while quieter weeks run lower for the same city.",
      },
      {
        icon: "hotel",
        factor: "Hotel and area",
        detail:
          "A higher star rating or a Marina Bay or Orchard Road address lifts the price, while a value hotel near an MRT line holds it down.",
      },
      {
        icon: "camera",
        factor: "Attractions and add ons",
        detail:
          "Universal Studios, the SEA Aquarium, the Night Safari, and other Sentosa tickets add to the base package.",
      },
      {
        icon: "plane",
        factor: "Airline and departure city",
        detail:
          "The carrier, the season, and whether you fly from Karachi, Lahore, Islamabad, or Peshawar move the airfare.",
      },
    ],
    visaIntro:
      "Pakistani travelers need a Singapore visa, arranged through an authorized agent. Verify the current rules at the official",
    visaLinks: [
      { label: "Singapore Immigration and Checkpoints Authority", href: "https://www.ica.gov.sg" },
    ],
  },

  "malaysia-thailand-singapore": {
    name: "Malaysia, Thailand and Singapore",
    durationWords: "nine day",
    itineraryNote:
      "The flow above is the typical nine day three country plan across Thailand, Malaysia, and Singapore. Our desk adjusts the order and the nights in each country on request.",
    seasonalNote:
      "The cool, dry months from November to February book earliest across all three countries. Message us as soon as your dates are set.",
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Bangkok",
        caption: "The Bangkok skyline along the Chao Phraya River at dusk",
        detail:
          "Land in Bangkok, clear the Thailand visa, and transfer to your hotel to rest before the three country journey begins.",
      },
      {
        day: "Day 2",
        title: "Bangkok temples and the Grand Palace",
        caption: "The Grand Palace and Wat Phra Kaew in Bangkok",
        detail:
          "A guided tour of the Grand Palace and Wat Phra Kaew, Wat Pho and Wat Arun, and the Golden Buddha at Wat Traimit, with a Chao Phraya cruise.",
      },
      {
        day: "Day 3",
        title: "Pattaya and Coral Island",
        caption: "Longtail boats at Coral Island near Pattaya",
        detail:
          "A day trip to Pattaya on the coast, with a speedboat to Coral Island and a stop at the Sanctuary of Truth on the shore.",
      },
      {
        day: "Day 4",
        title: "Fly to Kuala Lumpur, city tour",
        caption: "The Petronas Twin Towers over the Kuala Lumpur skyline",
        detail:
          "Fly to Kuala Lumpur and tour the Petronas Twin Towers and KLCC, Merdeka Square, the National Mosque, and the Batu Caves shrine.",
      },
      {
        day: "Day 5",
        title: "Genting Highlands day",
        caption: "The Awana Skyway cable car to Genting Highlands",
        detail:
          "A day in the cool hills of Genting Highlands, riding the Awana Skyway cable car to the resort, its theme parks, and the Chin Swee Caves Temple.",
      },
      {
        day: "Day 6",
        title: "Fly to Singapore, the Night Safari",
        caption: "A tram on the Night Safari in Singapore",
        detail:
          "Fly to Singapore, transfer to your hotel, and head out for the Night Safari, the world's first nocturnal wildlife park, after dark.",
      },
      {
        day: "Day 7",
        title: "Singapore city tour",
        caption: "The Merlion and Marina Bay Sands in Singapore",
        detail:
          "A city tour with the Merlion and Marina Bay, Gardens by the Bay and its Supertrees, and the streets of Chinatown, Little India, and Orchard Road.",
      },
      {
        day: "Day 8",
        title: "Sentosa Island",
        caption: "Universal Studios Singapore on Sentosa Island",
        detail:
          "A full day on Sentosa with Universal Studios, the SEA Aquarium, the beaches, and the Wings of Time show over the water in the evening.",
      },
      {
        day: "Day 9",
        title: "Departure",
        caption: "Changi Airport in Singapore for the flight home",
        detail:
          "Check out and transfer to Changi Airport for your return flight to Pakistan.",
      },
    ],
    attractions: [
      {
        name: "Bangkok, the Grand Palace and temples",
        caption: "The Grand Palace and Wat Phra Kaew in Bangkok",
        detail:
          "The Thai capital opens the trip with the gilded Grand Palace and Wat Phra Kaew, the reclining Buddha at Wat Pho, Wat Arun across the river, and the Golden Buddha at Wat Traimit.",
      },
      {
        name: "Pattaya and Coral Island",
        caption: "The beach and clear water of Coral Island near Pattaya",
        detail:
          "A coastal day from Bangkok, with a speedboat to Coral Island for the beaches and the towering hand carved Sanctuary of Truth on the Pattaya shore.",
      },
      {
        name: "Kuala Lumpur, the Petronas Towers and Batu Caves",
        caption: "The rainbow steps at Batu Caves near Kuala Lumpur",
        detail:
          "Malaysia brings the Petronas Twin Towers and KLCC, the National Mosque, and the Batu Caves shrine beneath the Lord Murugan statue, in a Muslim majority city where halal food is everywhere.",
      },
      {
        name: "Genting Highlands",
        caption: "The resort of Genting Highlands above the clouds",
        detail:
          "A hilltop resort reached by the Awana Skyway cable car past the Chin Swee Caves Temple, with theme parks and a cool climate above the Kuala Lumpur heat.",
      },
      {
        name: "Singapore, Marina Bay and Gardens by the Bay",
        caption: "The Marina Bay Sands and the Supertrees in Singapore",
        detail:
          "The final country brings the Marina Bay Sands, the Supertrees of Gardens by the Bay, and the Merlion on the waterfront, with the evening light shows over the bay.",
      },
      {
        name: "Sentosa and the Night Safari",
        caption: "Universal Studios Singapore on Sentosa Island",
        detail:
          "Sentosa Island holds Universal Studios, the SEA Aquarium, and the Wings of Time show, while the Night Safari tours nocturnal wildlife by tram after dark, a strong family close to the trip.",
      },
    ],
    gallery: [
      "The Grand Palace in Bangkok",
      "Coral Island near Pattaya",
      "The Petronas Twin Towers in Kuala Lumpur",
      "Genting Highlands above the clouds",
      "The Marina Bay Sands in Singapore",
      "Universal Studios on Sentosa Island",
    ],
    practical: [
      { icon: "clock", label: "Best time to visit", value: "November to February, cool and dry" },
      {
        icon: "tag",
        label: "Currency",
        value: "Thai baht, Malaysian ringgit, Singapore dollar",
      },
      { icon: "meal", label: "Halal food", value: "Widely available, easiest in Malaysia" },
      { icon: "clock", label: "Time zone", value: "GMT plus 7 to plus 8" },
      { icon: "users", label: "Language", value: "Thai and Malay, with English throughout" },
      { icon: "route", label: "Driving side", value: "Left hand side of the road" },
      {
        icon: "pin",
        label: "Countries",
        value: "Thailand, Malaysia, and Singapore",
      },
    ],
    costDrivers: [
      {
        icon: "clock",
        factor: "Travel season",
        detail:
          "The cool, dry months from November to February sit highest across all three countries, while the green season runs lower.",
      },
      {
        icon: "hotel",
        factor: "Hotels across three cities",
        detail:
          "A higher star rating or central addresses in Bangkok, Kuala Lumpur, and Singapore lift the price, while standard four star hotels hold it down.",
      },
      {
        icon: "plane",
        factor: "The two inter country flights",
        detail:
          "The Bangkok to Kuala Lumpur and Kuala Lumpur to Singapore sectors sit inside the package, and their fares move with the season and how early you book.",
      },
      {
        icon: "camera",
        factor: "Excursions and add ons",
        detail:
          "Universal Studios, island trips, extra Sentosa or Genting time, and a fourth country leg add to the base three country package.",
      },
    ],
    visaIntro:
      "The trip needs three visas, and our team prepares and files each. Verify the current rules at the official",
    visaLinks: [
      { label: "Thailand e visa portal", href: "https://www.thaievisa.go.th" },
      { label: "Malaysia e visa portal", href: "https://malaysiavisa.imi.gov.my" },
      { label: "Singapore Immigration and Checkpoints Authority", href: "https://www.ica.gov.sg" },
    ],
  },
};

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
  // Some pages use a keyword-aligned visible name while the slug stays fixed.
  const name =
    pkg.slug === "ramadan-umrah-special"
      ? "Ramadan Umrah Package"
      : pkg.slug === "dubai-5-days"
        ? "Dubai Tour Package"
        : pkg.slug === "turkey-7-days"
          ? "Turkey Tour"
          : pkg.title;
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
