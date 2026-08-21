import { NextResponse } from "next/server";
import connectToDB from "../../../lib/dbConnect";
import cloudinary from "../../../lib/cloudinary";

export async function GET() {
  try {
    // 1. Test MongoDB Connection
    const db = await connectToDB();
    
    // 2. Test Cloudinary Configuration
    const cloudConfig = cloudinary.config();

    // If both succeed, return this success message!
    return NextResponse.json({ 
      status: "✅ SUCCESS!",
      message: "Both MongoDB and Cloudinary are connected perfectly.",
      databaseHost: db.connection.host,
      cloudinaryCloudName: cloudConfig.cloud_name
    }, { status: 200 });

  } catch (error) {
    // If it fails, it will tell you exactly why
    console.error("❌ Connection Test Failed:", error);
    return NextResponse.json({ 
      status: "❌ FAILED",
      message: "Something went wrong. Check your .env file.",
      error: error.message 
    }, { status: 500 });
  }
}