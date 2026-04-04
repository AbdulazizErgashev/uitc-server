import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid team member ID"),
});

export const createTeamMemberSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    role: z.string().trim().min(2, "Role must be at least 2 characters"),
    bio: z.string().trim().optional(),
    long_bio: z.string().trim().optional(),
    linkedin: z.string().url("LinkedIn must be a valid URL").optional(),
    twitter: z.string().url("Twitter must be a valid URL").optional(),
    github: z.string().url("Github must be a valid URL").optional(),
    email: z.string().email("Email must be valid").optional(),
    expertise: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
    etag: z.string().optional(),
  })
  .strict();

export const updateTeamMemberSchema = z
  .object({
    name: z.string().trim().min(2).optional(),
    role: z.string().trim().min(2).optional(),
    bio: z.string().trim().optional(),
    long_bio: z.string().trim().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
    email: z.string().email().optional(),
    expertise: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
  })
  .strict();
