// Real, openly licensed photos for the tour cards, one entry per slug, arrays
// in the same order as the itinerary, attractions, and gallery data. Every file
// lives under public/images/tours and is sourced from Wikimedia Commons under a
// free licence (CC BY, CC BY SA, CC0, or public domain), never a competitor or
// Google image. Attribution for each file sits in the matching
// public/images/tours/<slug>/_credits.json and on the /photo-credits page. An
// empty string or a missing entry falls back to the branded panel, so nothing
// breaks. The caption still names the entity and feeds the alt text.
export type TourImageSet = {
  itinerary?: string[];
  attractions?: string[];
  gallery?: string[];
};

const D = "/images/tours"; // base path

export const tourImages: Record<string, TourImageSet> = {
  "dubai-5-days": {
    itinerary: [
      `${D}/dubai/burj-khalifa.jpg`,
      `${D}/dubai/dubai-mall.jpg`,
      `${D}/dubai/desert-safari.jpg`,
      `${D}/dubai/dubai-marina.jpg`,
      `${D}/dubai/burj-khalifa.jpg`,
    ],
    attractions: [
      `${D}/dubai/burj-khalifa.jpg`,
      `${D}/dubai/dubai-mall.jpg`,
      `${D}/dubai/desert-safari.jpg`,
      `${D}/dubai/dubai-marina.jpg`,
      `${D}/dubai/palm-jumeirah.jpg`,
      `${D}/dubai/abu-dhabi-mosque.jpg`,
    ],
    gallery: [
      `${D}/dubai/burj-khalifa.jpg`,
      `${D}/dubai/dubai-mall.jpg`,
      `${D}/dubai/desert-safari.jpg`,
      `${D}/dubai/dubai-marina.jpg`,
      `${D}/dubai/palm-jumeirah.jpg`,
      `${D}/dubai/abu-dhabi-mosque.jpg`,
    ],
  },

  "turkey-7-days": {
    itinerary: [
      `${D}/turkey/bosphorus.jpg`,
      `${D}/turkey/hagia-sophia.jpg`,
      `${D}/turkey/bosphorus.jpg`,
      `${D}/turkey/cappadocia.jpg`,
      `${D}/turkey/cappadocia.jpg`,
      `${D}/turkey/grand-bazaar.jpg`,
      `${D}/turkey/hagia-sophia.jpg`,
    ],
    attractions: [
      `${D}/turkey/hagia-sophia.jpg`,
      `${D}/turkey/blue-mosque.jpg`,
      `${D}/turkey/bosphorus.jpg`,
      `${D}/turkey/cappadocia.jpg`,
      `${D}/turkey/grand-bazaar.jpg`,
      `${D}/turkey/pamukkale.jpg`,
    ],
    gallery: [
      `${D}/turkey/hagia-sophia.jpg`,
      `${D}/turkey/blue-mosque.jpg`,
      `${D}/turkey/bosphorus.jpg`,
      `${D}/turkey/cappadocia.jpg`,
      `${D}/turkey/cappadocia.jpg`,
      `${D}/turkey/grand-bazaar.jpg`,
    ],
  },

  "baku-5-days": {
    itinerary: [
      `${D}/baku/flame-towers.jpg`,
      `${D}/baku/old-city.jpg`,
      `${D}/baku/gobustan.jpg`,
      "",
      `${D}/baku/flame-towers.jpg`,
    ],
    attractions: [
      `${D}/baku/old-city.jpg`,
      `${D}/baku/flame-towers.jpg`,
      `${D}/baku/ateshgah.jpg`,
      `${D}/baku/yanardag.jpg`,
      `${D}/baku/gobustan.jpg`,
      "",
    ],
    gallery: [
      `${D}/baku/flame-towers.jpg`,
      `${D}/baku/old-city.jpg`,
      `${D}/baku/ateshgah.jpg`,
      `${D}/baku/yanardag.jpg`,
      `${D}/baku/gobustan.jpg`,
      "",
    ],
  },

  malaysia: {
    itinerary: [
      `${D}/malaysia/petronas.jpg`,
      `${D}/malaysia/batu-caves.jpg`,
      `${D}/malaysia/genting.jpg`,
      `${D}/malaysia/putra-mosque.jpg`,
      `${D}/malaysia/langkawi.jpg`,
      `${D}/malaysia/petronas.jpg`,
    ],
    attractions: [
      `${D}/malaysia/petronas.jpg`,
      `${D}/malaysia/batu-caves.jpg`,
      `${D}/malaysia/genting.jpg`,
      `${D}/malaysia/national-mosque.jpg`,
      `${D}/malaysia/langkawi.jpg`,
      `${D}/malaysia/putra-mosque.jpg`,
      `${D}/malaysia/george-town.jpg`,
      `${D}/malaysia/cameron-highlands.jpg`,
    ],
    gallery: [
      `${D}/malaysia/petronas.jpg`,
      `${D}/malaysia/batu-caves.jpg`,
      `${D}/malaysia/genting.jpg`,
      `${D}/malaysia/national-mosque.jpg`,
      `${D}/malaysia/putra-mosque.jpg`,
      `${D}/malaysia/langkawi.jpg`,
    ],
  },

  thailand: {
    itinerary: [
      `${D}/thailand/grand-palace.jpg`,
      `${D}/thailand/wat-arun.jpg`,
      `${D}/thailand/coral-island.png`,
      `${D}/thailand/sanctuary-of-truth.jpg`,
      `${D}/thailand/golden-buddha.jpg`,
      `${D}/thailand/grand-palace.jpg`,
    ],
    attractions: [
      `${D}/thailand/grand-palace.jpg`,
      `${D}/thailand/wat-arun.jpg`,
      `${D}/thailand/golden-buddha.jpg`,
      `${D}/thailand/coral-island.png`,
      `${D}/thailand/sanctuary-of-truth.jpg`,
      `${D}/thailand/phi-phi.jpg`,
      `${D}/thailand/krabi.jpg`,
    ],
    gallery: [
      `${D}/thailand/grand-palace.jpg`,
      `${D}/thailand/wat-arun.jpg`,
      `${D}/thailand/golden-buddha.jpg`,
      `${D}/thailand/coral-island.png`,
      `${D}/thailand/sanctuary-of-truth.jpg`,
      `${D}/thailand/phi-phi.jpg`,
    ],
  },

  singapore: {
    itinerary: [
      `${D}/singapore/marina-bay-sands.jpg`,
      `${D}/singapore/merlion.jpg`,
      `${D}/singapore/sentosa-universal.jpg`,
      `${D}/singapore/gardens-by-the-bay.jpg`,
      `${D}/singapore/jewel-changi.jpg`,
    ],
    attractions: [
      `${D}/singapore/marina-bay-sands.jpg`,
      `${D}/singapore/gardens-by-the-bay.jpg`,
      `${D}/singapore/sentosa-universal.jpg`,
      `${D}/singapore/merlion.jpg`,
      `${D}/singapore/night-safari.jpg`,
      `${D}/singapore/singapore-flyer.jpg`,
      `${D}/singapore/kampong-glam.jpg`,
      `${D}/singapore/jewel-changi.jpg`,
    ],
    gallery: [
      `${D}/singapore/marina-bay-sands.jpg`,
      `${D}/singapore/gardens-by-the-bay.jpg`,
      `${D}/singapore/sentosa-universal.jpg`,
      `${D}/singapore/merlion.jpg`,
      `${D}/singapore/night-safari.jpg`,
      `${D}/singapore/singapore-flyer.jpg`,
    ],
  },

  swat: {
    itinerary: [
      `${D}/swat/bahrain.jpg`,
      `${D}/swat/malam-jabba.jpg`,
      `${D}/swat/kalam.jpg`,
      `${D}/swat/mahodand-lake.jpg`,
      `${D}/swat/bahrain.jpg`,
    ],
    attractions: [
      `${D}/swat/malam-jabba.jpg`,
      `${D}/swat/kalam.jpg`,
      `${D}/swat/mahodand-lake.jpg`,
      `${D}/swat/kalam.jpg`,
      `${D}/swat/white-palace.jpg`,
      `${D}/swat/bahrain.jpg`,
      `${D}/swat/swat-museum.jpg`,
    ],
    gallery: [
      `${D}/swat/bahrain.jpg`,
      `${D}/swat/malam-jabba.jpg`,
      `${D}/swat/kalam.jpg`,
      `${D}/swat/mahodand-lake.jpg`,
      `${D}/swat/kalam.jpg`,
      `${D}/swat/white-palace.jpg`,
    ],
  },

  "kumrat-valley": {
    itinerary: [
      `${D}/kumrat/panjkora.jpg`,
      `${D}/kumrat/kumrat-forest.jpg`,
      `${D}/kumrat/jahaz-banda.jpg`,
      `${D}/kumrat/panjkora.jpg`,
    ],
    attractions: [
      `${D}/kumrat/kumrat-forest.jpg`,
      `${D}/kumrat/kumrat-waterfall.jpg`,
      `${D}/kumrat/jahaz-banda.jpg`,
      `${D}/kumrat/katora-lake.jpg`,
      `${D}/kumrat/panjkora.jpg`,
      `${D}/kumrat/panjkora.jpg`,
      `${D}/kumrat/kumrat-forest.jpg`,
    ],
    gallery: [
      `${D}/kumrat/panjkora.jpg`,
      `${D}/kumrat/kumrat-forest.jpg`,
      `${D}/kumrat/kumrat-waterfall.jpg`,
      `${D}/kumrat/jahaz-banda.jpg`,
      `${D}/kumrat/katora-lake.jpg`,
      `${D}/kumrat/panjkora.jpg`,
    ],
  },

  chitral: {
    itinerary: [
      `${D}/chitral/tirich-mir.jpg`,
      `${D}/chitral/chitral-fort.jpg`,
      `${D}/chitral/garam-chashma.jpg`,
      `${D}/chitral/kalash-bumburet.jpg`,
      `${D}/chitral/tirich-mir.jpg`,
    ],
    attractions: [
      `${D}/chitral/chitral-fort.jpg`,
      `${D}/chitral/chitral-fort.jpg`,
      `${D}/chitral/tirich-mir.jpg`,
      `${D}/chitral/garam-chashma.jpg`,
      `${D}/chitral/kalash-bumburet.jpg`,
      `${D}/chitral/shandur.jpg`,
      `${D}/chitral/chitral-gol.jpg`,
    ],
    gallery: [
      `${D}/chitral/chitral-fort.jpg`,
      `${D}/chitral/chitral-fort.jpg`,
      `${D}/chitral/tirich-mir.jpg`,
      `${D}/chitral/garam-chashma.jpg`,
      `${D}/chitral/kalash-bumburet.jpg`,
      `${D}/chitral/shandur.jpg`,
    ],
  },

  hunza: {
    itinerary: [
      `${D}/hunza/rakaposhi.jpg`,
      `${D}/hunza/rakaposhi.jpg`,
      `${D}/hunza/baltit-fort.jpg`,
      `${D}/hunza/attabad-lake.jpg`,
      `${D}/hunza/khunjerab.jpg`,
      `${D}/hunza/passu-cones.jpg`,
      `${D}/hunza/rakaposhi.jpg`,
    ],
    attractions: [
      `${D}/hunza/baltit-fort.jpg`,
      `${D}/hunza/attabad-lake.jpg`,
      `${D}/hunza/passu-cones.jpg`,
      `${D}/hunza/khunjerab.jpg`,
      `${D}/hunza/rakaposhi.jpg`,
      `${D}/hunza/rakaposhi.jpg`,
      `${D}/hunza/naltar.jpg`,
    ],
    gallery: [
      `${D}/hunza/baltit-fort.jpg`,
      `${D}/hunza/attabad-lake.jpg`,
      `${D}/hunza/passu-cones.jpg`,
      `${D}/hunza/khunjerab.jpg`,
      `${D}/hunza/rakaposhi.jpg`,
      `${D}/hunza/rakaposhi.jpg`,
    ],
  },

  "kalash-valley": {
    itinerary: [
      `${D}/kalash/lowari-tunnel.jpg`,
      `${D}/kalash/bumburet.jpg`,
      `${D}/kalash/rumbur.jpg`,
      `${D}/chitral/chitral-fort.jpg`,
      `${D}/kalash/lowari-tunnel.jpg`,
    ],
    attractions: [
      `${D}/kalash/bumburet.jpg`,
      `${D}/kalash/rumbur.jpg`,
      `${D}/kalash/kalash-people.jpg`,
      `${D}/kalash/chilam-joshi.jpg`,
      `${D}/kalash/lowari-tunnel.jpg`,
      `${D}/chitral/chitral-fort.jpg`,
    ],
    gallery: [
      `${D}/kalash/bumburet.jpg`,
      `${D}/kalash/kalash-people.jpg`,
      `${D}/kalash/chilam-joshi.jpg`,
      `${D}/kalash/rumbur.jpg`,
      `${D}/kalash/lowari-tunnel.jpg`,
      `${D}/chitral/chitral-fort.jpg`,
    ],
  },

  // Combos reuse the single country files, no duplicate downloads.
  "malaysia-thailand-8-days": {
    itinerary: [
      `${D}/malaysia/petronas.jpg`,
      `${D}/malaysia/batu-caves.jpg`,
      `${D}/malaysia/genting.jpg`,
      `${D}/thailand/grand-palace.jpg`,
      `${D}/thailand/wat-arun.jpg`,
      `${D}/thailand/coral-island.png`,
      `${D}/thailand/phi-phi.jpg`,
      `${D}/thailand/grand-palace.jpg`,
    ],
    attractions: [
      `${D}/malaysia/petronas.jpg`,
      `${D}/malaysia/batu-caves.jpg`,
      `${D}/malaysia/genting.jpg`,
      `${D}/thailand/grand-palace.jpg`,
      `${D}/thailand/wat-arun.jpg`,
      `${D}/thailand/phi-phi.jpg`,
    ],
    gallery: [
      `${D}/malaysia/petronas.jpg`,
      `${D}/malaysia/batu-caves.jpg`,
      `${D}/malaysia/genting.jpg`,
      `${D}/thailand/grand-palace.jpg`,
      `${D}/thailand/wat-arun.jpg`,
      `${D}/thailand/phi-phi.jpg`,
    ],
  },

  "malaysia-thailand-singapore": {
    itinerary: [
      `${D}/thailand/grand-palace.jpg`,
      `${D}/thailand/wat-arun.jpg`,
      `${D}/thailand/coral-island.png`,
      `${D}/malaysia/petronas.jpg`,
      `${D}/malaysia/genting.jpg`,
      `${D}/singapore/night-safari.jpg`,
      `${D}/singapore/merlion.jpg`,
      `${D}/singapore/sentosa-universal.jpg`,
      `${D}/singapore/marina-bay-sands.jpg`,
    ],
    attractions: [
      `${D}/thailand/grand-palace.jpg`,
      `${D}/thailand/coral-island.png`,
      `${D}/malaysia/petronas.jpg`,
      `${D}/malaysia/genting.jpg`,
      `${D}/singapore/marina-bay-sands.jpg`,
      `${D}/singapore/sentosa-universal.jpg`,
    ],
    gallery: [
      `${D}/thailand/grand-palace.jpg`,
      `${D}/thailand/coral-island.png`,
      `${D}/malaysia/petronas.jpg`,
      `${D}/malaysia/genting.jpg`,
      `${D}/singapore/marina-bay-sands.jpg`,
      `${D}/singapore/sentosa-universal.jpg`,
    ],
  },
};
