import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🔥 THE FIX: Detect if it's a PDF and force Cloudinary to treat it as a "raw" document
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const uploadResourceType = isPdf ? "raw" : "auto";

    // Upload stream to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "arshivLegal/uploads",
          resource_type: uploadResourceType, // Will be "raw" for PDFs and "auto" for Images!
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Cloudinary automatically adds the extension for 'raw' files, so we don't need the manual fix anymore
    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        data: {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          resource_type: uploadResult.resource_type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}