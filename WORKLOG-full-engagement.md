# Al Raqeem Travel and Tours: Full Engagement Work Log

Everything built to date, drawn from the real commit history, not memory.
Generated 2026-07-08. Sixty commits sit on `main` ahead of `origin/main`, all
local, since the remote push is blocked by a 403 write access error on the
credential. Every change was verified with a production build and a live SSR
check before commit.

## The rules held on every page

- Inquiry pricing, no prices anywhere, no price in schema, cost answered by a
  cost drivers passage.
- No fabrication, real named entities only, no invented hotels, day plans,
  photos, reviews, licence numbers, or years, missing data routes to inquiry or
  a branded panel and the gaps report.
- No em dashes or en dashes anywhere, grep verified per commit.
- Banned words avoided (can, may, might, could, helps, and the rest), no
  This, That, It, These, Those sentence openers.
- 10 to 15 FAQs per page, no FAQPage schema, none duplicated within a silo.
- Captioned image slots, real photo or branded motif panel, caption is the alt
  and the ImageObject, never stock, never a gray box.
- Canonical section order, reviews and trust always above the FAQ, a visible
  updated date, sticky WhatsApp, mobile first.
- Official facts link the official source in a new tab.

---

## Phase A, homepage and package foundation

- Enriched the homepage and the packages section on the inquiry model, trust,
  and itineraries.
- Deepened the Premium, Ramadan, and Hajj detail pages.
- Added the AirlineStrip component and the Umrah tier comparison.
- Homepage silo bridge, hero subheads, captioned motifs, and hub FAQ depth.
- Entity introduction standard on the homepage band and the hub intros.
- A QA compliance sweep, removed a Contact for price label and banned words,
  cleared residual self praise and vague claims, and added the Terms page.

## Phase B, the search and inquiry widget

- Built the context aware Search and Inquiry widget with a WhatsApp lead
  handoff, later restyled to a tabbed panel and floated across the hero and the
  airline partners seam.
- Added context prefill, a config file, flights depth, and hardened lead
  capture.

## Phase C, the tours silo

- The five page Southeast Asia silo, a data driven tour content model, Malaysia,
  Thailand, and Singapore solo pages, and the Malaysia and Thailand and the
  three country Malaysia Thailand Singapore combos, with country markers, halal
  notes, and silo interlinking.
- Filled the Baku, Turkey, and Dubai pages to the full tour template, corrected
  titles and display names, and closed a getting around FAQ gap.
- Five theme facet pages, Muslim friendly and halal as the wedge, plus
  honeymoon, family, group, and beach and adventure.
- The domestic KPK batch, the Swat page to the domestic spec with a local
  Charsadda wedge and a mountain practical grid, then Kumrat Valley, Kalash
  Valley, and Chitral, and the Gilgit Baltistan north, Hunza, Skardu, and Naran
  and Kaghan.
- The tours pillar `/tours`, split international and Pakistan directories, and
  the two sub hubs, `/tours/international-tours` and `/tours/pakistan`.

## Phase D, the reusable directory and facet images

- A reusable two column destination directory block, one data file, live only,
  placed on the homepage and the pillar, with explore all buttons.
- Facet card images, and the destination directory lifted to the top of the
  tours pillar.

## Phase E, the semantic SERP top ups, all 13 tour pages

Each page audited against a live SERP pull and topped up, a coverage add not a
rebuild, entities named, official facts corrected.

- Dubai, flight time, plug type, the Abu Dhabi entities, the Saudi visa
  boundary and a women travelers note.
- Baku, the short flight, e visa precision, the Umrah plus Baku cross sell, the
  Muslim friendly wedge, Gabala and Sheki and Ganja.
- Malaysia, the multi city depth, Penang and Cameron Highlands, the affordability
  angle, the eNTRI visa precision.
- Thailand, the corrected visa rule, the Phuket and Krabi island depth, and the
  domestic flights.
- Singapore, the fuller entity set, the Kampong Glam halal note, the cost
  honesty, and the fuller grid.
- Swat, the Charsadda proximity, the access precision, the jeep and ski detail,
  the season honesty.
- Kumrat, the trek and camp reality, the access, the season, the altitude, the
  full entity set.
- Chitral, the district hub set, the Shandur festival, Tirich Mir, the Chitral
  Gol wildlife, the access and the Peshawar gateway.
- Hunza, the two route access, the blossom season, Khunjerab detail, the honest
  Gilgit Baltistan wedge.
- Skardu, the by air choice, Deosai seasonality, Shigar and Khaplu heritage, the
  K2 gateway, the honest wedge.
- Kalash, the culture lead, the three festivals, the valley differences, the
  access, and the respectful framing.
- Turkey, the corrected sticker visa rule, the Islamic heritage tie, the
  honeymoon coast, and Uludag skiing.
- Naran and Kaghan, the access precision, the season and Babusar dates, the jeep
  specifics, the full lake set with elevations, and the treks and activities.

## Phase F, real licensed photos across every tour page

- Built a photo pipeline that sources only freely licensed images from Wikimedia
  Commons, gated on the licence, CC BY, CC BY SA, CC0, public domain, and FAL,
  never a competitor or Google image.
- Wired real photos into all fifteen card render sites, itinerary, attractions,
  and gallery, across every tour page, with a branded panel fallback so nothing
  breaks.
- Around ninety real images downloaded and attributed, with a `/photo-credits`
  page listing every photographer, licence, and source, linked in the footer and
  the sitemap. Motif panels remain only on the three Baku Gabala slots and the
  Qatar State Mosque.

## Phase G, the Umrah city pages silo

- Thirteen live city pages under `/umrah/umrah-packages-[city]`, eight Tier 1
  airport cities with a real departure difference and five Tier 2 Khyber
  Pakhtunkhwa cities with a real service difference, data driven from
  `lib/departureCities.ts`.
- Built the anti doorway way, each page carries a genuinely city specific
  departure passage and local service passage and ten city tailored FAQs, none a
  name swap, verified every page renders its own real airport or routing fact.
- A hub city directory grouped by tier with ItemList schema, the all cities line
  for every non built town, and BreadcrumbList and Service schema, no price.

## Phase H, the Umrah Plus combos, the bridge

- Five live combo pages under `/umrah/umrah-plus-[destination]`, Baku, Turkey,
  Dubai, Qatar, and Egypt, each Umrah led with a heritage and leisure extension
  on one booking, data driven from `lib/umrahPlus.ts`, Jordan held at live false.
- The single `/umrah/[city]` dynamic route dispatches to either the city page or
  the combo page, so the package children and the city pages all keep working.
- Each combo serves the pilgrim first, the Makkah and Madinah nights and the
  captioned holy places, then the destination with its real attractions and the
  Muslim heritage angle, both visas linked to their official sources.
- The bridge, each combo links up to the Umrah pillar and sideways to the
  matching tour page or the international hub, plus the other combos, with a hub
  strip and TouristTrip schema, no price. Eleven new heritage images added.

## Phase I, documentation

- A combined gaps report and Replace before launch list across all pages,
  `GAPS-AND-REPLACE-BEFORE-LAUNCH.md`.
- A code sourced website structure audit, `docs/STRUCTURE.md`, every real route
  categorized by silo with its real title and status, Built and Roadmap kept
  separate, no mismatches found.
- Work logs for the tours silo build.

---

## What is live now

| Layer | Live pages |
|---|---|
| Site level | Home, About, Contact, Terms, Photo Credits |
| Tours pillar | `/tours` |
| Tours sub hubs | `/tours/international-tours`, `/tours/pakistan` |
| International destinations | Dubai, Turkey, Baku, Malaysia, Thailand, Singapore |
| Combos | Malaysia and Thailand, Malaysia Thailand Singapore |
| Pakistan destinations | Swat, Kumrat, Kalash, Chitral, Hunza, Skardu, Naran and Kaghan |
| Theme facets | Muslim friendly, Honeymoon, Family, Group, Beach and adventure |
| Umrah | Hub, Economy, Premium, Ramadan |
| Umrah city pages | 13, Karachi to Swat, tier 1 and tier 2 |
| Umrah Plus combos | Baku, Turkey, Dubai, Qatar, Egypt |
| Hajj | `/hajj` |
| Verticals | Visa services, Flight deals, Packages index, Blog, Areas |

- Every tour page carries its full semantic set, real attributed photos, and 15
  FAQs. Every Umrah city page and combo carries 10 city or combo tailored FAQs.
- Roadmap, 20 entries held at live false, 9 international, 10 Pakistan, 1 Umrah
  Plus, ready to flip to live when the real data lands.

## Standing items, before launch

- **Push is blocked.** All sixty commits are local, `git push origin main`
  returns a 403 write access error for the credential. Resolve the remote
  permissions, then push ships everything.
- **Replace before launch**, tracked in `GAPS-AND-REPLACE-BEFORE-LAUNCH.md`,
  real reviews, accreditation and licence number, the consultant name, the years
  in operation, real hotels where you want them named, your own photos for the
  heroes and the few panel slots, and a re-confirm of the visa and flight facts
  at launch since authorities and airlines update.
