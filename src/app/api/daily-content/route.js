import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import DailyContent from "@/models/DailyContent";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { validateBody } from "@/utils/validateRequest";
import { dailyContentCreateSchema } from "@/validators/dailyContent.validator";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

// GET ALL DAILY CONTENT (For Dashboard & Public Frontend)
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const platform = searchParams.get("platform") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = Math.min(50, parseInt(searchParams.get("limit")) || 12);
    const skip = (page - 1) * limit;
    const publishedParam = searchParams.get("published");

    const filter = {};
    if (publishedParam === "true") filter.isPublished = true;
    if (platform) filter.platform = platform;

    // Search across title and description
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), "i");
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const dailyContents = await DailyContent.find(filter)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await DailyContent.countDocuments(filter);

    return NextResponse.json(
      new ApiResponse(200, {
        count: dailyContents.length,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        dailyContents,
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// CREATE NEW DAILY CONTENT
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();

    const validated = await validateBody(dailyContentCreateSchema, body);
    if (validated instanceof NextResponse) return validated;

    const content = await DailyContent.create(validated);

    return NextResponse.json(
      new ApiResponse(201, content, "Daily content published successfully"),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}