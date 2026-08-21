import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";
import { blogUpdateSchema } from "@/validators/blog.validator";
import { validateBody } from "@/utils/validateRequest";

export async function GET(req, context) {
  try {
    await connectToDB();
    
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid blog ID"), { status: 400 });
    }

    // Added "slug" to the select projection just in case you ever need to fetch it client-side
    const blog = await Blog.findById(id)
      .select("title content thumbnail description category tags createdAt isPublished duration slug")
      .lean();

    if (!blog) {
      return NextResponse.json(new ApiError(404, "Blog not found"), { status: 404 });
    }

    return NextResponse.json(new ApiResponse(200, blog, "Blog fetched"), { status: 200 });

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectToDB();
    
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid blog ID"), { status: 400 });
    }

    const body = await req.json();
    const validated = await validateBody(blogUpdateSchema, body);
    if (validated instanceof NextResponse) return validated;

    // 🔥 Added "slug" to your allowed array so it actually saves when edited!
    const allowed = [
      "title",
      "content",
      "thumbnail",
      "thumbnailPublicId",
      "category",
      "tags",
      "description",
      "isPublished",
      "duration",
      "slug" 
    ];

    const updates = Object.fromEntries(
      Object.entries(validated).filter(([k]) => allowed.includes(k))
    );

    // 🔥 AUTO-CALCULATE READ TIME on update
    // If you edit the content, it will recount the words and update the read time automatically!
    if (updates.content) {
      const plainText = updates.content.replace(/<[^>]+>/g, '');
      const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
      updates.duration = Math.max(1, Math.ceil(wordCount / 200));
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(new ApiError(404, "Blog not found"), { status: 404 });
    }

    // Your excellent Cloudinary cleanup logic
    if (
      updates.thumbnail &&
      blog.thumbnailPublicId &&
      updates.thumbnailPublicId !== blog.thumbnailPublicId
    ) {
      cloudinary.uploader.destroy(blog.thumbnailPublicId).catch(console.error);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, lean: true, runValidators: true }
    );

    return NextResponse.json(new ApiResponse(200, updatedBlog, "Blog updated"), {
      status: 200
    });

  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectToDB();
    
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid blog ID"), { status: 400 });
    }

    const deleted = await Blog.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json(new ApiError(404, "Blog not found"), { status: 404 });
    }

    // Your excellent Cloudinary cleanup logic
    if (deleted.thumbnailPublicId) {
      cloudinary.uploader.destroy(deleted.thumbnailPublicId).catch(console.error);
    }

    return NextResponse.json(new ApiResponse(200, deleted, "Blog deleted"), {
      status: 200
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}