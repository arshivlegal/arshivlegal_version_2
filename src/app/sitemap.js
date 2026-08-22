import { SEO_CONFIG } from "@/lib/seo-config";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import Article from "@/models/Article";
import CaseStudy from "@/models/CaseStudy";

export default async function sitemap() {
  const baseUrl = SEO_CONFIG.siteUrl.replace(/\/$/, "");
  const url = (path) => `${baseUrl}${path}`;

  // ---------------- 1. NEW CORE ROUTES ----------------
  const coreRoutes = [
    "",
    "/about",
    "/contact",
    "/blogs",
    "/articles",
    "/case-studies",
    "/knowledge-hub",
    "/daily-insights",
    "/search",
    "/privacy-policy",
    "/terms-of-use",
  ].map((route) => ({
    url: url(route),
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // ---------------- 2. DYNAMIC MONGODB ROUTES ----------------
  let dynamicRoutes = [];

  try {
    await dbConnect();

    // A. Fetch All Blogs
    const blogs = await Blog.find({}).select("slug _id updatedAt createdAt").lean();
    const blogUrls = blogs.map((post) => ({
      url: url(`/blogs/${post.slug || post._id}`),
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // B. Fetch All Published Articles
    const articles = await Article.find({ isPublished: true })
      .select("slug _id updatedAt dateOfPublishing createdAt")
      .lean();
    const articleUrls = articles.map((post) => ({
      url: url(`/articles/${post.slug || post._id}`),
      lastModified: new Date(post.dateOfPublishing || post.updatedAt || post.createdAt),
      changeFrequency: "weekly",
      priority: 0.9, // 🔥 High priority for Articles!
    }));

    // C. Fetch All Published Case Studies
    const caseStudies = await CaseStudy.find({ isPublished: true })
      .select("slug _id updatedAt createdAt")
      .lean();
    const caseUrls = caseStudies.map((post) => ({
      url: url(`/case-studies/${post.slug || post._id}`),
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: "monthly", // Case studies rarely change once posted
      priority: 0.8,
    }));

    // Combine them all
    dynamicRoutes = [...blogUrls, ...articleUrls, ...caseUrls];

  } catch (error) {
    console.error("Sitemap Database Fetch Error:", error);
  }

  // Return the master list to Google
  return [...coreRoutes, ...dynamicRoutes];
}