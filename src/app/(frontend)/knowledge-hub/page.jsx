import KnowledgeHubClient from "./KnowledgeHubClient";
import dbConnect from "@/lib/dbConnect";
import StudyMaterial from "@/models/StudyMaterial";
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import {
  getWebPageSchema,
  getBreadcrumbSchema,
  getOrganizationSchema,
} from "@/utils/schema";
export const dynamic = "force-dynamic"
//----------------------------------------------------------
// 🔥 SEO METADATA
//----------------------------------------------------------
export const metadata = {
  title: "IPR Knowledge Hub & Downloadable PDFs | Arshiv Legal",
  description:
    "Download free PDFs, study materials, and comprehensive guides on Intellectual Property Rights (IPR), patent filings, trademark registration, and copyright law.",
  alternates: {
    canonical: canonicalize("/knowledge-hub"),
  },
  keywords: [
    "IPR study material PDF",
    "download patent guides",
    "trademark registration resources",
    "copyright law PDFs",
    "Intellectual property knowledge hub",
    "IP law downloadable guides",
    "Arshiv legal resources",
  ],
  openGraph: {
    title: "IPR Knowledge Hub & Downloadable PDFs | Arshiv Legal",
    description:
      "Access comprehensive study materials and downloadable PDF guides on Intellectual Property Rights, trademarks, patents, and copyrights.",
    url: canonicalize("/knowledge-hub"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg", // Ensure this exists in /public
        width: 1200,
        height: 630,
        alt: "Arshiv Legal – IPR Knowledge Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPR Knowledge Hub & Downloadable PDFs | Arshiv Legal",
    description:
      "Download free PDFs and study materials on Intellectual Property law, trademarks, patents, and copyrights.",
    images: ["/og-default.jpg"],
  },
};

export const revalidate = 60;

//----------------------------------------------------------
// 🎨 MAIN SERVER PAGE
//----------------------------------------------------------
export default async function KnowledgeHubPage() {
  let knowledgeHubData = [];

  try {
    await dbConnect();

    // 1. Fetch all published study materials
    const materials = await StudyMaterial.find({ isPublished: true })
      .sort({ dateOfPublishing: -1 })
      .lean();

    // 2. Map database fields to match your KnowledgeHubClient expected structure
    knowledgeHubData = materials.map((m) => {
      
      // 🔥 BULLETPROOF DATE LOGIC
      const dateToUse = m.dateOfPublishing ? new Date(m.dateOfPublishing) : new Date(m.createdAt);
      
      const formattedDate = dateToUse.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      return {
        id: m._id.toString(),
        tags: [m.category || "General"],
        date: formattedDate,
        title: m.title,
        description: m.description,
        buttonText: "View PDF", // Updated to match your requirement
        // We pass the PDF link and the data required for the popup here
        pdfUrl: m.pdfUrl,
        isPdf: true, // Flag for your ResourceGrid to trigger the modal
      };
    });
  } catch (error) {
    console.error("Error fetching knowledge hub resources:", error);
  }

  // 3. Generate JSON-LD Schemas
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/knowledge-hub"),
    type: "CollectionPage", // Tells Google this is a hub/collection of resources
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Knowledge Hub", url: canonicalize("/knowledge-hub") },
  ]);

  const organizationSchema = getOrganizationSchema();

  const ld = [pageSchema, breadcrumbSchema, organizationSchema];

  // 4. Pass live data to your interactive client
  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      <KnowledgeHubClient initialData={knowledgeHubData} />
    </>
  );
}