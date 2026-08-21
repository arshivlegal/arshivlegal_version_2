import ArticlesClient from "./ArticlesClient";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";

// ✅ PERFECT SEO!
export const metadata = {
  title: "Articles & Insights | Arshiv Legal",
  description: "Read our comprehensive articles on Intellectual Property Rights, trademark infringement, patents, and copyright law in India.",
};

export default async function ArticlesPage() {
  let articlesData = [];

  try {
    await dbConnect();

    // 1. Fetch all published articles, sorted by newest publication date
    const articles = await Article.find({ isPublished: true })
      .sort({ dateOfPublishing: -1 })
      .lean();

    // 2. Map the database fields to exactly what your ArticleList expects
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

  // 3. Pass the live database array to your interactive client component!
  return <ArticlesClient initialData={articlesData} />;
}