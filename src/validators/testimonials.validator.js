import { z } from "zod";

export const createTestimonialSchema = z.object({
  course_id: z.string().uuid("Invalid course ID"),
  company_id: z.string().uuid("Invalid company ID").optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().optional(),
  quote: z.string().min(5, "Quote must be at least 5 characters"),
  long_quote: z.string().optional(),
  rating: z.number().min(0).max(5),
  video_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

export const updateTestimonialSchema = z.object({
  course_id: z.string().uuid().optional(),
  company_id: z.string().uuid().optional(),
  name: z.string().min(2).optional(),
  role: z.string().optional(),
  quote: z.string().min(5).optional(),
  long_quote: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  video_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

export const addCommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty"),
});
