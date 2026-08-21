import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    searchTitle: { type: String, index: true },
    slug: { type: String, unique: true, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
    thumbnailPublicId: { type: String },
    tags: { type: [String], default: [], index: true },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Only use pre-save for searchTitle. Leave slug to the API route!
BlogSchema.pre("save", async function () {
  if (!this.isModified("title")) return; 
  this.searchTitle = this.title.toLowerCase();
});

// Full text search index
BlogSchema.index(
  { title: "text", description: "text", content: "text", tags: "text", category: "text" },
  { weights: { title: 5, description: 3, tags: 3, category: 2, content: 1 } }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);