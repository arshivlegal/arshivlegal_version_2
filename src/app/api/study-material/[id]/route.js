import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import StudyMaterial from "@/models/StudyMaterial";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import cloudinary from "@/lib/cloudinary"; 
import mongoose from "mongoose";

// GET - Fetches a single resource for the Edit Form
export async function GET(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid ID"), { status: 400 });
    }

    const material = await StudyMaterial.findById(id).lean();
    if (!material) {
      return NextResponse.json(new ApiError(404, "Material not found"), { status: 404 });
    }

    return NextResponse.json(new ApiResponse(200, material), { status: 200 });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// PUT - Updates a single resource from the Edit Form
export async function PUT(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid ID"), { status: 400 });
    }

    const updated = await StudyMaterial.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!updated) {
      return NextResponse.json(new ApiError(404, "Material not found"), { status: 404 });
    }

    return NextResponse.json(new ApiResponse(200, updated, "Material updated"), { status: 200 });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// DELETE - Removes the resource and deletes the PDF from Cloudinary
export async function DELETE(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid ID"), { status: 400 });
    }

    const deleted = await StudyMaterial.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json(new ApiError(404, "Material not found"), { status: 404 });
    }

    // AUTOMATIC PDF CLEANUP
    if (deleted.pdfPublicId) {
      await cloudinary.uploader.destroy(deleted.pdfPublicId, { resource_type: "raw" });
    }

    return NextResponse.json(new ApiResponse(200, deleted, "Material deleted"), { status: 200 });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}