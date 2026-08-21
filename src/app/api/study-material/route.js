import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import StudyMaterial from "@/models/StudyMaterial";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { validateBody } from "@/utils/validateRequest";
import { studyMaterialCreateSchema } from "@/validators/studyMaterial.validator";

export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get("published") === "true";

    const filter = publishedOnly ? { isPublished: true } : {};
    const materials = await StudyMaterial.find(filter).sort({ dateOfPublishing: -1 }).lean();

    return NextResponse.json(new ApiResponse(200, materials), { status: 200 });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const validated = await validateBody(studyMaterialCreateSchema, body);
    if (validated instanceof NextResponse) return validated;

    const material = await StudyMaterial.create(validated);
    return NextResponse.json(new ApiResponse(201, material, "Resource published"), { status: 201 });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}