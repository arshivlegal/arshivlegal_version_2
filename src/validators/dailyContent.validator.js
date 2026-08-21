import { z } from "zod";

export const dailyContentCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  
  platform: z.enum(["Instagram", "YouTube", "LinkedIn", "Twitter", "Website"], {
    errorMap: () => ({ message: "Please select a valid platform" })
  }),
  
  description: z.string().min(5, "Please provide a short description"),
  
  externalLink: z.string().url("Please provide a valid URL (include https://)"),
  
  thumbnail: z.string().url("Invalid thumbnail URL").optional().or(z.literal("")),
  thumbnailPublicId: z.string().optional().or(z.literal("")),
  
  isPublished: z.boolean().optional().default(true),
});

export const dailyContentUpdateSchema = dailyContentCreateSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided for update" }
);