import BlogsClient from "./BlogsClient";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
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
  title: "IPR Blogs & Legal Updates | Arshiv Legal",
  description:
    "Practical tips, industry trends, and everyday guidance on protecting your innovations. Read our latest blogs on Intellectual Property Rights, patents, and trademarks.",
  alternates: {
    canonical: canonicalize("/blogs"),
  },
  keywords: [
    "IPR blogs India",
    "patent law updates",
    "trademark protection tips",
    "copyright law guidance",
    "intellectual property news",
    "Arshiv legal blogs",
  ],
  openGraph: {
    title: "IPR Blogs & Legal Updates | Arshiv Legal",
    description:
      "Practical tips, industry trends, and everyday guidance on protecting your innovations. Read our latest blogs on Intellectual Property Rights, patents, and trademarks.",
    url: canonicalize("/blogs"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg", // Ensure this exists in /public
        width: 1200,
        height: 630,
        alt: "Arshiv Legal – IPR Blogs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPR Blogs & Legal Updates | Arshiv Legal",
    description:
      "Read the latest updates and practical tips on protecting your Intellectual Property Rights.",
    images: ["/og-default.jpg"],
  },
};

export const dynamic = "force-dynamic"

export const revalidate = 0; 

// 🔥 MATH HELPER: Calculates read time instantly from the content text
function calculateReadTime(content) {
  if (!content) return 1;
  const plainText = content.replace(/<[^>]+>/g, '');
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

//----------------------------------------------------------
// 💾 DATABASE FETCHING
//----------------------------------------------------------
async function getBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    
    return blogs.map((blog) => {
      // Calculate real read time based on the blog's content length
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
    console.error("Error fetching blogs:", error);
    return [];
  }
}



//----------------------------------------------------------
// 🎨 MAIN SERVER PAGE
//----------------------------------------------------------
export default async function BlogsPage() {
  const liveBlogs = await getBlogs();

  // 1. Generate JSON-LD Schemas
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/blogs"),
    type: "CollectionPage", // Tells Google this is an index/list of blogs
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Blogs", url: canonicalize("/blogs") },
  ]);

  const organizationSchema = getOrganizationSchema();

  const ld = [pageSchema, breadcrumbSchema, organizationSchema];

  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      <BlogsClient initialData={liveBlogs} />
    </>
  );
}