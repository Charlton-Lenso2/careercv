import { z } from "zod";

const shortText = z.string().trim().min(1).max(200);
const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date")
  .transform((value) => new Date(value));

export const idSchema = z.string().uuid("Invalid id");

export const profileSchema = z
  .object({
    fullName: optionalText(200),
    headline: optionalText(200),
    email: z.string().trim().email().max(200).nullable().optional(),
    phone: optionalText(50),
    location: optionalText(200),
    summary: optionalText(3000),
  })
  .strict();

export const experienceSchema = z
  .object({
    jobTitle: shortText,
    company: shortText,
    location: optionalText(200),
    startDate: dateString.nullable().optional(),
    endDate: dateString.nullable().optional(),
    isCurrent: z.boolean().optional(),
    description: optionalText(2000),
    bullets: z.array(z.string().trim().min(1).max(500)).max(20).optional(),
    sortOrder: z.number().int().min(0).max(1000).optional(),
  })
  .strict();

export const experienceUpdateSchema = experienceSchema.partial();