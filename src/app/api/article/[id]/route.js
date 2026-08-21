import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Article from "@/models/Article";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";
import { articleUpdateSchema } from "@/validators/article.validator";
import { validateBody } from "@/utils/validateRequest";

// GET A SINGLE ARTICLE (For Edit Form & Public Reader Page)
export async function GET(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid Article ID"), { status: 400 });
    }

    // Fetch full document including rich text content
    const article = await Article.findById(id).lean();
    if (!article) {
      return NextResponse.json(new ApiError(404, "Article not found"), { status: 404 });
    }

    return NextResponse.json(new ApiResponse(200, article, "Article fetched"), { status: 200 });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// UPDATE AN ARTICLE
export async function PUT(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid Article ID"), { status: 400 });
    }

    const body = await req.json();
    const validated = await validateBody(articleUpdateSchema, body);
    if (validated instanceof NextResponse) return validated;

    // Strict allowed fields check
    const allowed = [
      "title", "author", "dateOfPublishing", "category", "excerpt",
      "content", "thumbnail", "thumbnailPublicId", "isPublished", "slug"
    ];

    const updates = Object.fromEntries(
      Object.entries(validated).filter(([k]) => allowed.includes(k))
    );

    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json(new ApiError(404, "Article not found"), { status: 404 });
    }

    // 🔥 SMART CLOUDINARY CLEANUP (Deletes old image if replaced)
    if (
      updates.thumbnail &&
      article.thumbnailPublicId &&
      updates.thumbnailPublicId !== article.thumbnailPublicId
    ) {
      cloudinary.uploader.destroy(article.thumbnailPublicId).catch(console.error);
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, lean: true, runValidators: true }
    );

    return NextResponse.json(new ApiResponse(200, updatedArticle, "Article updated"), { status: 200 });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

// DELETE AN ARTICLE
export async function DELETE(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid Article ID"), { status: 400 });
    }

    const deleted = await Article.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json(new ApiError(404, "Article not found"), { status: 404 });
    }

    // 🔥 SMART CLOUDINARY CLEANUP (Deletes image permanently)
    if (deleted.thumbnailPublicId) {
      cloudinary.uploader.destroy(deleted.thumbnailPublicId).catch(console.error);
    }

    return NextResponse.json(new ApiResponse(200, deleted, "Article deleted"), { status: 200 });
  } catch (error) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}