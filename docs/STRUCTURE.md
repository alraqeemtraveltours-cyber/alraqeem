# Al Raqeem Website Structure

Generated from the actual codebase, the App Router route tree, the data files,
and the components, on 2026-07-08. The code is the source of truth. Every page
listed maps to a real route, and every title is read from the code or the live
render, not assumed. Built and Roadmap are kept separate.

## Status legend

- **Built**: a real route exists in `app` and renders.
- **Roadmap**: a data entry with `live: false` and no route.
- **Mismatch**: the data and the routes disagree, to fix.
- **Unclear**: could not be determined from the code alone.

---

## Route tree, categorized

### Site level

| Route | Title | Status |
|---|---|---|
| `/` | Umrah and Hajj Travel Agency in Pakistan \| Al Raqeem | Built |
| `/about` | About Us | Built |
| `/contact` | Contact Us | Built |
| `/terms-and-refunds` | Terms and Refund Policy | Built |
| `/photo-credits` | Photo Credits | Built |

### Tours pillar

| Route | Title | Status |
|---|---|---|
| `/tours` | Tour Packages from Pakistan \| Al Raqeem | Built |

### Tours sub hubs

| Route | Title | Status |
|---|---|---|
| `/tours/international-tours` | International Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/pakistan` | Pakistan Tour Packages \| Al Raqeem | Built |

### International destination pages

| Route | Title | Status |
|---|---|---|
| `/tours/dubai` | Dubai Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/turkey` | Turkey Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/baku` | Baku Tour Package from Pakistan \| Al Raqeem | Built |
| `/tours/malaysia` | Malaysia Tour Package from Pakistan \| Al Raqeem | Built |
| `/tours/thailand` | Thailand Tour Package from Pakistan \| Al Raqeem | Built |
| `/tours/singapore` | Singapore Tour Package from Pakistan \| Al Raqeem | Built |

### Combo pages, multi country

| Route | Title | Status |
|---|---|---|
| `/tours/malaysia-thailand` | Malaysia and Thailand Tour Package \| Al Raqeem | Built |
| `/tours/malaysia-thailand-singapore` | Malaysia Thailand Singapore Tour Package \| Al Raqeem | Built |

Note: the `destinations.ts` slugs for these combos are `malaysia-thailand-8-days`
and `malaysia-thailand-singapore`, mapped to the routes above by
`packageHrefBySlug`. By design, not a mismatch.

### Pakistan destination pages

| Route | Title | Status |
|---|---|---|
| `/tours/swat` | Swat Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/kumrat-valley` | Kumrat Valley Tour Packages \| Al Raqeem | Built |
| `/tours/kalash-valley` | Kalash Valley Tour Packages \| Al Raqeem | Built |
| `/tours/chitral` | Chitral Tour Packages \| Al Raqeem | Built |
| `/tours/hunza` | Hunza Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/skardu` | Skardu Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/naran-kaghan` | Naran Kaghan Tour Packages \| Al Raqeem | Built |

### Theme facet pages

| Route | Title | Status |
|---|---|---|
| `/tours/muslim-friendly-tours` | Muslim Friendly Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/honeymoon-packages` | Honeymoon Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/family-packages` | Family Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/group-tours` | Group Tour Packages from Pakistan \| Al Raqeem | Built |
| `/tours/beach-and-adventure-tours` | Beach and Adventure Tour Packages from Pakistan \| Al Raqeem | Built |

Note: `muslim-friendly-tours` is a bespoke page. The other four are driven by
`lib/tourFacets.ts` and rendered by the `TourFacet` component.

### Pilgrimage, Umrah

| Route | Title | Status |
|---|---|---|
| `/umrah` | Umrah Packages from Pakistan \| Al Raqeem | Built |
| `/umrah/economy-15-days` | Economy Umrah Package from Pakistan \| Al Raqeem | Built |
| `/umrah/premium-21-days` | Premium Umrah Package from Pakistan \| Al Raqeem | Built |
| `/umrah/ramadan` | Ramadan Umrah Package from Pakistan \| Al Raqeem | Built |

### Pilgrimage, Umrah city pages

Dynamic route `app/umrah/[city]`, driven by `lib/departureCities.ts`, all
`live: true`. Title pattern "Umrah Packages from [City] | Al Raqeem".

| Route | Tier | Status |
|---|---|---|
| `/umrah/umrah-packages-karachi` | 1, airport | Built |
| `/umrah/umrah-packages-lahore` | 1, airport | Built |
| `/umrah/umrah-packages-islamabad` | 1, airport | Built |
| `/umrah/umrah-packages-peshawar` | 1, airport | Built |
| `/umrah/umrah-packages-multan` | 1, airport | Built |
| `/umrah/umrah-packages-faisalabad` | 1, airport | Built |
| `/umrah/umrah-packages-sialkot` | 1, airport | Built |
| `/umrah/umrah-packages-quetta` | 1, airport | Built |
| `/umrah/umrah-packages-charsadda` | 2, KPK | Built |
| `/umrah/umrah-packages-mardan` | 2, KPK | Built |
| `/umrah/umrah-packages-nowshera` | 2, KPK | Built |
| `/umrah/umrah-packages-swabi` | 2, KPK | Built |
| `/umrah/umrah-packages-swat` | 2, KPK | Built |

### Pilgrimage, Umrah Plus combos

Same dynamic route `app/umrah/[city]`, driven by `lib/umrahPlus.ts`. Title
pattern "Umrah Plus [Destination] Packages | Al Raqeem".

| Route | Status |
|---|---|
| `/umrah/umrah-plus-baku` | Built |
| `/umrah/umrah-plus-turkey` | Built |
| `/umrah/umrah-plus-dubai` | Built |
| `/umrah/umrah-plus-qatar` | Built |
| `/umrah/umrah-plus-egypt` | Built |
| `umrah-plus-jordan` | Roadmap (`live: false`, no route) |

### Pilgrimage, Hajj

| Route | Title | Status |
|---|---|---|
| `/hajj` | Hajj Packages from Pakistan \| Al Raqeem | Built |

### Visa and flights verticals

| Route | Title | Status |
|---|---|---|
| `/visa-services` | Visa Services | Built |
| `/tickets` | Flight Deals & Air Tickets | Built |

### Other public routes

| Route | Title | Status |
|---|---|---|
| `/packages` | Umrah Packages (browse all index) | Built |
| `/packages/[slug]` | Dynamic, 19 packages in `lib/packages.ts` | Built, redirects each package to its silo canonical route, for example `/packages/economy-umrah-15-days` returns a redirect to `/umrah/economy-15-days` |
| `/areas/[city]` | Dynamic, "Travel Agency in [City] \| Umrah & Tour Packages", 7 cities in `lib/cities.ts` | Built |
| `/blog` | Travel Blog & Guides | Built |
| `/blog/[slug]` | Dynamic, CMS posts from `postsStore` | Built, post count is Unclear from the code, driven by the store at runtime |

Area cities (`/areas/[city]`): islamabad, lahore, rawalpindi, peshawar,
charsadda, tangi, shabqadar.

### Admin, internal CMS, not public silo pages

Fourteen routes under `/admin` drive the content management system, blogs,
packages, tickets, categories, inquiries, media, and settings. Listed here as
Other, not part of the public silo hierarchy.

| Route | Status |
|---|---|
| `/admin` and its children (`/admin/blogs`, `/admin/blogs/new`, `/admin/blogs/[slug]`, `/admin/packages`, `/admin/packages/new`, `/admin/packages/[slug]`, `/admin/tickets`, `/admin/tickets/new`, `/admin/tickets/[slug]`, `/admin/categories`, `/admin/inquiries`, `/admin/media`, `/admin/settings`) | Built, internal |

---

## Roadmap, data entries with live false and no route

Kept separate from Built. Read from `lib/destinations.ts` and `lib/umrahPlus.ts`.

### International destinations, roadmap (9)

Maldives, Saudi Arabia, Indonesia, Sri Lanka, Egypt, Morocco, Uzbekistan,
Georgia, Qatar.

### Pakistan destinations, roadmap (10)

Kalam, Malam Jabba, Shogran, Dir, Fairy Meadows, Gilgit, Kashmir, Neelum
Valley, Murree, Lahore.

### Umrah Plus, roadmap (1)

Jordan.

Note: Egypt and Qatar are roadmap as `/tours` destinations, yet live as Umrah
Plus combos (`/umrah/umrah-plus-egypt`, `/umrah/umrah-plus-qatar`). Different
page types, so not a mismatch. Their combo sideways link falls back to
`/tours/international-tours` since no `/tours/egypt` or `/tours/qatar` exists.

---

## Components and data files

### Reusable components

| Component | Drives |
|---|---|
| `app/packages/[slug]/page.tsx` exports `PackageDetailView` | The shared tour and package detail template, rendered by every tour and package route |
| `components/packages/TourFacet.tsx` | The theme facet pages, honeymoon, family, group, beach and adventure |
| `components/DestinationDirectory.tsx` | The two column destination directory on the homepage and the tours pillar |
| `components/DepartureCityDirectory.tsx` | The Umrah city directory on the Umrah hub |
| `components/umrah/UmrahPlusView.tsx` | The Umrah Plus combo page template |
| `components/umrah/UmrahPlusStrip.tsx` | The Umrah Plus combos strip on the Umrah hub |
| `components/packages/CaptionedImage.tsx` | The captioned image slot, real photo or branded motif panel |
| `components/SearchInquiryWidget.tsx` | The context aware search and inquiry widget |
| `components/packages/MobileActionBar.tsx` and `components/WhatsAppFloat.tsx` | The sticky mobile quote and WhatsApp bars |
| `components/packages/PackagesExplorer.tsx` | The filterable package grid on the hubs |
| `components/packages/TierCompare.tsx` | The Umrah tier comparison |
| `components/Reviews.tsx` | Social proof, gated on staging placeholders |
| `components/FaqAccordion.tsx` | The FAQ accordion on every page |
| `components/LastUpdated.tsx` | The visible updated date |
| `components/AirlineStrip.tsx` | The airline partners strip |
| `components/Shared.tsx` | `PageHero`, `CtaBand`, and shared blocks |
| `components/JsonLd.tsx` | Schema injection |
| `components/Header.tsx`, `components/Footer.tsx`, `components/SiteChrome.tsx` | Site chrome and the footer link map |

### Data files

| File | Drives |
|---|---|
| `lib/packages.ts` | The 19 packages, categories, and the silo route map |
| `lib/packageDetail.ts` | The `tourContent` and `detailContent` maps, itineraries, attractions, practical grids, and FAQs |
| `lib/packageMeta.ts` | Per package titles, descriptions, and keywords |
| `lib/destinations.ts` | The destination directory data, international and Pakistan, with live flags |
| `lib/tourFacets.ts` | The four theme facet pages |
| `lib/departureCities.ts` | The 13 Umrah departure city pages, tier 1 and tier 2 |
| `lib/umrahPlus.ts` | The Umrah Plus combos, five live and Jordan roadmap |
| `lib/cities.ts` | The 7 `/areas` city agency pages |
| `lib/tourImages.ts` and `lib/photoCredits.json` | The real licensed card photos and their attributions |
| `lib/schema.ts` | The schema helpers, BreadcrumbList, ItemList, TravelAgency, TouristTrip, no price |
| `lib/reviews.ts` and `lib/staging.ts` | Reviews and the staging placeholders, gated until launch |
| `lib/site.ts`, `lib/settings.ts`, `lib/settingsStore.ts` | NAP, WhatsApp, and site settings |
| `app/sitemap.ts`, `app/robots.ts` | The sitemap and robots, both present |

---

## Internal link map, from the code

Only what the routes and components show.

- **Homepage** links down to the tours silo through `DestinationDirectory` and
  the offer silos, and to the Umrah and Hajj hubs.
- **Tours pillar** `/tours` links down to the two sub hubs, the destination
  directory, the facet cards, and the international explorer, and up is the
  homepage.
- **Tours sub hubs** link down to their destination pages, sideways to the
  facets, and up to `/tours`.
- **Tour destination pages** link to `/tours` and the combos through the
  durations and combos block. The Baku page links sideways and up to the Umrah
  silo through the Umrah Plus cross sell.
- **Facet pages** link down to the destination cards and up to `/tours`.
- **Umrah hub** `/umrah` links down to the tier packages, the Umrah Plus strip,
  and the departure city directory.
- **Umrah city pages** link up to `/umrah` and sideways to nearby cities.
- **Umrah Plus combos** link up to `/umrah`, sideways to the matching `/tours`
  page (Baku, Turkey, Dubai) or `/tours/international-tours` (Qatar, Egypt), and
  across to the other combos, the bridge between the two silos.
- **Footer** links to `/umrah`, `/hajj`, `/tours`, `/tickets`, `/visa-services`,
  `/about`, `/blog`, `/contact`, `/terms-and-refunds`, `/photo-credits`,
  `/packages`, and the `/areas` cities.

---

## Mismatch list

**None found.** Every `live: true` destination in `lib/destinations.ts` has a
matching `/tours` route, every `live: true` departure city and Umrah Plus combo
has a route under `/umrah`, and every `live: false` entry has no route. The
combo slug versus route folder difference (`malaysia-thailand-8-days` to
`/tours/malaysia-thailand`) is resolved by `packageHrefBySlug` and is by design.

---

## Summary counts, Built public pages

| Category | Built |
|---|---|
| Site level | 5 |
| Tours pillar | 1 |
| Tours sub hubs | 2 |
| International destinations | 6 |
| Combo pages | 2 |
| Pakistan destinations | 7 |
| Theme facets | 5 |
| Umrah hub and tier packages | 4 |
| Umrah city pages | 13 |
| Umrah Plus combos | 5 |
| Hajj | 1 |
| Visa and flights | 2 |
| Other public (`/packages`, `/blog`) | 2 |
| Dynamic route files (`/packages/[slug]`, `/areas/[city]`, `/blog/[slug]`) | 3 route files |
| Admin, internal CMS | 14 |

### Totals

- Page files in the route tree: **55**.
- Public non admin page files: **41** (37 static concrete routes plus 4 dynamic
  route files, `/umrah/[city]`, `/areas/[city]`, `/packages/[slug]`,
  `/blog/[slug]`).
- Admin page files: **14**.
- Built public concrete routes, static plus dynamic expansions: **37 static**
  plus **13 Umrah cities**, **5 Umrah Plus combos**, **7 area cities**, and the
  `/packages/[slug]` redirects and `/blog/[slug]` CMS posts.
- Roadmap entries: **20** (9 international, 10 Pakistan, 1 Umrah Plus).
- Mismatches: **0**.
