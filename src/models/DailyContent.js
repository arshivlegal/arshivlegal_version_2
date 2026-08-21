import mongoose from "mongoose";

const DailyContentSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    platform: { 
      type: String, 
      required: true,
      enum: ["Instagram", "YouTube", "LinkedIn", "Twitter", "Website"],
      default: "Website"
    },
    description: { 
      type: String, 
      required: true, // The short caption or summary
    },
    externalLink: { 
      type: String, 
      required: true, // The URL to the Reel, Post, or News article
    },
    thumbnail: { 
      type: String, 
      required: true 
    },
    thumbnailPublicId: { 
      type: String 
    },
    isPublished: { 
      type: Boolean, 
      default: true, 
      index: true 
    },
  },
  { timestamps: true }
);

// We add a text index on title and description for the Global Search feature!
DailyContentSchema.index({ title: "text", description: "text" });

export default mongoose.models.DailyContent || mongoose.model("DailyContent", DailyContentSchema);