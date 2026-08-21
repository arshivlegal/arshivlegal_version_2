import { z } from "zod";

export const caseStudyCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  court: z.string().min(2, "Court name is required"),
  
  // The frontend date picker usually sends dates as ISO strings
  dateOfJudgment: z.string().or(z.date()), 
  
  overview: z.string().optional().default(""),
  category: z.string().optional().default("General"),
  
  // Manual editor sends HTML string
  content: z.string().optional(),
  keyTakeaway: z.string().optional().default(""),
  
  heroImage: z.string().url("Invalid hero image URL").optional().or(z.literal("")),
  heroImagePublicId: z.string().optional().or(z.literal("")),
  
  isPublished: z.boolean().optional().default(true),
});

export const caseStudyUpdateSchema = caseStudyCreateSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided for update" }
);