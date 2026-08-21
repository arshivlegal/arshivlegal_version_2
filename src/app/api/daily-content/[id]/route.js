import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import DailyContent from "@/models/DailyContent";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";
import { dailyContentUpdateSchema } from "@/validators/dailyContent.validator";
import { validateBody } from "@/utils/validateRequest";

// GET A SINGLE ITEM (For the Edit Form)
export async function GET(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid ID"), { status: 400 });
    }

    const content = await DailyContent.findById(id).lean();
    if (!content) {
      return NextResponse.json(new ApiError(404, "Content not found"), { status: 404 });
    }

    return NextResponse.json(new ApiResponse(200, content, "Content fetched"), { status: 200 });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// UPDATE AN ITEM
export async function PUT(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid ID"), { status: 400 });
    }

    const body = await req.json();
    const validated = await validateBody(dailyContentUpdateSchema, body);
    if (validated instanceof NextResponse) return validated;

    const allowed = [
      "title", "platform", "description", "externalLink",
      "thumbnail", "thumbnailPublicId", "isPublished"
    ];

    const updates = Object.fromEntries(
      Object.entries(validated).filter(([k]) => allowed.includes(k))
    );

    const existingContent = await DailyContent.findById(id);
    if (!existingContent) {
      return NextResponse.json(new ApiError(404, "Content not found"), { status: 404 });
    }

    // 🔥 SMART CLOUDINARY CLEANUP
    if (
      updates.thumbnail &&
      existingContent.thumbnailPublicId &&
      updates.thumbnailPublicId !== existingContent.thumbnailPublicId
    ) {
      cloudinary.uploader.destroy(existingContent.thumbnailPublicId).catch(console.error);
    }

    const updatedContent = await DailyContent.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, lean: true, runValidators: true }
    );

    return NextResponse.json(new ApiResponse(200, updatedContent, "Content updated"), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// DELETE AN ITEM
export async function DELETE(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid ID"), { status: 400 });
    }

    const deleted = await DailyContent.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json(new ApiError(404, "Content not found"), { status: 404 });
    }

    // 🔥 SMART CLOUDINARY CLEANUP
    if (deleted.thumbnailPublicId) {
      cloudinary.uploader.destroy(deleted.thumbnailPublicId).catch(console.error);
    }

    return NextResponse.json(new ApiResponse(200, deleted, "Content deleted"), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}