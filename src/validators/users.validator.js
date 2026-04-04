import { z } from "zod";

// ID param validation
export const idParamSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

// CREATE USER
export const createUserSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(3, { message: "Full name must be at least 3 characters" })
      .max(100, { message: "Full name must be less than 100 characters" }),

    phone: z
      .string()
      .trim()
      .min(7, { message: "Phone must be at least 7 characters" })
      .max(15, { message: "Phone must be less than 15 characters" }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .max(100),
  })
  .strict();

// UPDATE USER
export const updateUserSchema = z
  .object({
    full_name: z.string().trim().min(3).max(100).optional(),

    phone: z.string().trim().min(7).max(15).optional(),

    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .max(100)
      .optional(),
  })
  .strict();
