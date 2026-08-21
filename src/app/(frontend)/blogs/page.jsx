import BlogsClient from "./BlogsClient";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export const metadata = {
  title: "Blogs | Arshiv Legal",
  description: "Read our latest blogs on Intellectual Property Rights, trademark infringement, patents, and copyright law in India.",
};

export const revalidate = 0; 

async function getBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    
    return blogs.map((blog) => ({
      id: blog._id.toString(),
      tags: blog.tags || [blog.category || "General"],
      title: blog.title,
      description: blog.description,
      meta: `${blog.category || "General"} • 5 min read`,
      image: blog.thumbnail || "/images/default-blog.webp",
      href: `/blogs/${blog.slug || blog._id.toString()}`, 
    }));
  } catch (error) {
    return [];
  }
}

export default async function BlogsPage() {
  const liveBlogs = await getBlogs();
  return <BlogsClient initialData={liveBlogs} />;
}