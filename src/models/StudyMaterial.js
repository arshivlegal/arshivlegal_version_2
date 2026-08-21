import mongoose from "mongoose";

const StudyMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    
    // We will use this to display the "August 7, 2025" on the card
    dateOfPublishing: { type: Date, required: true, default: Date.now },
    
    category: { type: String, required: true, default: "General" },
    
    // The actual PDF File Data
    pdfUrl: { type: String, required: true },
    pdfPublicId: { type: String, required: true },
    
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// We add a text index so your frontend Search Bar can find these easily
StudyMaterialSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.models.StudyMaterial || mongoose.model("StudyMaterial", StudyMaterialSchema);