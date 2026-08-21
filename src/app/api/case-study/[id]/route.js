import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import CaseStudy from "@/models/CaseStudy";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";
import { caseStudyUpdateSchema } from "@/validators/caseStudy.validator";
import { validateBody } from "@/utils/validateRequest";

// GET A SINGLE CASE STUDY (Used for the Edit Form & Public Reader Page)
export async function GET(req, context) {
  try {
    await connectToDB();
    
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid case study ID"), { status: 400 });
    }

    // We fetch EVERYTHING here, including the heavy 'content' so you can edit it.
    const caseStudy = await CaseStudy.findById(id).lean();

    if (!caseStudy) {
      return NextResponse.json(new ApiError(404, "Case study not found"), { status: 404 });
    }

    return NextResponse.json(new ApiResponse(200, caseStudy, "Case study fetched"), { status: 200 });

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// UPDATE A CASE STUDY
export async function PUT(req, context) {
  try {
    await connectToDB();
    
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid case study ID"), { status: 400 });
    }

    const body = await req.json();
    const validated = await validateBody(caseStudyUpdateSchema, body);
    if (validated instanceof NextResponse) return validated;

    // Strict list of allowed fields to prevent database injection
    const allowed = [
      "title", "court", "dateOfJudgment", "overview", "category",
      "content", "keyTakeaway", "heroImage", "heroImagePublicId", 
      "isPublished", "slug"
    ];

    const updates = Object.fromEntries(
      Object.entries(validated).filter(([k]) => allowed.includes(k))
    );

    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      return NextResponse.json(new ApiError(404, "Case study not found"), { status: 404 });
    }

    // 🔥 SMART CLOUDINARY CLEANUP
    // If you upload a new hero image, delete the old one from Cloudinary so you don't waste storage space!
    if (
      updates.heroImage &&
      caseStudy.heroImagePublicId &&
      updates.heroImagePublicId !== caseStudy.heroImagePublicId
    ) {
      cloudinary.uploader.destroy(caseStudy.heroImagePublicId).catch(console.error);
    }

    const updatedCaseStudy = await CaseStudy.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, lean: true, runValidators: true }
    );

    return NextResponse.json(new ApiResponse(200, updatedCaseStudy, "Case study updated"), {
      status: 200
    });

  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// DELETE A CASE STUDY
export async function DELETE(req, context) {
  try {
    await connectToDB();
    
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid case study ID"), { status: 400 });
    }

    const deleted = await CaseStudy.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json(new ApiError(404, "Case study not found"), { status: 404 });
    }

    // 🔥 SMART CLOUDINARY CLEANUP
    // Delete the image from Cloudinary when the case study is deleted
    if (deleted.heroImagePublicId) {
      cloudinary.uploader.destroy(deleted.heroImagePublicId).catch(console.error);
    }

    return NextResponse.json(new ApiResponse(200, deleted, "Case study deleted"), {
      status: 200
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}