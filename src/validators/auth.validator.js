import { z } from "zod";

// Admin register
export const adminRegisterSchema = z
  .object({
    full_name: z.string().min(2, "Full name too short"),
    phone: z.string().regex(/^\+?\d{9,15}$/, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Confirm password required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// Admin login
export const adminLoginSchema = z.object({
  phone: z.string().regex(/^\+?\d{9,15}$/, "Invalid phone number"),
  password: z.string().min(6, "Password required"),
});

// Admin update (phone & password only)
export const adminUpdateSchema = z
  .object({
    phone: z
      .string()
      .regex(/^\+?\d{9,15}$/, "Invalid phone number")
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirm_password: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirm_password)
        return data.password === data.confirm_password;
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    },
  );
