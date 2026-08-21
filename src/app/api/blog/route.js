import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Blog from "@/models/Blog"; 
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { validateBody } from "@/utils/validateRequest";
import { blogCreateSchema } from "@/validators/blog.validator";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = Math.min(50, parseInt(searchParams.get("limit")) || 10);
    const skip = (page - 1) * limit;
    const publishedParam = searchParams.get("published");

    const filter = {};
    if (publishedParam === "true") filter.isPublished = true;
    if (category) filter.category = category;

    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), "i"); 
      filter.$or = [
        { title: searchRegex }, { description: searchRegex },
        { content: searchRegex }, { category: searchRegex }, { tags: searchRegex }
      ];
    }

    const projection = {
      title: 1, description: 1, content: 1, category: 1, tags: 1,
      slug: 1, thumbnail: 1, type: 1, duration: 1, createdAt: 1,
    };

    const blogs = await Blog.find(filter, projection)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(filter);

    return NextResponse.json(
      new ApiResponse(200, {
        count: blogs.length, total, currentPage: page,
        totalPages: Math.ceil(total / limit), blogs,
        searchQuery: query || null, categoryFilter: category || null,
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const validated = await validateBody(blogCreateSchema, body);
    if (validated instanceof NextResponse) return validated;

    const { title, description = "", content, category, tags, thumbnail, thumbnailPublicId = "" } = validated;

    if (!title?.trim() || !content?.trim() || !thumbnail?.trim() || !Array.isArray(tags) || tags.length === 0) {
      throw new ApiError(400, "Title, content, thumbnail and at least one tag are required");
    }

    // 🔥 CREATE SEO SLUG FROM TITLE safely
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/(^-|-$)+/g, ''); 

    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const blog = await Blog.create({
      title, description, content, category, tags, slug, 
      thumbnail, thumbnailPublicId, isPublished: true,
    });

    return NextResponse.json(new ApiResponse(201, blog, "Blog created successfully"), { status: 201 });
  } catch (error) {
    return NextResponse.json(new ApiError(error.statusCode || 500, error.message), { status: error.statusCode || 500 });
  }
}