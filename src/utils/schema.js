import { SEO_CONFIG } from "@/lib/seo-config";

// 1. Organization Schema (LegalService)
export function getOrganizationSchema() {
  const baseUrl = SEO_CONFIG.siteUrl.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${baseUrl}/#organization`,

    name: SEO_CONFIG.siteName,
    url: baseUrl,

    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}${
        SEO_CONFIG.logo.startsWith("/") ? SEO_CONFIG.logo : ""
      }`,
      width: 512,
      height: 512,
    },

    description: SEO_CONFIG.description,

    address: {
      "@type": "PostalAddress",
      streetAddress: SEO_CONFIG.contact.address.street,
      addressLocality: SEO_CONFIG.contact.address.city,
      addressRegion: SEO_CONFIG.contact.address.region,
      postalCode: SEO_CONFIG.contact.address.postalCode,
      addressCountry: SEO_CONFIG.contact.address.country,
    },

    areaServed: {
      "@type": "City",
      name: "Kanpur",
    },

    telephone: SEO_CONFIG.contact.phone,
    email: SEO_CONFIG.contact.email,

    priceRange: "₹₹",

    sameAs: [
      SEO_CONFIG.social.LinkedIn,
      SEO_CONFIG.social.Facebook,
      SEO_CONFIG.social.Instagram,
      SEO_CONFIG.social.YouTube,
    ].filter(Boolean),
  };
}
// 2. WebPage Schema
export function getWebPageSchema({
  title,
  description,
  url,
  type = "WebPage",
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url: url,
    name: title,
    description: description,
    inLanguage: "en-IN",
    isPartOf: {
      "@id": `${SEO_CONFIG.siteUrl.replace(/\/$/, "")}/#organization`,
    },
  };
}

// 3. WebSite Schema - Homepage Only
// Removed SearchAction to prevent errors if /search doesn't exist
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SEO_CONFIG.siteUrl,
    name: SEO_CONFIG.siteName,
    publisher: { "@id": `${SEO_CONFIG.siteUrl}/#organization` },
  };
}

// 4. Breadcrumbs - Updated to use @id for items
// 3. Breadcrumb Schema
export function getBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// 5. FAQ Schema
export function getFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// 6. Person Schema - Updated with description
export function getPersonSchema({
  name,
  jobTitle,
  image,
  url,
  sameAs = [],
  description,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    jobTitle: jobTitle,
    image: image,
    url: url,
    sameAs: sameAs,
    description: description, // Added description field
    worksFor: { "@id": `${SEO_CONFIG.siteUrl}/#organization` },
  };
}
