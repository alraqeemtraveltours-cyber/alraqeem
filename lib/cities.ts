export type City = {
  slug: string;
  name: string;
  region: string;
  headline: string;
  intro: string;
  detail: string;
  popular: string[];
};

export const cities: City[] = [
  {
    slug: "islamabad",
    name: "Islamabad",
    region: "Islamabad Capital Territory",
    headline: "Travel Agency Serving Islamabad",
    intro:
      "Al Raqeem Travel & Tours serves families and professionals across Islamabad with complete Umrah packages, international tours and visa processing. From F sectors to Bahria Enclave, we handle your entire journey so you only have to pack.",
    detail:
      "Islamabad travelers fly out of Islamabad International Airport, and we build every itinerary around direct flight options from ISB. Our team manages Saudi e-visas, hotel bookings near Haram, and airport transfers end to end. For international trips we process Dubai, Turkey, Malaysia and Schengen visit visas with document preparation done for you.",
    popular: [
      "Premium Umrah packages with 5-star hotels",
      "Dubai and Turkey family tours",
      "Schengen and UK visit visa guidance",
    ],
  },
  {
    slug: "lahore",
    name: "Lahore",
    region: "Punjab",
    headline: "Travel Agency Serving Lahore",
    intro:
      "From DHA and Gulberg to Johar Town, Al Raqeem Travel & Tours brings premium Umrah, Hajj and international travel services to Lahore. We plan around direct departures from Allama Iqbal International Airport.",
    detail:
      "Lahore is Pakistan's busiest market for family Umrah travel, and our packages are designed for groups of all sizes. We arrange connected hotel rooms, wheelchair assistance for elders, and Ziyarat tours in both Makkah and Madinah. For leisure travel, our Turkey, Baku and Far East packages depart regularly from LHE.",
    popular: [
      "Family Umrah packages with group discounts",
      "Turkey and Baku honeymoon tours",
      "Malaysia and Thailand combined trips",
    ],
  },
  {
    slug: "rawalpindi",
    name: "Rawalpindi",
    region: "Punjab",
    headline: "Travel Agency Serving Rawalpindi",
    intro:
      "Al Raqeem Travel & Tours offers Rawalpindi residents complete Umrah, Hajj and tour services with pickup coordination from Saddar, Bahria Town and DHA. Islamabad International Airport is minutes away, and we handle everything in between.",
    detail:
      "Many of our Rawalpindi clients are armed forces families and overseas Pakistanis arranging travel for parents. We specialize in assisted travel for senior pilgrims, including airport wheelchair service and hotels closest to Haram entrances. Visit visas for UAE, Saudi Arabia and the UK are processed with full document support.",
    popular: [
      "Assisted Umrah for senior parents",
      "Dubai visit visas with hotel bookings",
      "Family Umrah and Gulf tour packages",
    ],
  },
  {
    slug: "peshawar",
    name: "Peshawar",
    region: "Khyber Pakhtunkhwa",
    headline: "Travel Agency Serving Peshawar",
    intro:
      "Peshawar travelers trust Al Raqeem Travel & Tours for Umrah packages departing from Bacha Khan International Airport, plus international tours and visa services across Hayatabad, University Town and the city.",
    detail:
      "Direct Saudi flights from Peshawar make it one of the most convenient Umrah departure points in Pakistan, and our packages are built around these routes. We also serve the large overseas community of the region with Gulf visit visas, family visa processing and ticketing on Gulf carriers at competitive fares.",
    popular: [
      "Direct-flight Umrah packages from Peshawar",
      "Gulf visit visas and ticketing",
      "Group Umrah for extended families",
    ],
  },
  {
    slug: "charsadda",
    name: "Charsadda",
    region: "Khyber Pakhtunkhwa",
    headline: "Your Local Travel Agency in Charsadda",
    intro:
      "Our head office is located in Charsadda. Walk in, sit with our team over a cup of tea, and plan your Umrah, Hajj or international trip face to face. Al Raqeem Travel & Tours is Charsadda's own travel company.",
    detail:
      "Being based in Charsadda means you deal with people you know, not a call center. We handle passports, Saudi e-visas, ticketing and hotel bookings from our office, and our clients are welcome to drop in any time for updates. Departures are arranged from both Peshawar and Islamabad airports depending on the best fares for your dates.",
    popular: [
      "Walk-in Umrah bookings and consultation",
      "Passport and visa document services",
      "Group bookings for villages and families",
    ],
  },
  {
    slug: "tangi",
    name: "Tangi",
    region: "Khyber Pakhtunkhwa",
    headline: "Travel Agency Serving Tangi",
    intro:
      "Al Raqeem Travel & Tours serves Tangi and surrounding areas from our nearby Charsadda head office. Umrah packages, visit visas and ticketing without traveling to Peshawar or Islamabad.",
    detail:
      "Families in Tangi no longer need to go to the city for reliable travel services. Our Charsadda office is a short drive away, and we offer home document collection for group Umrah bookings in the Tangi area. We arrange flights from Peshawar airport with transport coordination for groups.",
    popular: [
      "Group Umrah with local transport to airport",
      "Home document collection service",
      "Gulf work and visit visa guidance",
    ],
  },
  {
    slug: "shabqadar",
    name: "Shabqadar",
    region: "Khyber Pakhtunkhwa",
    headline: "Travel Agency Serving Shabqadar",
    intro:
      "Shabqadar families choose Al Raqeem Travel & Tours for honest pricing and personal service from our Charsadda head office. Complete Umrah, Hajj and international travel arrangements close to home.",
    detail:
      "We understand the travel needs of Shabqadar, from first-time pilgrims to families visiting relatives in the Gulf. Our team explains every cost upfront with no hidden charges, prepares all documents, and stays in contact on WhatsApp throughout your journey from departure to safe return.",
    popular: [
      "Economy Umrah packages with clear pricing",
      "Family visit visas for UAE and Saudi Arabia",
      "WhatsApp support throughout your trip",
    ],
  },
];

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}
