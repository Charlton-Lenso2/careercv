import { z } from "zod";

const shortText = z.string().trim().min(1).max(200);
const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date")
  .transform((value) => new Date(value));

const webUrl = z
  .string()
  .trim()
  .max(500)
  .url("Must be a valid URL")
  .refine((value) => /^https?:\/\//i.test(value), "Must start with http:// or https://");

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

export const educationSchema = z
  .object({
    institution: shortText,
    qualification: shortText,
    fieldOfStudy: optionalText(200),
    startDate: dateString.nullable().optional(),
    endDate: dateString.nullable().optional(),
    description: optionalText(2000),
    sortOrder: z.number().int().min(0).max(1000).optional(),
  })
  .strict();

export const educationUpdateSchema = educationSchema.partial();

export const skillSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    category: optionalText(100),
  })
  .strict();

export const skillUpdateSchema = skillSchema.partial();

export const projectSchema = z
  .object({
    name: shortText,
    description: optionalText(2000),
    url: webUrl.nullable().optional(),
    technologies: z.array(z.string().trim().min(1).max(100)).max(30).optional(),
    startDate: dateString.nullable().optional(),
    endDate: dateString.nullable().optional(),
    sortOrder: z.number().int().min(0).max(1000).optional(),
  })
  .strict();

export const projectUpdateSchema = projectSchema.partial();

export const certificationSchema = z
  .object({
    name: shortText,
    issuer: optionalText(200),
    issueDate: dateString.nullable().optional(),
    expiryDate: dateString.nullable().optional(),
    credentialUrl: webUrl.nullable().optional(),
  })
  .strict();

export const certificationUpdateSchema = certificationSchema.partial();

export const achievementSchema = z
  .object({
    title: shortText,
    description: optionalText(2000),
    date: dateString.nullable().optional(),
  })
  .strict();

export const achievementUpdateSchema = achievementSchema.partial();