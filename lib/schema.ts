// =====================================================================
// JSON-LD structured data builders.
// Each page renders the most specific schema that fits its content
// (see <JsonLd />). Keep TravelAgency for home/about only.
// =====================================================================
import { site } from "@/lib/site";
import {
  type TravelPackage,
  packageHref,
  packageDisplayName,
  packageSilo,
} from "@/lib/packages";
import { packageImage } from "@/lib/images";
import {
  dubaiItinerary,
  dubaiAttractions,
  turkeyItinerary,
  turkeyAttractions,
  bakuItinerary,
  bakuAttractions,
  farEastItinerary,
  farEastAttractions,
} from "@/lib/packageDetail";
import type { Post } from "@/lib/posts";
import type { City } from "@/lib/cities";
import type { ReviewData } from "@/lib/reviews";

// Absolute URL for a given path, e.g. "/packages" -> "https://alraqeem.com.pk/packages"
export function absoluteUrl(path: string) {
  return `${site.url}${path}`;
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: "Office 1 and 2, 1st Floor, Aman Plaza, Mardan Road",
  addressLocality: "Charsadda",
  addressRegion: "Khyber Pakhtunkhwa",
  addressCountry: "PK",
};

const organization = {
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/logo.png"),
  },
};

// Cities the office serves, plus the country, reused across schemas.
const serviceAreas = [
  "Charsadda",
  "Peshawar",
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Tangi",
  "Shabqadar",
];

// Home + About only.
export function travelAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: absoluteUrl("/logo.png"),
    address: postalAddress,
    areaServed: [
      "Islamabad",
      "Lahore",
      "Rawalpindi",
      "Peshawar",
      "Charsadda",
      "Tangi",
      "Shabqadar",
    ],
  };
}

// Blog post pages.
export function blogPostingSchema(post: Post) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: organization,
    image: post.image ? post.image : absoluteUrl("/logo.png"),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

// Homepage @graph. Bundles the organization, agency, local business,
// website search action, breadcrumb, services, featured packages and guides
// into one validated block. Review and AggregateRating stay out until real
// review data exists on the site or the linked Google Business Profile.
export function homepageGraph(
  featured: TravelPackage[],
  posts: Post[],
  reviews?: ReviewData
) {
  const orgId = `${site.url}/#organization`;

  // Verifiable credentials, added only when a real value is present.
  const cred = site.credentials;
  const identifiers: Array<Record<string, unknown>> = [];
  if (cred.companyNumber)
    identifiers.push({
      "@type": "PropertyValue",
      propertyID: "Company Registration",
      value: cred.companyNumber,
    });
  if (cred.moraLicence)
    identifiers.push({
      "@type": "PropertyValue",
      propertyID: "MORA Umrah Operator Licence",
      value: cred.moraLicence,
    });
  if (cred.iata)
    identifiers.push({
      "@type": "PropertyValue",
      propertyID: "IATA",
      value: cred.iata,
    });

  // Review and AggregateRating, added only when genuine review data exists.
  // Staging placeholders (isPlaceholder) never carry schema.
  const reviewFields: Record<string, unknown> = {};
  if (reviews && reviews.reviews.length > 0 && !reviews.isPlaceholder) {
    if (reviews.ratingValue !== null && reviews.reviewCount !== null) {
      reviewFields.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: reviews.ratingValue,
        reviewCount: reviews.reviewCount,
        bestRating: 5,
        worstRating: 1,
      };
    }
    reviewFields.review = reviews.reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.text,
      ...(r.date ? { datePublished: r.date } : {}),
    }));
  }

  // One entity typed as Organization, TravelAgency and LocalBusiness, since
  // TravelAgency already extends both. Covers all three required schema types
  // without splitting the office into duplicate, competing entities.
  const business = {
    "@type": ["Organization", "TravelAgency", "LocalBusiness"],
    "@id": orgId,
    name: site.name,
    url: site.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    image: absoluteUrl("/logo.png"),
    telephone: site.phone,
    email: site.email,
    address: postalAddress,
    areaServed: [...serviceAreas, "Pakistan"],
    openingHours: "Mo-Sa 09:00-20:00",
    parentOrganization: {
      "@type": "Organization",
      name: site.sisterCompany,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      contactType: "customer service",
      areaServed: "PK",
      availableLanguage: ["Urdu", "Pashto", "English"],
    },
    ...(identifiers.length ? { identifier: identifiers } : {}),
    ...(cred.iata
      ? {
          memberOf: {
            "@type": "Organization",
            name: "International Air Transport Association",
            alternateName: "IATA",
          },
        }
      : {}),
    ...reviewFields,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": orgId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/packages?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url,
      },
    ],
  };

  const services = [
    {
      name: "Umrah and Hajj Packages",
      description:
        "Economy, premium, Ramadan and family Umrah, plus complete Hajj programs with visa, flights, hotels near the Haram and guided Ziyarat.",
      url: absoluteUrl("/packages"),
    },
    {
      name: "International Tour Packages",
      description:
        "Dubai, Turkey, Baku, Malaysia and Thailand tours with visa, flights, hotels and sightseeing arranged in one booking.",
      url: absoluteUrl("/packages"),
    },
    {
      name: "Visit Visa Services",
      description:
        "Visit visa preparation and filing for UAE, Saudi Arabia, Turkey, Schengen states and the United Kingdom.",
      url: absoluteUrl("/visa-services"),
    },
  ].map((s) => ({
    "@type": "Service",
    name: s.name,
    description: s.description,
    serviceType: s.name,
    url: s.url,
    provider: { "@id": orgId },
    areaServed: "Pakistan",
  }));

  // Inquiry based, so no price. Root page keeps items as plain ListItems
  // (name + url) rather than Product or TouristTrip.
  const packagesList = {
    "@type": "ItemList",
    name: "Featured travel packages",
    itemListElement: featured.map((pkg, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${pkg.title} from Pakistan`,
      url: absoluteUrl(packageHref(pkg)),
    })),
  };

  const guidesList = {
    "@type": "ItemList",
    name: "Travel guides",
    itemListElement: posts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        url: absoluteUrl(`/blog/${post.slug}`),
        image: post.image ? post.image : absoluteUrl("/logo.png"),
        author: { "@id": orgId },
        publisher: { "@id": orgId },
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      website,
      breadcrumb,
      ...services,
      packagesList,
      guidesList,
    ],
  };
}

// Area / city pages.
export function localBusinessSchema(city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${site.name}, ${city.name}`,
    description: city.intro,
    url: absoluteUrl(`/areas/${city.slug}`),
    telephone: site.phone,
    email: site.email,
    image: absoluteUrl("/logo.png"),
    address: postalAddress,
    areaServed: { "@type": "City", name: city.name },
    openingHours: "Mo-Sa 09:00-20:00",
  };
}

// ---------------------------------------------------------------------
// Packages section. Pricing is inquiry based, so NO price, priceRange,
// or Offer price is ever emitted. Umrah and Hajj map to Product, tours
// map to TouristTrip. Both omit offers entirely.
// ---------------------------------------------------------------------
const orgRef = { "@type": "Organization", name: site.name, url: site.url };

function packageNode(pkg: TravelPackage) {
  const url = absoluteUrl(packageHref(pkg));
  const image = packageImage(pkg.slug, pkg.category, pkg.image);
  const isTour = pkg.category !== "Umrah & Hajj";
  const description = pkg.description
    ? stripHtml(pkg.description)
    : `${pkg.title}, ${pkg.duration} from ${site.name}.`;
  return {
    "@type": isTour ? "TouristTrip" : "Product",
    name: `${packageDisplayName(pkg)} from Pakistan`,
    description,
    image,
    url,
    ...(isTour ? { provider: orgRef } : { brand: orgRef }),
  };
}

// Shared business node for the hub graphs.
const businessNode = {
  "@type": ["Organization", "TravelAgency"],
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
  telephone: site.phone,
  email: site.email,
  address: postalAddress,
  areaServed: [...serviceAreas, "Pakistan"],
};

function packageItemList(name: string, items: TravelPackage[]) {
  return {
    "@type": "ItemList",
    name,
    itemListElement: items.map((pkg, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: packageNode(pkg),
    })),
  };
}

// /packages is now a lightweight browse-all index. It does not target a head
// term (the silo hubs own those), so it carries no package ItemList.
export function packagesHubGraph() {
  const hubUrl = absoluteUrl("/packages");
  return {
    "@context": "https://schema.org",
    "@graph": [
      businessNode,
      {
        "@type": "CollectionPage",
        "@id": `${hubUrl}#collection`,
        url: hubUrl,
        name: "Al Raqeem packages and services",
        about: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Packages", item: hubUrl },
        ],
      },
    ],
  };
}

// /umrah hub. CollectionPage + Umrah ItemList + Breadcrumb + business.
export function umrahHubGraph(packages: TravelPackage[]) {
  const hubUrl = absoluteUrl("/umrah");
  const umrah = packages.filter(
    (p) => p.category === "Umrah & Hajj" && p.slug !== "hajj-package"
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      businessNode,
      {
        "@type": "CollectionPage",
        "@id": `${hubUrl}#collection`,
        url: hubUrl,
        name: "Umrah Packages from Pakistan",
        about: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Umrah", item: hubUrl },
        ],
      },
      packageItemList("Umrah packages from Pakistan", umrah),
    ],
  };
}

// /tours hub. CollectionPage + tour ItemList + Breadcrumb + business.
export function toursHubGraph(packages: TravelPackage[]) {
  const hubUrl = absoluteUrl("/tours");
  const tours = packages.filter((p) => p.category !== "Umrah & Hajj");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "TravelAgency"],
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
        telephone: site.phone,
        email: site.email,
        address: postalAddress,
        areaServed: [...serviceAreas, "Pakistan"],
      },
      {
        "@type": "CollectionPage",
        "@id": `${hubUrl}#collection`,
        url: hubUrl,
        name: "Tour Packages from Pakistan",
        about: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Tours", item: hubUrl },
        ],
      },
      {
        "@type": "ItemList",
        name: "International tour packages from Pakistan",
        itemListElement: tours.map((pkg, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: packageNode(pkg),
        })),
      },
    ],
  };
}

// /packages/[slug] and the /tours Dubai pillar. Product or TouristTrip (no
// price) + Breadcrumb, plus itinerary and attraction ItemLists for Dubai.
export function packageDetailGraph(pkg: TravelPackage) {
  const url = absoluteUrl(packageHref(pkg));
  const silo = packageSilo(pkg);
  // Hajj is its own hub, so its breadcrumb stops at Home, Hajj.
  const isHub = pkg.slug === "hajj-package";

  const crumbs: Record<string, unknown>[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
  ];
  if (isHub) {
    crumbs.push({
      "@type": "ListItem",
      position: 2,
      name: silo.hubName,
      item: url,
    });
  } else {
    crumbs.push(
      {
        "@type": "ListItem",
        position: 2,
        name: silo.hubName,
        item: absoluteUrl(silo.hub),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${packageDisplayName(pkg)} from Pakistan`,
        item: url,
      }
    );
  }

  const graph: Record<string, unknown>[] = [
    { "@id": url, ...packageNode(pkg) },
    { "@type": "BreadcrumbList", itemListElement: crumbs },
  ];

  if (pkg.slug === "dubai-5-days") {
    graph.push(
      {
        "@type": "ItemList",
        name: "Dubai tour itinerary",
        itemListElement: dubaiItinerary.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${s.day}: ${s.title}`,
        })),
      },
      {
        "@type": "ItemList",
        name: "Dubai attractions",
        itemListElement: dubaiAttractions.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.name,
        })),
      }
    );
  }

  if (pkg.slug === "turkey-7-days") {
    graph.push(
      {
        "@type": "ItemList",
        name: "Turkey tour itinerary",
        itemListElement: turkeyItinerary.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${s.day}: ${s.title}`,
        })),
      },
      {
        "@type": "ItemList",
        name: "Turkey attractions",
        itemListElement: turkeyAttractions.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.name,
        })),
      }
    );
  }

  if (pkg.slug === "baku-5-days") {
    graph.push(
      {
        "@type": "ItemList",
        name: "Baku tour itinerary",
        itemListElement: bakuItinerary.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${s.day}: ${s.title}`,
        })),
      },
      {
        "@type": "ItemList",
        name: "Baku attractions",
        itemListElement: bakuAttractions.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.name,
        })),
      }
    );
  }

  if (pkg.slug === "malaysia-thailand-8-days") {
    graph.push(
      {
        "@type": "ItemList",
        name: "Malaysia and Thailand tour itinerary",
        itemListElement: farEastItinerary.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${s.day}: ${s.title}`,
        })),
      },
      {
        "@type": "ItemList",
        name: "Malaysia and Thailand attractions",
        itemListElement: farEastAttractions.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.name,
        })),
      }
    );
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
