import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    service: {
      type: String,
      required: [true, "Inquiry type is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Unread", "Read", "Resolved"], // Helps you organize them in the dashboard
      default: "Unread",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt dates
  }
);

// Check if the model exists before compiling it (fixes Next.js hot-reload issues)
export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);