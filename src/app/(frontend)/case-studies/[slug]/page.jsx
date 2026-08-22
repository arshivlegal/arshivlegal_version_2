import dbConnect from "@/lib/dbConnect";
import CaseStudy from "@/models/CaseStudy";
import { notFound } from "next/navigation";
import CaseStudyContentClient from "./CaseStudyContentClient"; // 🔥 Import the interactive UI
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import { getBreadcrumbSchema, getOrganizationSchema } from "@/utils/schema";

//----------------------------------------------------------
// 🔥 AUTOMATIC SEO FOR EVERY DYNAMIC CASE STUDY
//----------------------------------------------------------
export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  
  const caseStudy = await CaseStudy.findOne({ slug }).lean();

  if (!caseStudy) return { title: "Case Study Not Found" };

  const caseUrl = canonicalize(`/case-studies/${slug}`);

  return {
    title: `${caseStudy.title} | IPR Case Study | ${SEO_CONFIG.siteName}`,
    description: caseStudy.overview,
    alternates: {
      canonical: caseUrl,
    },
    // Dynamically inject the court and category into the keywords!
    keywords: [
      caseStudy.category || "Intellectual Property",
      caseStudy.court || "Indian Courts",
      "IPR landmark judgment",
      "patent case study India",
      "trademark infringement ruling",
      "Arshiv Legal case analysis",
    ],
    openGraph: {
      title: `${caseStudy.title} | IPR Case Study`,
      description: caseStudy.overview,
      url: caseUrl,
      siteName: SEO_CONFIG.siteName,
      type: "article", // Case studies are treated as articles by social platforms
      publishedTime: caseStudy.dateOfJudgment || caseStudy.createdAt,
      images: [
        {
          url: caseStudy.heroImage || "/og-default.jpg",
          width: 1200,
          height: 630,
          alt: caseStudy.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.title,
      description: caseStudy.overview,
      images: [caseStudy.heroImage || "/og-default.jpg"],
    },
  };
}

//----------------------------------------------------------
// 🎨 MAIN SERVER PAGE
//----------------------------------------------------------
export default async function CaseStudyReaderPage({ params }) {
  const { slug } = await params;
  await dbConnect();

  // Fetch the specific case study
  const caseStudy = await CaseStudy.findOne({ slug }).lean();

  if (!caseStudy) {
    notFound();
  }

  const caseUrl = canonicalize(`/case-studies/${slug}`);

  // Format the date safely
  const dateToUse = caseStudy.dateOfJudgment ? new Date(caseStudy.dateOfJudgment) : new Date(caseStudy.createdAt);
  const formattedDate = dateToUse.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 1. 🧠 BUILD RICH SCHEMAS FOR GOOGLE
  
  // Article Schema (Helps Google structure your legal analysis properly)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": caseUrl
    },
    "headline": caseStudy.title,
    "description": caseStudy.overview,
    "image": caseStudy.heroImage || `${SEO_CONFIG.siteUrl}/og-default.jpg`,
    "author": {
      "@type": "Organization", // Since it's a firm-wide case study
      "name": SEO_CONFIG.siteName,
      "url": SEO_CONFIG.siteUrl
    },
    "publisher": getOrganizationSchema(),
    "datePublished": dateToUse.toISOString(),
    "dateModified": caseStudy.updatedAt ? new Date(caseStudy.updatedAt).toISOString() : dateToUse.toISOString()
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Case Studies", url: canonicalize("/case-studies") },
    { name: caseStudy.title, url: caseUrl },
  ]);

  const ld = [articleSchema, breadcrumbSchema];

  // 2. Serialize the MongoDB object to prevent Client Component errors
  const serializedCaseStudy = {
    ...caseStudy,
    _id: caseStudy._id.toString(),
    createdAt: caseStudy.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: caseStudy.updatedAt?.toISOString() || new Date().toISOString(),
    dateOfJudgment: caseStudy.dateOfJudgment?.toISOString() || null,
  };

  // 3. Render the UI
  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      <CaseStudyContentClient 
        caseStudy={serializedCaseStudy} 
        formattedDate={formattedDate} 
      />
    </>
  );
}