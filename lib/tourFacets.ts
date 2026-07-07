import type { Facet } from "@/components/packages/TourFacet";

// Theme facet pages, each groups the destinations we already serve by a theme.
// Real data only, every note is drawn from the built destination pages. Adding a
// facet is a data entry here plus a thin route file.
export const tourFacets: Record<string, Facet> = {
  "honeymoon-packages": {
    slug: "honeymoon-packages",
    eyebrow: "Honeymoon tours",
    h1: "Honeymoon Tour Packages from Pakistan",
    heading: "Honeymoon tours",
    destsHeading: "Romantic destinations we serve",
    intro:
      "A honeymoon planned end to end from Charsadda, with the visa, flights, and hotels in one booking so you travel and we arrange it. Cappadocia balloons in Turkey, the Caspian boulevard in Baku, the islands of Malaysia and Thailand, and the lights of Dubai and Singapore, each shaped for a couple, quoted on inquiry for your dates.",
    quoteMessage:
      "Assalam o Alaikum, I want a quote for a honeymoon tour package for my dates.",
    quoteLabel: "Get a honeymoon quote",
    ctaTitle: "Planning your honeymoon?",
    ctaSubtitle:
      "Tell our desk your destination, dates, and how many nights, and we quote a couples trip with the hotels, transfers, and quiet dinners arranged.",
    destinations: [
      {
        name: "Turkey",
        href: "/tours/turkey",
        tag: "Balloons and the Bosphorus",
        note: "A dawn balloon over the Cappadocia valleys, a Bosphorus cruise, and a cave hotel on request, one of the most loved honeymoon routes.",
      },
      {
        name: "Baku, Azerbaijan",
        href: "/tours/baku",
        tag: "Caspian and the Old City",
        note: "Baku Boulevard along the Caspian, the Old City lanes, the Flame Towers light show, and a mountain day in Gabala for a quiet couple's trip.",
      },
      {
        name: "Malaysia",
        href: "/tours/malaysia",
        tag: "Islands and city lights",
        note: "Kuala Lumpur lights, the cool hills of Genting, and an optional Langkawi island add on, halal friendly and easy for a Muslim couple.",
      },
      {
        name: "Thailand",
        href: "/tours/thailand",
        tag: "Beaches and islands",
        note: "The temples and river of Bangkok with the beaches of Pattaya, or an optional Phuket and Phi Phi island leg for a beach honeymoon.",
      },
      {
        name: "Dubai",
        href: "/tours/dubai",
        tag: "Luxury and the Marina",
        note: "A Marina dhow cruise, a desert safari, and time along Jumeirah Beach, with a higher star stay or a private tour on request.",
      },
      {
        name: "Singapore",
        href: "/tours/singapore",
        tag: "Modern and polished",
        note: "Gardens by the Bay, the Marina Bay light show, and a Sentosa day, a compact, polished trip for a first honeymoon abroad.",
      },
    ],
    faqs: [
      {
        q: "Which destination is best for a honeymoon?",
        a: "Turkey leads for the Cappadocia balloons and the Bosphorus, Baku for a quiet Caspian trip, and Malaysia or Thailand for islands and beaches. Dubai and Singapore suit couples who want city lights and comfort. Tell our desk your taste and dates and we advise the best fit.",
      },
      {
        q: "Do you arrange a couples pace and special touches?",
        a: "Yes. Our desk sets a relaxed couples pace, arranges a comfortable or higher star hotel, and adds quiet dinners, an island day, or a private tour on request. Share what you want from the trip, and we shape the days and the hotels around the two of you.",
      },
      {
        q: "Is a honeymoon tour halal and Muslim friendly?",
        a: "Yes. Malaysia, Turkey, and Baku sit in Muslim countries where halal food is everywhere and prayer is easy, and our desk arranges halal meals and prayer stops on every route. See our Muslim friendly tours for the halal focused list.",
      },
      {
        q: "How many days is enough for a honeymoon?",
        a: "Five to seven nights suit most honeymoons, a city and a beach or a balloon day, while a two country combo runs longer. Our desk shapes the length around your leave and budget. Tell us your window and we plan the right number of nights.",
      },
      {
        q: "What is included in a honeymoon package?",
        a: "The package covers the visa, return flights, hotels with breakfast, transfers, and the guided sightseeing named in the itinerary, in one booking. Optional upgrades, a beach leg, or private tours arrive on request. Our desk confirms every item in writing before you pay.",
      },
      {
        q: "How do I get a honeymoon quote?",
        a: "Message our desk on WhatsApp with your destination, dates, and number of nights, and we send the current best price for a couples trip. Rates update weekly with airfare and hotel availability, and we quote the best price for your dates with no hidden charges.",
      },
    ],
  },

  "family-packages": {
    slug: "family-packages",
    eyebrow: "Family tours",
    h1: "Family Tour Packages from Pakistan",
    heading: "Family tours",
    destsHeading: "Family friendly destinations we serve",
    intro:
      "A family trip handled end to end from Charsadda, with the visa, flights, hotels, and sightseeing in one booking and a pace our desk sets for children and elders. Theme parks in Dubai and Singapore, the hills of Genting, halal ease across Malaysia, and gentle city tours, quoted on inquiry for your dates.",
    quoteMessage:
      "Assalam o Alaikum, I want a quote for a family tour package for my dates.",
    quoteLabel: "Get a family quote",
    ctaTitle: "Planning a family trip?",
    ctaSubtitle:
      "Tell our desk your destination, dates, and how many adults and children, and we quote a family trip with connected rooms and a steady pace.",
    destinations: [
      {
        name: "Dubai",
        href: "/tours/dubai",
        tag: "Theme parks and desert",
        note: "The Burj Khalifa, the Dubai Aquarium, a desert safari, and the fountain show, with halal food everywhere for a comfortable family trip.",
      },
      {
        name: "Singapore",
        href: "/tours/singapore",
        tag: "Universal and Sentosa",
        note: "Universal Studios and the SEA Aquarium on Sentosa, Gardens by the Bay, and the Night Safari, a clean, safe city that children love.",
      },
      {
        name: "Malaysia",
        href: "/tours/malaysia",
        tag: "Genting and halal ease",
        note: "The theme parks and cable car of Genting Highlands, Batu Caves, and halal food everywhere, the gentlest first trip abroad for a Muslim family.",
      },
      {
        name: "Thailand",
        href: "/tours/thailand",
        tag: "Temples and beaches",
        note: "The gold temples and river of Bangkok, a Coral Island beach day at Pattaya, and easy add ons like SEA LIFE Ocean World.",
      },
      {
        name: "Turkey",
        href: "/tours/turkey",
        tag: "History and balloons",
        note: "Istanbul's old city, a Bosphorus cruise, and the Cappadocia balloons, a mix of history and wonder at a pace that suits all ages.",
      },
      {
        name: "Baku, Azerbaijan",
        href: "/tours/baku",
        tag: "Walkable and easy",
        note: "A compact, walkable city, the fire sites of Yanardag and Ateshgah, and a cable car day in Gabala, an easy short trip for a family.",
      },
    ],
    faqs: [
      {
        q: "Which destinations are best for families?",
        a: "Dubai and Singapore lead for theme parks and aquariums, Malaysia for Genting and halal ease, and Thailand for temples and easy beaches. Turkey and Baku suit families who want history and a gentle pace. Tell our desk your children's ages and we advise the best fit.",
      },
      {
        q: "Do you set a comfortable pace for children and elders?",
        a: "Yes. Our desk builds a steady pace with connected rooms, short transfers, and rest between the sightseeing, and adjusts the days for younger children and elders. Share your group and any needs, and we shape the trip and the hotels around them.",
      },
      {
        q: "Is the food halal for a Muslim family?",
        a: "Yes. Malaysia, Turkey, Baku, and Dubai have halal food everywhere, and in Thailand and Singapore halal restaurants sit in the tourist areas. Our desk plans meals and prayer stops so a Muslim family from Pakistan stays comfortable throughout the trip.",
      },
      {
        q: "How many days is enough for a family tour?",
        a: "Five to eight nights suit most families, a city and a park or a beach, while a two country combo runs longer. Our desk shapes the length around your leave, budget, and the children's stamina. Tell us your window and we plan the right number of nights.",
      },
      {
        q: "What is included in a family package?",
        a: "The package covers the visa, return flights, hotels with breakfast, transfers, and the guided sightseeing named in the itinerary, in one booking. Attraction tickets like Universal Studios arrive on request. Our desk confirms every item in writing before you pay.",
      },
      {
        q: "How do I get a family quote?",
        a: "Message our desk on WhatsApp with your destination, dates, and how many adults and children, and we send the current best price for a family trip. Rates update weekly with airfare and hotel availability, and we quote the best price with no hidden charges.",
      },
    ],
  },

  "group-tours": {
    slug: "group-tours",
    eyebrow: "Group tours",
    h1: "Group Tour Packages from Pakistan",
    heading: "Group tours",
    destsHeading: "Group destinations we serve",
    intro:
      "Group tours for families, offices, and community groups of any size, planned end to end from Charsadda with the visas, flights, hotels, and sightseeing in one booking. Join a group departure for the friendliest price, or ask our desk for a private group tour with your own vehicle and guide, quoted on inquiry for your dates.",
    quoteMessage:
      "Assalam o Alaikum, I want a quote for a group tour package for my group.",
    quoteLabel: "Get a group quote",
    ctaTitle: "Planning a group trip?",
    ctaSubtitle:
      "Tell our desk your destination, dates, and group size, and we design the itinerary, arrange every document, and send one quote for the whole group.",
    destinations: [
      {
        name: "Dubai",
        href: "/tours/dubai",
        tag: "Group departures",
        note: "The Burj Khalifa, a desert safari, and a Marina cruise, arranged for a family, office, or community group with one booking and one quote.",
      },
      {
        name: "Turkey",
        href: "/tours/turkey",
        tag: "Group departures",
        note: "Istanbul and Cappadocia across a week, with a coach, a guide, and hotels arranged for the whole group at the friendliest price.",
      },
      {
        name: "Baku, Azerbaijan",
        href: "/tours/baku",
        tag: "Group departures",
        note: "A short, easy trip for a group, the Old City, the fire sites, and a Gabala mountain day, with a simple e visa handled for everyone.",
      },
      {
        name: "Malaysia",
        href: "/tours/malaysia",
        tag: "Group departures",
        note: "Kuala Lumpur, Genting, and Putrajaya, halal friendly and easy for a large Muslim group, with connected rooms and a shared coach.",
      },
      {
        name: "Thailand",
        href: "/tours/thailand",
        tag: "Group departures",
        note: "Bangkok and Pattaya for a group, the temples, a Coral Island day, and shopping, arranged with transfers and guides for everyone.",
      },
      {
        name: "Singapore",
        href: "/tours/singapore",
        tag: "Group departures",
        note: "The Merlion, Gardens by the Bay, and a Sentosa day, a compact group trip in a clean, safe city with simple logistics.",
      },
    ],
    faqs: [
      {
        q: "What group sizes do you handle?",
        a: "Our desk arranges groups of any size, from an extended family to an office trip or a community tour of dozens. Larger groups often unlock better hotel and coach rates. Share your headcount and destination, and we quote the whole group in one booking.",
      },
      {
        q: "Are group tours cheaper than a private trip?",
        a: "A group departure with a set itinerary carries the friendliest price, since the coach, guide, and hotels are shared. A private group tour with your own vehicle and pace costs more but flexes to your plan. Tell our desk your group and we quote both options.",
      },
      {
        q: "Do you build a custom itinerary for our group?",
        a: "Yes. Our desk designs the route, the hotels, and the sightseeing around your group, whether a family, an office, or a community, to any destination we serve. Share your dates, size, and the experience you want, and we send one plan and one quote.",
      },
      {
        q: "Is the trip halal friendly for a Muslim group?",
        a: "Yes. Malaysia, Turkey, Baku, and Dubai have halal food everywhere, and our desk arranges halal meals and prayer stops on every route, including in Thailand and Singapore. Prayer times and meals are planned so a Muslim group travels comfortably.",
      },
      {
        q: "Do you handle all the documents for the group?",
        a: "Yes. Our desk prepares and files the visa for every traveler, books the flights and hotels, and coordinates the transfers, so the group leader handles one booking rather than many. Every document is checked before filing so the files clear cleanly.",
      },
      {
        q: "How do I get a group quote?",
        a: "Message our desk on WhatsApp with your destination, dates, and group size, and we send one quote for the whole group. Rates update weekly with airfare and hotel availability, and we quote the current best price with no hidden charges.",
      },
    ],
  },

  "beach-and-adventure-tours": {
    slug: "beach-and-adventure-tours",
    eyebrow: "Beach and adventure tours",
    h1: "Beach and Adventure Tour Packages from Pakistan",
    heading: "Beach and adventure tours",
    destsHeading: "Beach and adventure destinations we serve",
    intro:
      "Beaches, islands, and mountain adventures handled end to end from Charsadda, with the visa, flights, and hotels in one booking. The islands of Thailand and Malaysia, the mountains and cable cars of Baku, the Cappadocia balloons in Turkey, and the Dubai desert, quoted on inquiry for your dates.",
    quoteMessage:
      "Assalam o Alaikum, I want a quote for a beach or adventure tour for my dates.",
    quoteLabel: "Get a beach or adventure quote",
    ctaTitle: "Chasing beaches or mountains?",
    ctaSubtitle:
      "Tell our desk where you want to go and when, and we quote the islands, the trekking, or the desert with the flights and hotels arranged.",
    destinations: [
      {
        name: "Thailand",
        href: "/tours/thailand",
        tag: "Beaches and islands",
        note: "The beaches of Pattaya and Coral Island, and an optional Phuket leg with the Phi Phi Islands and James Bond Island for a beach trip.",
      },
      {
        name: "Malaysia",
        href: "/tours/malaysia",
        tag: "Islands and highlands",
        note: "The beaches and cable car of Langkawi and the cool highlands of Genting, halal friendly islands and hills in one country.",
      },
      {
        name: "Baku, Azerbaijan",
        href: "/tours/baku",
        tag: "Mountains and cable car",
        note: "The Tufandag cable car and Nohur Lake in the Gabala mountains, the Gobustan mud volcanoes, and the fire sites of the Land of Fire.",
      },
      {
        name: "Turkey",
        href: "/tours/turkey",
        tag: "Balloons and valleys",
        note: "A dawn hot air balloon over the Cappadocia valleys and the fairy chimneys, a classic soft adventure on the Turkey route.",
      },
      {
        name: "Dubai",
        href: "/tours/dubai",
        tag: "Desert safari",
        note: "A desert safari with dune bashing, camel rides, and a BBQ under the stars, the adventure side of a Dubai city trip.",
      },
      {
        name: "Singapore",
        href: "/tours/singapore",
        tag: "Sentosa coast",
        note: "The beaches and rides of Sentosa Island and the cable car over the harbour, an easy coastal day in the city.",
      },
    ],
    faqs: [
      {
        q: "Which destinations are best for a beach trip?",
        a: "Thailand leads for beaches and islands, Pattaya, Phuket, and the Phi Phi Islands, with Langkawi in Malaysia and the Sentosa coast in Singapore close behind. Tell our desk your dates and we advise the best beach fit and the right season.",
      },
      {
        q: "What adventure activities do the tours include?",
        a: "The tours include a Cappadocia balloon flight in Turkey, the Tufandag cable car and the Gobustan mud volcanoes in Baku, and a Dubai desert safari with dune bashing. Optional island boat trips and water sports arrive on request, confirmed in writing.",
      },
      {
        q: "Do you run trekking tours in Pakistan's northern areas?",
        a: "Our northern areas tours are on the way, Swat, Hunza, Skardu, and Fairy Meadows, the trekking and mountain trips nearest our Charsadda base. Message our desk for the current northern areas plan, and we quote a trip for your dates and group.",
      },
      {
        q: "When is the best time for a beach tour?",
        a: "November to February is the cool, dry window for the Thailand and Malaysia beaches, while Baku and Turkey suit spring and autumn for the mountains and valleys. Our desk builds the trip around comfortable weather and your dates.",
      },
      {
        q: "What is included in a beach or adventure package?",
        a: "The package covers the visa, return flights, hotels with breakfast, transfers, and the sightseeing named in the itinerary, in one booking. Optional island trips, water sports, or the balloon flight arrive on request. Our desk confirms every item in writing.",
      },
      {
        q: "How do I get a beach or adventure quote?",
        a: "Message our desk on WhatsApp with your destination, dates, and group size, and we send the current best price. Rates update weekly with airfare and hotel availability, and we quote the best price for your dates with no hidden charges.",
      },
    ],
  },
};
