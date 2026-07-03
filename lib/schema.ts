// =====================================================================
// JSON-LD structured data builders.
// Each page renders the most specific schema that fits its content
// (see <JsonLd />). Keep TravelAgency for home/about only.
// =====================================================================
import { site } from "@/lib/site";
import type { TravelPackage } from "@/lib/packages";
import { packageImage } from "@/lib/images";
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
      url: absoluteUrl(`/packages/${pkg.slug}`),
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
  const url = absoluteUrl(`/packages/${pkg.slug}`);
  const image = packageImage(pkg.slug, pkg.category, pkg.image);
  const isTour = pkg.category !== "Umrah & Hajj";
  const description = pkg.description
    ? stripHtml(pkg.description)
    : `${pkg.title}, ${pkg.duration} from ${site.name}.`;
  return {
    "@type": isTour ? "TouristTrip" : "Product",
    name: `${pkg.title} from Pakistan`,
    description,
    image,
    url,
    ...(isTour ? { provider: orgRef } : { brand: orgRef }),
  };
}

// /packages hub. CollectionPage + two ItemLists + Breadcrumb + business.
export function packagesHubGraph(packages: TravelPackage[]) {
  const hubUrl = absoluteUrl("/packages");
  const umrah = packages.filter((p) => p.category === "Umrah & Hajj");
  const intl = packages.filter((p) => p.category !== "Umrah & Hajj");

  const list = (name: string, items: TravelPackage[]) => ({
    "@type": "ItemList",
    name,
    itemListElement: items.map((pkg, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: packageNode(pkg),
    })),
  });

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
        name: "Umrah, Hajj and Tour Packages from Pakistan",
        about: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Packages", item: hubUrl },
        ],
      },
      list("Umrah and Hajj packages from Pakistan", umrah),
      list("International tour packages from Pakistan", intl),
    ],
  };
}

// /packages/[slug] detail. Product or TouristTrip (no price) + Breadcrumb.
export function packageDetailGraph(pkg: TravelPackage) {
  const url = absoluteUrl(`/packages/${pkg.slug}`);
  const groupName =
    pkg.category === "Umrah & Hajj" ? "Umrah and Hajj" : "International";
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@id": url, ...packageNode(pkg) },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Packages",
            item: absoluteUrl("/packages"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: groupName,
            item: absoluteUrl("/packages"),
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${pkg.title} from Pakistan`,
            item: url,
          },
        ],
      },
    ],
  };
}
