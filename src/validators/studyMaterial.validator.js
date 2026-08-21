import { z } from "zod";

export const studyMaterialCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a short description"),
  
  dateOfPublishing: z.string().or(z.date()),
  category: z.string().optional().default("General"),
  
  // Cloudinary will return these when the PDF is uploaded
  pdfUrl: z.string().url("Invalid PDF URL"),
  pdfPublicId: z.string().min(1, "PDF Public ID is required"),
  
  isPublished: z.boolean().optional().default(true),
});

export const studyMaterialUpdateSchema = studyMaterialCreateSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided for update" }
);