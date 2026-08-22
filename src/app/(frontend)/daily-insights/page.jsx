import DailyInsightsClient from "./DailyInsightsClient";
import dbConnect from "@/lib/dbConnect";
import DailyContent from "@/models/DailyContent";
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import {
  getWebPageSchema,
  getBreadcrumbSchema,
  getOrganizationSchema,
  getPersonSchema,
} from "@/utils/schema";

//----------------------------------------------------------
// 🔥 SEO METADATA
//----------------------------------------------------------
export const metadata = {
  title: "Daily IPR Insights & Legal Videos | Arshiv Legal",
  description:
    "Watch daily video insights and quick legal updates on Intellectual Property Rights (IPR), trademark registration, patents, and copyright law for innovators and startups.",
  alternates: {
    canonical: canonicalize("/daily-insights"),
  },
  keywords: [
    "daily IPR insights",
    "intellectual property videos",
    "trademark registration advice",
    "patent tips for startups",
    "copyright law updates",
    "Arshiv legal videos",
    "Aryan Pandey legal insights",
  ],
  openGraph: {
    title: "Daily IPR Insights & Legal Videos | Arshiv Legal",
    description:
      "Stay ahead of the curve with daily, easy-to-digest legal insights and video updates on protecting your creative and technical assets.",
    url: canonicalize("/daily-insights"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg", // Ensure this exists in /public
        width: 1200,
        height: 630,
        alt: "Arshiv Legal – Daily IPR Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily IPR Insights & Legal Videos | Arshiv Legal",
    description:
      "Watch daily video insights on Intellectual Property, trademark registration, and legal advice for startups.",
    images: ["/og-default.jpg"],
  },
};

export const revalidate = 60;

//----------------------------------------------------------
// 🎨 MAIN SERVER PAGE
//----------------------------------------------------------
export default async function DailyInsightsPage() {
  let insightsData = [];

  try {
    await dbConnect();

    // 1. Fetch all published daily content, newest first
    const contents = await DailyContent.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Map the database fields to exactly what your VideoGrid expects
    insightsData = contents.map((c) => ({
      id: c._id.toString(),
      tags: [c.platform || "Insight"], // Displays 'Instagram', 'YouTube', etc.
      title: c.title,
      description: c.description,
      image: c.thumbnail || "/images/default-daily.webp",
      href: c.externalLink, // The direct link to the social platform
      isExternal: true, // Flag to help the UI know it's an off-site link
    }));
  } catch (error) {
    console.error("Error fetching daily insights:", error);
  }

  // 3. Generate JSON-LD Schemas
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/daily-insights"),
    type: "CollectionPage", // Tells Google this is a gallery/collection page
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Daily Insights", url: canonicalize("/daily-insights") },
  ]);

  const organizationSchema = getOrganizationSchema();

  // 🔥 Adding Person schema establishes Aryan Pandey as the authoritative creator of these videos
  const personSchema = getPersonSchema({
    name: "Aryan Pandey",
    jobTitle: "Principal Legal Professional & Founder",
    image: `${SEO_CONFIG.siteUrl}/Images/AboutFounder.webp`,
    url: canonicalize("/daily-insights"),
    description:
      "Aryan Pandey shares daily insights and expert breakdowns on Intellectual Property Rights (IPR) to educate innovators and researchers.",
    sameAs: [SEO_CONFIG.social.LinkedIn].filter(Boolean),
  });

  const ld = [pageSchema, breadcrumbSchema, organizationSchema, personSchema];

  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      {/* 4. Pass the live database array to your interactive client component! */}
      <DailyInsightsClient initialData={insightsData} />
    </>
  );
}