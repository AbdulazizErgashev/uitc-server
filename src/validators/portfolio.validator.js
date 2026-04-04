import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const createPortfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["web", "mobile", "app", "three_d_modeling", "three_d_animation", "two_d_design", "other"]),
  platform: z.string().optional(),
  url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  is_public: z.boolean().optional(),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();
