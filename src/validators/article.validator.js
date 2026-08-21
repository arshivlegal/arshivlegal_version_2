import { z } from "zod";

export const articleCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  author: z.string().min(2, "Author name is required"),
  
  // Accepts either a string from a date picker or a Date object
  dateOfPublishing: z.string().or(z.date()), 
  
  category: z.string().optional().default("General"),
  excerpt: z.string().min(10, "Please provide a short excerpt or summary"),
  
  // Content is handled/validated by the frontend TinyMCE logic before sending
  content: z.string().optional(),
  
  thumbnail: z.string().url("Invalid thumbnail URL").optional().or(z.literal("")),
  thumbnailPublicId: z.string().optional().or(z.literal("")),
  
  isPublished: z.boolean().optional().default(true),
});

// The `.partial()` trick for easy updates without requiring all fields
export const articleUpdateSchema = articleCreateSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided for update" }
);