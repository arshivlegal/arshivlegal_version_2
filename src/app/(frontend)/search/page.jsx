import SearchClient from "./SearchClient";
import { getGlobalSearchData } from "@/lib/homeFetchers";
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import {
  getWebPageSchema,
  getBreadcrumbSchema,
  getOrganizationSchema,
} from "@/utils/schema";

//----------------------------------------------------------
// 🔥 SEO METADATA
//----------------------------------------------------------
export const metadata = {
  title: "Search IPR Resources & Legal Content | Arshiv Legal",
  description:
    "Search across our entire database of Intellectual Property Rights (IPR) case studies, articles, blogs, and PDF study materials.",
  // ✅ CRITICAL FOR SEARCH PAGES: Keeps Google from indexing infinite search queries
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: canonicalize("/search"),
  },
  openGraph: {
    title: "Search IPR Resources & Legal Content | Arshiv Legal",
    description:
      "Find expertly curated resources, case studies, and articles on patents, trademarks, and copyright law.",
    url: canonicalize("/search"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg", 
        width: 1200,
        height: 630,
        alt: "Arshiv Legal – Search IPR Database",
      },
    ],
  },
};

// Ensures search always checks for the newest uploads instantly
export const revalidate = 0; 

//----------------------------------------------------------
// 🎨 MAIN SERVER PAGE
//----------------------------------------------------------
export default async function GlobalSearchPage() {
  
  // 🔥 FETCH FROM ALL 5 DATABASES INSTANTLY
  const searchData = await getGlobalSearchData();
  
  // 1. WebPage Schema (Specifically labeled as a Search Results Page)
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/search"),
    type: "SearchResultsPage", // Tells parsers exactly what kind of page this is
  });

  // 2. Breadcrumbs
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Search", url: canonicalize("/search") },
  ]);

  // 3. Organization Schema
  const organizationSchema = getOrganizationSchema();

  const ld = [pageSchema, breadcrumbSchema, organizationSchema];

  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      <SearchClient initialData={searchData} />
    </>
  );
}