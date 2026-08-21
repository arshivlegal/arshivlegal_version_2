import BlogContentPage from "./BlogContentPage";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { notFound } from "next/navigation";

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
    
    return {
      title: `${blog.title} | Arshiv Legal`,
      description: blog.description,
    };
  } catch {
    return { title: "Blog Not Found" };
  }
}

export default async function SingleBlogPage({ params }) {
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
    
    if (!blog) {
      notFound(); 
    }

    const serializedBlog = {
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: blog.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return <BlogContentPage blog={serializedBlog} />;
    
  } catch (error) {
    notFound(); 
  }
}