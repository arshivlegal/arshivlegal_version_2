import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Article from "@/models/Article";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { validateBody } from "@/utils/validateRequest";
import { articleCreateSchema } from "@/validators/article.validator";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

// GET ALL ARTICLES (For Dashboard List & Public Grid)
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

    // Search across title, author, and excerpt
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), "i");
      filter.$or = [
        { title: searchRegex }, { author: searchRegex }, { excerpt: searchRegex }
      ];
    }

    // Lean projection: excludes the heavy 'content' string to keep the list API fast
    const projection = {
      title: 1, author: 1, dateOfPublishing: 1, category: 1,
      excerpt: 1, slug: 1, thumbnail: 1, isPublished: 1, createdAt: 1,
    };

    const articles = await Article.find(filter, projection)
      .sort({ dateOfPublishing: -1 }) // Sort by actual publication date!
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Article.countDocuments(filter);

    return NextResponse.json(
      new ApiResponse(200, {
        count: articles.length, total, currentPage: page,
        totalPages: Math.ceil(total / limit), articles,
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// CREATE A NEW ARTICLE
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    
    // 1. Validate incoming data
    const validated = await validateBody(articleCreateSchema, body);
    if (validated instanceof NextResponse) return validated; 

    const { 
      title, author, dateOfPublishing, category, 
      excerpt, content, thumbnail, thumbnailPublicId, isPublished 
    } = validated;

    if (!title?.trim() || !author?.trim() || !content?.trim()) {
      throw new ApiError(400, "Title, author, and content are required");
    }

    // 2. 🔥 AUTO-GENERATE SEO SLUG
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/(^-|-$)+/g, ''); 

    let slug = baseSlug;
    let counter = 1;
    while (await Article.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 3. SAVE TO DB
    const article = await Article.create({
      title, author, dateOfPublishing, category, excerpt, 
      content, slug, thumbnail, thumbnailPublicId, isPublished
    });

    return NextResponse.json(new ApiResponse(201, article, "Article published successfully"), { status: 201 });
  } catch (error) {
    return NextResponse.json(new ApiError(error.statusCode || 500, error.message), { status: error.statusCode || 500 });
  }
}