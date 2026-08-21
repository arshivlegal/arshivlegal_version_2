import dbConnect from "@/lib/dbConnect";
import CaseStudy from "@/models/CaseStudy";
import { notFound } from "next/navigation";
import CaseStudyContentClient from "./CaseStudyContentClient"; // 🔥 Import the interactive UI

// 🔥 SEO AUTOMATION
export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const caseStudy = await CaseStudy.findOne({ slug }).lean();

  if (!caseStudy) return { title: "Case Study Not Found" };

  return {
    title: `${caseStudy.title} | Arshiv Legal`,
    description: caseStudy.overview,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.overview,
      images: [caseStudy.heroImage],
    },
  };
}

// 🎨 MAIN SERVER PAGE
export default async function CaseStudyReaderPage({ params }) {
  const { slug } = await params;
  await dbConnect();

  // Fetch the specific case study
  const caseStudy = await CaseStudy.findOne({ slug }).lean();

  if (!caseStudy) {
    notFound();
  }

  // Format the date safely
  const dateToUse = caseStudy.dateOfJudgment ? new Date(caseStudy.dateOfJudgment) : new Date(caseStudy.createdAt);
  const formattedDate = dateToUse.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <CaseStudyContentClient 
      caseStudy={caseStudy} 
      formattedDate={formattedDate} 
    />
  );
}