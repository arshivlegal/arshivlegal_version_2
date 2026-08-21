import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import CaseStudy from "@/models/CaseStudy"; 
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { validateBody } from "@/utils/validateRequest";
import { caseStudyCreateSchema } from "@/validators/caseStudy.validator";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

// GET ALL CASE STUDIES (Used for Dashboard List & Public Frontend)
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

    // Search function looks across title, court, and overview
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), "i"); 
      filter.$or = [
        { title: searchRegex }, { court: searchRegex },
        { overview: searchRegex }, { category: searchRegex }, { keyTakeaway: searchRegex }
      ];
    }

    // We don't fetch the heavy 'content' (full judgment) here to keep the API blazing fast!
    const projection = {
      title: 1, court: 1, dateOfJudgment: 1, overview: 1, category: 1,
      slug: 1, heroImage: 1, isPublished: 1, createdAt: 1,
    };

    const caseStudies = await CaseStudy.find(filter, projection)
      .sort({ dateOfJudgment: -1 }) // Sorted by actual judgment date instead of upload date!
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await CaseStudy.countDocuments(filter);

    return NextResponse.json(
      new ApiResponse(200, {
        count: caseStudies.length, total, currentPage: page,
        totalPages: Math.ceil(total / limit), caseStudies,
        searchQuery: query || null, categoryFilter: category || null,
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// CREATE A NEW CASE STUDY (Used by the Dashboard Form)
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    
    // 1. Validate incoming data using your secure Zod schema
    const validated = await validateBody(caseStudyCreateSchema, body);
    if (validated instanceof NextResponse) return validated; // Stops if validation fails

    const { 
      title, court, dateOfJudgment, overview, category, 
      content, keyTakeaway, heroImage, heroImagePublicId, isPublished 
    } = validated;

    if (!title?.trim() || !court?.trim() || !content?.trim()) {
      throw new ApiError(400, "Title, court, and content are required");
    }

    // 2. 🔥 AUTO-GENERATE SEO SLUG FROM TITLE
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/(^-|-$)+/g, ''); 

    let slug = baseSlug;
    let counter = 1;
    // Check if a case with this exact slug already exists (e.g. two cases named "State v John")
    while (await CaseStudy.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 3. SAVE TO DATABASE
    const caseStudy = await CaseStudy.create({
      title, court, dateOfJudgment, overview, category, content, keyTakeaway, 
      slug, heroImage, heroImagePublicId, isPublished
    });

    return NextResponse.json(new ApiResponse(201, caseStudy, "Case study created successfully"), { status: 201 });
  } catch (error) {
    return NextResponse.json(new ApiError(error.statusCode || 500, error.message), { status: error.statusCode || 500 });
  }
}