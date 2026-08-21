// /src/app/page.js
import React from "react";
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import { getWebPageSchema, getWebsiteSchema } from "@/utils/schema";

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

//-----------------------SEO----------------------
export const metadata = {
  title: "Arshiv Legal | Law Firm in Kanpur",
  description:
    "Arshiv Legal is a law firm in Kanpur offering legal consultation and representation across civil, criminal, and constitutional matters for individuals and families.",
  alternates: {
    canonical: canonicalize("/"),
  },
  openGraph: {
    title: "Arshiv Legal | Law Firm in Kanpur",
    description:
      "Arshiv Legal is a law firm in Kanpur offering legal consultation and representation across civil, criminal, and constitutional matters for individuals and families.",
    url: canonicalize("/"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Arshiv Legal – Law Firm in Kanpur",
      },
    ],
  },
};
//-----------------------SEO end ----------------------

export const revalidate = 60;

export default async function Page() {
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/"),
  });

  const websiteSchema = getWebsiteSchema();

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
      <JsonLd data={[pageSchema, websiteSchema].filter(Boolean)} />

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