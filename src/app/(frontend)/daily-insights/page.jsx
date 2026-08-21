import DailyInsightsClient from "./DailyInsightsClient";
import dbConnect from "@/lib/dbConnect";
import DailyContent from "@/models/DailyContent";

// ✅ PERFECT SEO!
export const metadata = {
  title: "Daily Insights & Videos | Arshiv Legal",
  description: "Watch our daily video insights on Intellectual Property, trademark registration, and legal advice for startups.",
};

export default async function DailyInsightsPage() {
  let insightsData = [];

  try {
    await dbConnect();

    // 1. Fetch all published daily content, newest first
    const contents = await DailyContent.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Map the database fields to exactly what your VideoGrid expects
    insightsData = contents.map((c) => ({
      id: c._id.toString(),
      tags: [c.platform || "Insight"], // Displays 'Instagram', 'YouTube', etc.
      title: c.title,
      description: c.description,
      image: c.thumbnail || "/images/default-daily.webp",
      href: c.externalLink, // The direct link to the social platform
      isExternal: true, // Flag to help the UI know it's an off-site link
    }));
  } catch (error) {
    console.error("Error fetching daily insights:", error);
  }

  // 3. Pass the live database array to your interactive client component!
  return <DailyInsightsClient initialData={insightsData} />;
}