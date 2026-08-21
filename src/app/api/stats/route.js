import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import CaseStudy from "@/models/CaseStudy";
import DailyContent from "@/models/DailyContent";
import Article from "@/models/Article";
import StudyMaterial from "@/models/StudyMaterial";

// Force dynamic so the dashboard always shows live numbers, not cached ones
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDB();

    // Fetch all counts at the exact same time for maximum speed
    const [
      blogCount,
      caseStudyCount,
      dailyContentCount,
      articleCount,
      studyMaterialCount,
    ] = await Promise.all([
      Blog.countDocuments(),
      CaseStudy.countDocuments(),
      DailyContent.countDocuments(),
      Article.countDocuments(),
      StudyMaterial.countDocuments(),
    ]);

    // Calculate total uploads
    const uploadCount = blogCount + caseStudyCount + dailyContentCount + articleCount + studyMaterialCount;

    return NextResponse.json({
      success: true,
      data: {
        blogCount,
        caseStudyCount,
        dailyContentCount,
        articleCount,
        studyMaterialCount,
        contactsCount: 0, // Placeholder until you add a Contact form/model
        uploadCount,
      },
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}