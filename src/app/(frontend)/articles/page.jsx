import ArticlesClient from "./ArticlesClient";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
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
  title: "Articles on IPR, Patents & Trademarks | Arshiv Legal",
  description:
    "Read in-depth legal articles, scholarly research, and expert insights on Intellectual Property Rights (IPR), patent filings, trademark infringement, and copyright law.",
  alternates: {
    canonical: canonicalize("/articles"),
  },
  keywords: [
    "IPR articles",
    "patent law research",
    "trademark infringement articles",
    "intellectual property insights",
    "copyright law India",
    "Arshiv legal publications",
  ],
  openGraph: {
    title: "Articles on IPR, Patents & Trademarks | Arshiv Legal",
    description:
      "Read in-depth legal articles, scholarly research, and expert insights on Intellectual Property Rights (IPR), patent filings, trademark infringement, and copyright law.",
    url: canonicalize("/articles"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg", // Ensure this exists in /public
        width: 1200,
        height: 630,
        alt: "Arshiv Legal – IPR Articles & Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles on IPR, Patents & Trademarks | Arshiv Legal",
    description:
      "Explore comprehensive articles on Intellectual Property Rights, patents, and trademarks by Arshiv Legal.",
    images: ["/og-default.jpg"],
  },
};



export const dynamic = "force-dynamic"
//----------------------------------------------------------
// 🎨 MAIN SERVER PAGE
//----------------------------------------------------------
export default async function ArticlesPage() {
  let articlesData = [];

  try {
    await dbConnect();

    // 1. Fetch all published articles, sorted by newest publication date
    const articles = await Article.find({ isPublished: true })
      .sort({ dateOfPublishing: -1 })
      .lean();

    // 2. Map the database fields to exactly what your ArticleList expects
    articlesData = articles.map((a) => {
      // 🔥 BULLETPROOF DATE LOGIC:
      // If dateOfPublishing exists, use it. Otherwise, use createdAt.
      const dateToUse = a.dateOfPublishing ? new Date(a.dateOfPublishing) : new Date(a.createdAt);
      
      const formattedDate = dateToUse.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      return {
        id: a._id.toString(),
        tags: [a.category || "General"], 
        title: a.title,
        date: formattedDate, // Now it is guaranteed to be a real date!
        description: a.excerpt, 
        image: a.thumbnail || "/images/default-article.webp",
        href: `/articles/${a.slug || a._id.toString()}`,
      };
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
  }

  // 3. Generate JSON-LD Schemas
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/articles"),
    type: "CollectionPage", // Tells Google this is a list/hub of articles
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Articles", url: canonicalize("/articles") },
  ]);

  const organizationSchema = getOrganizationSchema();

  const ld = [pageSchema, breadcrumbSchema, organizationSchema];

  // 4. Render the page with the injected JSON-LD
  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      {/* 3. Pass the live database array to your interactive client component! */}
      <ArticlesClient initialData={articlesData} />
    </>
  );
}