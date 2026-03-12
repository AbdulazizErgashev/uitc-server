// import { z } from "zod";

// // ID param validation
// export const idParamSchema = z.object({
//   id: z.string().uuid("Invalid user ID"),
// });

// // CREATE USER
// export const createUserSchema = z
//   .object({
//     full_name: z
//       .string()
//       .trim()
//       .min(3, { message: "Full name must be at least 3 characters" })
//       .max(100, { message: "Full name must be less than 100 characters" }),

//     email: z
//       .string()
//       .trim()
//       .toLowerCase()
//       .email({ message: "Invalid email format" }),

//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//       .regex(/[0-9]/, "Password must contain at least one number")
//       .max(100),

//     role: z.enum(["admin", "teacher", "student"]).default("student"),
//   })
//   .strict();

// // UPDATE USER
// export const updateUserSchema = z
//   .object({
//     full_name: z.string().trim().min(3).max(100).optional(),

//     email: z.string().trim().toLowerCase().email().optional(),

//     password: z
//       .string()
//       .min(8)
//       .regex(/[A-Z]/)
//       .regex(/[0-9]/)
//       .max(100)
//       .optional(),

//     role: z.enum(["admin", "teacher", "student"]).optional(),
//   })
//   .strict();
