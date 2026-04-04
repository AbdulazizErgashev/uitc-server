import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid course ID"),
});

export const createCourseSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Course name must be at least 2 characters")
      .max(100),

    description: z.string().trim().max(1000).optional(),

    duration: z.string().optional(),
  })
  .strict();

export const updateCourseSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),

    description: z.string().trim().max(1000).optional(),

    duration: z.number().int().positive().optional(),
  })
  .strict();
