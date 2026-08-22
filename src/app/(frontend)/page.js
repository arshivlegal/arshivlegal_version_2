// /src/app/page.js
import React from "react";
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import { 
  getWebPageSchema, 
  getWebsiteSchema,
  getOrganizationSchema,
  getPersonSchema 
} from "@/utils/schema";

// Import ALL your central fetchers
import { 
  getLatestBlogs, 
  getLatestCaseStudies, 
  getLatestDailyContent,
  getLatestArticles,
  getLatestStudyMaterials,
  getGlobalSearchData
} from "@/lib/homeFetchers";

// Components
import HeroSection from "@/Sections/Home/HeroSectin";
import CaseStudySection from "@/Sections/Home/CaseStudySection";
import StudyMaterialSection from "@/Sections/Home/StudyMaterialSection";
import BlogSection from "@/Sections/Home/BlogSection";
import ArticleSection from "@/Sections/Home/ArticleSection";
import DailyLegalContentSection from "@/Sections/Home/DailyLegalContentSection";
import FounderVision from "@/components/FounderVision";
import FAQSection from "@/components/FAQSection";

//-----------------------🔥 SEO METADATA ----------------------
export const metadata = {
  title: "Arshiv Legal | Intellectual Property Rights (IPR) Experts",
  description:
    "Arshiv Legal is a premier Intellectual Property Rights (IPR) knowledge platform. We provide expert legal guidance, case studies, and resources on patents, trademarks, and copyrights for innovators, researchers, and students.",
  alternates: {
    canonical: canonicalize("/"),
  },
  keywords: [
    "Arshiv Legal",
    "Intellectual Property Rights",
    "IPR experts Kanpur",
    "Patent registration guidance",
    "Trademark protection",
    "Copyright law education",
    "Legal resources for researchers",
    "IP law firm",
  ],
  openGraph: {
    title: "Arshiv Legal | Intellectual Property Rights (IPR) Experts",
    description:
      "Arshiv Legal empowers researchers, students, and innovators with structured, reliable guidance on Patents, Trademarks, and Copyrights.",
    url: canonicalize("/"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Arshiv Legal – IPR & Patent Experts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arshiv Legal | Intellectual Property Rights (IPR) Experts",
    description:
      "Arshiv Legal empowers researchers, students, and innovators with structured, reliable guidance on Patents, Trademarks, and Copyrights.",
    images: ["/og-default.jpg"],
  },
};
//-----------------------SEO END ----------------------

export const revalidate = 60;

export default async function Page() {
  
  // 1. Page Schema
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/"),
  });

  // 2. Website Schema (Tells Google this is the root of a site)
  const websiteSchema = getWebsiteSchema();

  // 3. Organization Schema (Validates your business details)
  const organizationSchema = getOrganizationSchema();

  // 4. Person Schema (Establishes Founder Authority)
  const personSchema = getPersonSchema({
    name: "Aryan Pandey",
    jobTitle: "Principal Legal Professional & Founder",
    image: `${SEO_CONFIG.siteUrl}/Images/AboutFounder.webp`,
    url: canonicalize("/"),
    description:
      "Aryan Pandey is the founder of Arshiv Legal, dedicated to providing structured Intellectual Property Rights (IPR) guidance for students, researchers, and innovators.",
    sameAs: [SEO_CONFIG.social.LinkedIn].filter(Boolean),
  });

  // Combine schemas
  const ld = [pageSchema, websiteSchema, organizationSchema, personSchema];

  // 🔥 Fetch ALL 5 dynamic sections in parallel!
  const [
    latestBlogs, 
    latestCaseStudies, 
    latestDailyContent,
    latestArticles,
    latestStudyMaterials,
    searchData
  ] = await Promise.all([
    getLatestBlogs(),
    getLatestCaseStudies(),
    getLatestDailyContent(),
    getLatestArticles(),
    getLatestStudyMaterials(),
    getGlobalSearchData()
  ]);

  return (
    <>
      <JsonLd data={ld.filter(Boolean)} />

      <main role="main" className="w-full space-y-[8px]">
        {/* 3. Pass the searchData into your HeroSection */}
        <HeroSection searchSuggestions={searchData} />
        
        <CaseStudySection items={latestCaseStudies.length > 0 ? latestCaseStudies : undefined} />
        <StudyMaterialSection items={latestStudyMaterials.length > 0 ? latestStudyMaterials : undefined} />
        <BlogSection items={latestBlogs.length > 0 ? latestBlogs : undefined} />
        <ArticleSection items={latestArticles.length > 0 ? latestArticles : undefined} />
        <DailyLegalContentSection items={latestDailyContent.length > 0 ? latestDailyContent : undefined} />
        <FounderVision />
        <FAQSection />
      </main>
    </>
  );
}