import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(100, "Email must not exceed 100 characters");

export const fullNameSchema = z
  .string()
  .min(1, "Full name is required")
  .min(3, "Full name must be at least 2 characters")
  .max(50, "Full name must not exceed 50 characters")
  .regex(
    /^[a-zA-Z\s'.-]+$/,
    "First name can only contain letters, spaces, apostrophes, dots, and hyphens"
  );

export const signUpSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  universityId: z
    .string()
    .min(1, "University ID is required")
    .max(50, "University ID must not exceed 50 characters")
    .regex(
      /^[A-Z0-9-_\/]+$/i,
      "University ID can only contain letters, numbers, hyphens, underscores, and slashes"
    ),
  universityCard: z.string().nonempty("University ID Card is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
});

export const signInSchema = z.object({
    email: emailSchema,
    password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
})
