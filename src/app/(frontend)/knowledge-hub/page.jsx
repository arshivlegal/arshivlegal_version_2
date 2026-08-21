import KnowledgeHubClient from "./KnowledgeHubClient";
import dbConnect from "@/lib/dbConnect";
import StudyMaterial from "@/models/StudyMaterial";

// ✅ PERFECT SEO!
export const metadata = {
  title: "Knowledge Hub & Downloadable Resources | Arshiv Legal",
  description: "Download PDFs and access comprehensive study materials on Intellectual Property law, trademarks, patents, and copyrights.",
};

export default async function KnowledgeHubPage() {
  let knowledgeHubData = [];

  try {
    await dbConnect();

    // 1. Fetch all published study materials
    const materials = await StudyMaterial.find({ isPublished: true })
      .sort({ dateOfPublishing: -1 })
      .lean();

    // 2. Map database fields to match your KnowledgeHubClient expected structure
    knowledgeHubData = materials.map((m) => {
      
      const formattedDate = new Date(m.dateOfPublishing).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      return {
        id: m._id.toString(),
        tags: [m.category || "General"],
        date: formattedDate,
        title: m.title,
        description: m.description,
        buttonText: "View PDF", // Updated to match your requirement
        // We pass the PDF link and the data required for the popup here
        pdfUrl: m.pdfUrl,
        isPdf: true, // Flag for your ResourceGrid to trigger the modal
      };
    });
  } catch (error) {
    console.error("Error fetching knowledge hub resources:", error);
  }

  // 3. Pass live data to your interactive client
  return <KnowledgeHubClient initialData={knowledgeHubData} />;
}