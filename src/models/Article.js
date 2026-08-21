import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    // Core Info
    title: { type: String, required: true, trim: true },
    searchTitle: { type: String, index: true }, // For optimized searching
    slug: { type: String, unique: true, required: true },
    
    // Article Specifics
    author: { type: String, required: true, trim: true }, // e.g., "Adv. Saksham Pandey"
    dateOfPublishing: { type: Date, required: true },
    category: { type: String, required: true, trim: true },
    
    // Content
    excerpt: { type: String, required: true }, // Short summary for the grid view
    content: { type: String, required: true }, // The full rich-text article
    
    // Media (With Cloudinary cleanup support)
    thumbnail: { type: String, required: true },
    thumbnailPublicId: { type: String },
    
    // Visibility
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Auto-create lower-case search field
ArticleSchema.pre("save", async function () {
  if (!this.isModified("title")) return; 
  this.searchTitle = this.title.toLowerCase();
});

// Full-text search index optimized for legal publications
ArticleSchema.index(
  { 
    title: "text", 
    author: "text", 
    excerpt: "text", 
    category: "text",
    content: "text" 
  },
  { 
    weights: { title: 5, author: 4, category: 3, excerpt: 2, content: 1 } 
  }
);

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);