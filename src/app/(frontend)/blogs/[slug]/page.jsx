import BlogContentPage from "./BlogContentPage";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { notFound } from "next/navigation";
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import { getBreadcrumbSchema, getOrganizationSchema } from "@/utils/schema";

//----------------------------------------------------------
// 🔥 AUTOMATIC SEO FOR EVERY DYNAMIC BLOG
//----------------------------------------------------------
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const identifier = resolvedParams.slug || resolvedParams.id; 
  
  await dbConnect();
  
  try {
    // 🔥 100% safe Regex ID check (prevents Next.js crashes)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId 
      ? { $or: [{ slug: identifier }, { _id: identifier }] } 
      : { slug: identifier };

    const blog = await Blog.findOne(query).lean();
    
    if (!blog) return { title: "Blog Not Found" };
    
    const blogUrl = canonicalize(`/blogs/${blog.slug || blog._id.toString()}`);

    return {
      title: `${blog.title} | ${SEO_CONFIG.siteName}`,
      description: blog.description,
      alternates: {
        canonical: blogUrl,
      },
      // Dynamically inject blog tags and category, combined with IPR core keywords
      keywords: [
        ...(blog.tags || []),
        blog.category || "General",
        "Intellectual Property Rights",
        "IPR blog India",
        "Arshiv Legal updates"
      ],
      openGraph: {
        title: blog.title,
        description: blog.description,
        url: blogUrl,
        siteName: SEO_CONFIG.siteName,
        type: "article", // Blog posts use the 'article' OG type
        publishedTime: blog.createdAt,
        images: [
          {
            url: blog.thumbnail || "/og-default.jpg",
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.description,
        images: [blog.thumbnail || "/og-default.jpg"],
      },
    };
  } catch {
    return { title: "Blog Not Found" };
  }
}

//----------------------------------------------------------
// 🎨 MAIN SERVER COMPONENT
//----------------------------------------------------------
export default async function SingleBlogPage({ params }) {
  const resolvedParams = await params;
  const identifier = resolvedParams.slug || resolvedParams.id;
  
  await dbConnect();
  
  try {
    // 🔥 100% safe Regex ID check
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId 
      ? { $or: [{ slug: identifier }, { _id: identifier }] } 
      : { slug: identifier };

    const blog = await Blog.findOne(query).lean();
    
    if (!blog) {
      notFound(); 
    }

    const blogUrl = canonicalize(`/blogs/${blog.slug || blog._id.toString()}`);

    // 1. 🧠 BUILD RICH SCHEMAS FOR GOOGLE
    // BlogPosting Schema (Helps Google structure your content properly)
    const blogPostingSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": blogUrl
      },
      "headline": blog.title,
      "description": blog.description,
      "image": blog.thumbnail || `${SEO_CONFIG.siteUrl}/og-default.jpg`,
      "author": {
        "@type": "Person",
        "name": blog.author || "Aryan Pandey", // Fallback if no author field exists
        "url": SEO_CONFIG.siteUrl
      },
      "publisher": getOrganizationSchema(),
      "datePublished": blog.createdAt?.toISOString() || new Date().toISOString(),
      "dateModified": blog.updatedAt?.toISOString() || new Date().toISOString()
    };

    const breadcrumbSchema = getBreadcrumbSchema([
      { name: "Home", url: canonicalize("/") },
      { name: "Blogs", url: canonicalize("/blogs") },
      { name: blog.title, url: blogUrl },
    ]);

    const ld = [blogPostingSchema, breadcrumbSchema];

    // 2. Format dates for the client component
    const serializedBlog = {
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: blog.updatedAt?.toISOString() || new Date().toISOString(),
    };

    // 3. Render the UI
    return (
      <>
        {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
        <JsonLd data={ld} />
        
        <BlogContentPage blog={serializedBlog} />
      </>
    );
    
  } catch (error) {
    console.error("Single Blog Fetch Error:", error);
    notFound(); 
  }
}