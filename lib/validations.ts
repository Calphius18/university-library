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

export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  author: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  rating: z.number().min(1).max(5),
  totalCopies: z.coerce.number().int().positive().lte(10000),
  coverUrl: z.string().nonempty(),
  coverColor: z.string().trim().regex(/^#[0-9A-F]{6}$/i),
  videoUrl: z.string().nonempty(),
  summary: z.string().trim().min(10)
})