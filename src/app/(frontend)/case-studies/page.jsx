import CaseStudiesClient from "./CaseStudiesClient";
import dbConnect from "@/lib/dbConnect";
import CaseStudy from "@/models/CaseStudy";

export const metadata = {
  title: "Case Studies | Arshiv Legal",
  description: "Explore landmark Intellectual Property case studies in India, including trademark, patent, and copyright rulings.",
};

export default async function CaseStudiesPage() {
  let caseStudiesData = [];

  try {
    await dbConnect();

    // 1. Fetch all published cases from the database
    const cases = await CaseStudy.find({ isPublished: true })
      .sort({ dateOfJudgment: -1 })
      .lean();

    // 2. Map the database fields to exactly what your CaseStudyCard expects
    caseStudiesData = cases.map((c) => ({
      id: c._id.toString(),
      tags: [c.category], // E.g., ["Trademark"]
      title: c.title,
      description: c.overview,
      // Creates the exact format you wanted: "Patent • Supreme Court"
      meta: `${c.category || "IP Law"} • ${c.court || "Court"}`, 
      image: c.heroImage || "/images/default-case.webp",
      href: `/case-studies/${c.slug || c._id.toString()}`,
    }));
  } catch (error) {
    console.error("Error fetching case studies for main page:", error);
  }

  // 3. Pass the live database array to your interactive client component!
  return <CaseStudiesClient initialData={caseStudiesData} />;
}