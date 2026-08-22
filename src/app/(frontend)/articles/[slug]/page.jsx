import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import { notFound } from "next/navigation";
import ArticleContentClient from "./ArticleContentClient"; 
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import { getBreadcrumbSchema, getOrganizationSchema } from "@/utils/schema";

// 🔥 MATH HELPER: Calculates read time instantly from the content text
function calculateReadTime(content) {
  if (!content) return 1;
  const plainText = content.replace(/<[^>]+>/g, '');
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

//----------------------------------------------------------
// 🔥 AUTOMATIC SEO FOR EVERY DYNAMIC ARTICLE
//----------------------------------------------------------
export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const article = await Article.findOne({ slug }).lean();

  if (!article) return { title: "Article Not Found" };

  const articleUrl = canonicalize(`/articles/${slug}`);

  return {
    title: `${article.title} | ${SEO_CONFIG.siteName}`,
    description: article.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    // Dynamically inject the article's category as a keyword, plus your IPR base
    keywords: [
      article.category,
      "Intellectual Property Rights",
      "IPR law India",
      "Arshiv Legal articles",
      article.author
    ],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      siteName: SEO_CONFIG.siteName,
      type: "article",
      publishedTime: article.dateOfPublishing || article.createdAt,
      authors: [article.author],
      images: [
        {
          url: article.thumbnail || "/og-default.jpg",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.thumbnail || "/og-default.jpg"],
    },
  };
}

//----------------------------------------------------------
// 🎨 MAIN SERVER COMPONENT
//----------------------------------------------------------
//----------------------------------------------------------
// 🎨 MAIN SERVER COMPONENT
//----------------------------------------------------------
export default async function ArticleReaderPage({ params }) {
  const { slug } = await params;
  await dbConnect();

  const article = await Article.findOne({ slug }).lean();

  if (!article) {
    notFound();
  }

  const articleUrl = canonicalize(`/articles/${slug}`);

  // 1. Format the Date safely
  const dateToUse = article.dateOfPublishing ? new Date(article.dateOfPublishing) : new Date(article.createdAt);
  const formattedDate = dateToUse.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 2. Calculate read time
  const readTime = calculateReadTime(article.content);

  // 3. 🧠 BUILD RICH SCHEMAS FOR GOOGLE
  
  // Custom Article Schema (Crucial for getting into Google News/Discover)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "headline": article.title,
    "description": article.excerpt,
    "image": article.thumbnail || `${SEO_CONFIG.siteUrl}/og-default.jpg`,
    "author": {
      "@type": "Person",
      "name": article.author,
      "url": SEO_CONFIG.siteUrl
    },
    "publisher": getOrganizationSchema(),
    "datePublished": dateToUse.toISOString(),
    "dateModified": new Date(article.updatedAt).toISOString()
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Articles", url: canonicalize("/articles") },
    { name: article.title, url: articleUrl },
  ]);

  const ld = [articleSchema, breadcrumbSchema];

  // 4. 🔥 DEFINE THE SERIALIZED ARTICLE HERE (This was missing!)
  const serializedArticle = {
    ...article,
    _id: article._id.toString(), 
    createdAt: article.createdAt?.toISOString() || null,
    updatedAt: article.updatedAt?.toISOString() || null,
    dateOfPublishing: article.dateOfPublishing?.toISOString() || null,
  };

  // 5. Pass everything to the Client Component
  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      <ArticleContentClient 
        article={serializedArticle} 
        formattedDate={formattedDate} 
        readTime={readTime} 
      />
    </>
  );
}