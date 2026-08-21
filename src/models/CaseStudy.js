import mongoose from "mongoose";

const CaseStudySchema = new mongoose.Schema(
  {
    // Basic Info
    title: { type: String, required: true, trim: true },
    searchTitle: { type: String, index: true },
    slug: { type: String, unique: true, required: true },
    
    // Case Specific Info
    court: { type: String, required: true, trim: true }, // e.g., "Delhi High Court"
    dateOfJudgment: { type: Date, required: true },
    
    // Content
    overview: { type: String, required: true }, // Short description for grids
    category: { type: String, required: true, trim: true },
    heroImage: { type: String, required: true },
    heroImagePublicId: { type: String }, // For Cloudinary cleanup
    content: { type: String, required: true }, // The full judgment details
    keyTakeaway: { type: String, required: true }, // Special highlight box
    
    // Status
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Auto-create lower-case search field for precise querying
CaseStudySchema.pre("save", async function () {
  if (!this.isModified("title")) return; 
  this.searchTitle = this.title.toLowerCase();
});

// Full-text index optimized for legal searches
CaseStudySchema.index(
  { 
    title: "text", 
    court: "text", 
    overview: "text", 
    category: "text", 
    keyTakeaway: "text",
    content: "text" 
  },
  { 
    // Gives higher search priority to the Title and Court name
    weights: { title: 5, court: 4, category: 3, overview: 2, keyTakeaway: 2, content: 1 } 
  }
);

export default mongoose.models.CaseStudy || mongoose.model("CaseStudy", CaseStudySchema);