import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import { notFound } from "next/navigation";
import ArticleContentClient from "./ArticleContentClient"; // 🔥 Import the interactive UI

// 🔥 MATH HELPER
function calculateReadTime(content) {
  if (!content) return 1;
  const plainText = content.replace(/<[^>]+>/g, '');
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// AUTOMATIC SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const article = await Article.findOne({ slug }).lean();

  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | ${article.author}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.thumbnail],
    },
  };
}

// MAIN SERVER COMPONENT
export default async function ArticleReaderPage({ params }) {
  const { slug } = await params;
  await dbConnect();

  const article = await Article.findOne({ slug }).lean();

  if (!article) {
    notFound();
  }

  // 1. Format the Date safely
  const dateToUse = article.dateOfPublishing ? new Date(article.dateOfPublishing) : new Date(article.createdAt);
  const formattedDate = dateToUse.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 2. Calculate read time
  const readTime = calculateReadTime(article.content);

  // 3. Pass everything to the Client Component
  return (
    <ArticleContentClient 
      article={article} 
      formattedDate={formattedDate} 
      readTime={readTime} 
    />
  );
}