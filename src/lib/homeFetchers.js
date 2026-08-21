// src/lib/homeFetchers.js
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import CaseStudy from "@/models/CaseStudy";
import DailyContent from "@/models/DailyContent";
import Article from "@/models/Article";
import StudyMaterial from "@/models/StudyMaterial"; // 🔥 UNCOMMENTED

// Calculates read time instantly from the content text
function calculateReadTime(content) {
  if (!content) return 1;
  const plainText = content.replace(/<[^>]+>/g, '');
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export async function getLatestBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(3).lean();
    
    return blogs.map((blog) => {
      const readTime = blog.duration || calculateReadTime(blog.content);
      return {
        id: blog._id.toString(),
        tags: blog.tags || [blog.category || "General"],
        title: blog.title,
        description: blog.description,
        meta: `${blog.category || "General"} • ${readTime} min read`,
        image: blog.thumbnail || "/images/default-blog.webp",
        href: `/blogs/${blog.slug || blog._id.toString()}`,
      };
    });
  } catch (error) {
    return []; 
  }
}

export async function getLatestCaseStudies() {
  try {
    await dbConnect();
    const cases = await CaseStudy.find({ isPublished: true })
      .sort({ dateOfJudgment: -1 }) 
      .limit(3)
      .lean();
    
    return cases.map((c) => ({
      id: c._id.toString(),
      tags: [c.category || "Case Study"],
      title: c.title,
      description: c.overview,
      meta: `${c.category || "IP Law"} • ${c.court}`,
      image: c.heroImage || "/images/default-case.webp", 
      href: `/case-studies/${c.slug || c._id.toString()}`,
    }));
  } catch (error) {
    return []; 
  }
}

export async function getLatestDailyContent() {
  try {
    await dbConnect();
    const content = await DailyContent.find({ isPublished: true })
      .sort({ createdAt: -1 }) 
      .limit(4)
      .lean();
    
    return content.map((c) => ({
      id: c._id.toString(),
      tags: [c.platform || "Update"],
      title: c.title,
      description: c.description,
      image: c.thumbnail || "/images/default-daily.webp", 
      href: c.externalLink,
      isExternal: true,
    }));
  } catch (error) {
    console.error("Failed to fetch daily content:", error);
    return []; 
  }
}

export async function getLatestArticles() {
  try {
    await dbConnect();
    const articles = await Article.find({ isPublished: true })
      .sort({ dateOfPublishing: -1 }) 
      .limit(3)
      .lean();
    
    return articles.map((a) => {
      const dateToUse = a.dateOfPublishing ? new Date(a.dateOfPublishing) : new Date(a.createdAt);
      const formattedDate = dateToUse.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      return {
        id: a._id.toString(),
        tags: [a.category || "Article"],
        title: a.title,
        description: a.excerpt,
        image: a.thumbnail || "/images/default-article.webp", 
        href: `/articles/${a.slug || a._id.toString()}`,
        date: formattedDate, 
      };
    });
  } catch (error) {
    console.error("Failed to fetch latest articles:", error);
    return [];
  }
}

// 🔥 LIVE STUDY MATERIALS / KNOWLEDGE HUB HOMEPAGE FETCHER
export async function getLatestStudyMaterials() {
  try {
    await dbConnect();
    const materials = await StudyMaterial.find({ isPublished: true })
      .sort({ dateOfPublishing: -1 })
      .limit(4)
      .lean();
    
    return materials.map((m) => {
      const dateToUse = m.dateOfPublishing ? new Date(m.dateOfPublishing) : new Date(m.createdAt);
      const formattedDate = dateToUse.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      return {
        id: m._id.toString(),
        tags: [m.category || "Resource"],
        date: formattedDate,
        title: m.title,
        description: m.description,
        buttonText: "Download PDF",
        pdfUrl: m.pdfUrl,
        isPdf: true,
      };
    });
  } catch (error) {
    console.error("Failed to fetch study materials:", error);
    return [];
  }
}

// Global search data for the Search Bar (Now covers all 5 modules!)
export async function getGlobalSearchData() {
  try {
    await dbConnect();
    
    // 1. Blogs
    const liveBlogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    const mappedBlogs = liveBlogs.map((blog) => ({
      id: blog._id.toString(),
      type: "Blog",
      tags: [...(blog.tags || []), "Blog"],
      title: blog.title,
      description: blog.description,
      image: blog.thumbnail,
      href: `/blogs/${blog.slug || blog._id.toString()}`,
    }));

    // 2. Case Studies
    const liveCaseStudies = await CaseStudy.find({ isPublished: true }).sort({ dateOfJudgment: -1 }).lean();
    const mappedCaseStudies = liveCaseStudies.map((c) => ({
      id: c._id.toString(),
      type: "Case Study",
      tags: [c.category, "Case Study", c.court],
      title: c.title,
      description: c.overview,
      image: c.heroImage,
      href: `/case-studies/${c.slug || c._id.toString()}`,
    }));

    // 3. Daily Content / Insights
    const liveDaily = await DailyContent.find({ isPublished: true }).sort({ createdAt: -1 }).lean();
    const mappedDaily = liveDaily.map((d) => ({
      id: d._id.toString(),
      type: "Daily Insight",
      tags: [d.platform, "Insight", "Video"],
      title: d.title,
      description: d.description,
      image: d.thumbnail,
      href: d.externalLink,
      isExternal: true,
    }));

    // 4. Articles
    const liveArticles = await Article.find({ isPublished: true }).sort({ dateOfPublishing: -1 }).lean();
    const mappedArticles = liveArticles.map((a) => ({
      id: a._id.toString(),
      type: "Article",
      tags: [a.category, "Article", a.author],
      title: a.title,
      description: a.excerpt,
      image: a.thumbnail,
      href: `/articles/${a.slug || a._id.toString()}`,
    }));

    // 5. Knowledge Hub / Study Materials
    const liveMaterials = await StudyMaterial.find({ isPublished: true }).sort({ dateOfPublishing: -1 }).lean();
    const mappedMaterials = liveMaterials.map((m) => ({
      id: m._id.toString(),
      type: "Knowledge Hub",
      tags: [m.category, "PDF", "Resource"],
      title: m.title,
      description: m.description,
      pdfUrl: m.pdfUrl,
      isPdf: true,
      href: "/knowledge-hub",
    }));

    return [
      ...mappedBlogs, 
      ...mappedCaseStudies, 
      ...mappedDaily, 
      ...mappedArticles, 
      ...mappedMaterials
    ];
  } catch (error) {
    console.error("Global search error:", error);
    return [];
  }
}