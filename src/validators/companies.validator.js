import { z } from "zod";

// PARAM VALIDATION
export const idParamSchema = z.object({
  id: z.string().uuid("Invalid company ID"),
});

// CREATE COMPANY
export const createCompanySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),

    color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color")
      .optional(),

    logo_url: z.string().url("Invalid logo URL").optional(),

    website: z.string().url("Invalid website URL").optional(),

    description: z.string().trim().max(1000).optional(),
  })
  .strict();

// UPDATE COMPANY
export const updateCompanySchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),

    color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color")
      .optional(),

    logo_url: z.string().url().optional(),

    website: z.string().url().optional(),

    description: z.string().trim().max(1000).optional(),
  })
  .strict();
