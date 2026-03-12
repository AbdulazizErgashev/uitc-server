import { z } from "zod";

// PARAM VALIDATION
export const idParamSchema = z.object({
  id: z.string().uuid("Invalid testimonial ID"),
});

// CREATE TESTIMONIAL
export const createTestimonialSchema = z
  .object({
    course_id: z.string().uuid("Invalid course ID"),

    company_id: z.string().uuid("Invalid company ID").optional(),

    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100),

    role: z.string().trim().max(100).optional(),

    quote: z
      .string()
      .trim()
      .min(5, "Quote must be at least 5 characters")
      .max(500),

    long_quote: z.string().trim().max(2000).optional(),

    rating: z.number().int("Rating must be integer").min(0).max(5),

    video_url: z.string().url("Invalid video URL").optional(),

    tags: z.array(z.string().trim()).max(10).optional(),

    featured: z.boolean().optional(),
  })
  .strict();

// UPDATE TESTIMONIAL
export const updateTestimonialSchema = z
  .object({
    course_id: z.string().uuid().optional(),

    company_id: z.string().uuid().optional(),

    name: z.string().trim().min(2).max(100).optional(),

    role: z.string().trim().max(100).optional(),

    quote: z.string().trim().min(5).max(500).optional(),

    long_quote: z.string().trim().max(2000).optional(),

    rating: z.number().int().min(0).max(5).optional(),

    video_url: z.string().url().optional(),

    tags: z.array(z.string().trim()).max(10).optional(),

    featured: z.boolean().optional(),
  })
  .strict();

// ADD COMMENT
export const addCommentSchema = z
  .object({
    text: z.string().trim().min(1, "Comment cannot be empty").max(500),
  })
  .strict();
