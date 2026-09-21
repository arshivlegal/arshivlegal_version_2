import CaseStudiesClient from "./CaseStudiesClient";
import dbConnect from "@/lib/dbConnect";
import CaseStudy from "@/models/CaseStudy";
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import {
  getWebPageSchema,
  getBreadcrumbSchema,
  getOrganizationSchema,
} from "@/utils/schema";

//----------------------------------------------------------
//  SEO METADATA
//----------------------------------------------------------
export const metadata = {
  title: "IPR Case Studies & Landmark Judgments | Arshiv Legal",
  description:
    "Explore landmark Intellectual Property Rights (IPR) case studies. Read expert analyses on patent rulings, trademark disputes, and copyright infringement judgments.",
  alternates: {
    canonical: canonicalize("/case-studies"),
  },
  keywords: [
    "IPR case studies",
    "patent judgments India",
    "trademark dispute cases",
    "copyright infringement rulings",
    "intellectual property case laws",
    "landmark IP judgments",
    "Arshiv Legal cases",
  ],
  openGraph: {
    title: "IPR Case Studies & Landmark Judgments | Arshiv Legal",
    description:
      "Explore landmark Intellectual Property Rights (IPR) case studies. Read expert analyses on patent rulings, trademark disputes, and copyright infringement judgments.",
    url: canonicalize("/case-studies"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg", // Ensure this exists in /public
        width: 1200,
        height: 630,
        alt: "Arshiv Legal – IPR Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPR Case Studies & Landmark Judgments | Arshiv Legal",
    description:
      "Dive into comprehensive analyses of landmark Intellectual Property case studies and rulings.",
    images: ["/og-default.jpg"],
  },
};

//----------------------------------------------------------
// 🎨 MAIN SERVER PAGE
//----------------------------------------------------------
export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  let caseStudiesData = [];

  try {
    await dbConnect();

    // 1. Fetch all published cases from the database
    const cases = await CaseStudy.find({ isPublished: true })
      .sort({ dateOfJudgment: -1 })
      .lean();

    // 2. Map the database fields to exactly what your CaseStudyCard expects
    caseStudiesData = cases.map((c) => ({
      id: c._id.toString(),
      tags: [c.category], // E.g., ["Trademark"]
      title: c.title,
      description: c.overview,
      // Creates the exact format you wanted: "Patent • Supreme Court"
      meta: `${c.category || "IP Law"} • ${c.court || "Court"}`, 
      image: c.heroImage || "/images/default-case.webp",
      href: `/case-studies/${c.slug || c._id.toString()}`,
    }));
  } catch (error) {
    console.error("Error fetching case studies for main page:", error);
  }

  // 3. Generate JSON-LD Schemas
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/case-studies"),
    type: "CollectionPage", // Tells Google this is an index of case studies
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Case Studies", url: canonicalize("/case-studies") },
  ]);

  const organizationSchema = getOrganizationSchema();

  const ld = [pageSchema, breadcrumbSchema, organizationSchema];

  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      {/* 4. Pass the live database array to your interactive client component! */}
      <CaseStudiesClient initialData={caseStudiesData} />
    </>
  );
}