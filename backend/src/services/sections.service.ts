import { z } from "zod";
import { prisma } from "../config/prisma";
import * as v from "../validators/profile.validators";
import { profileIdFor } from "./profile.service";

// The minimal shape every section's Prisma delegate has in common.
type Delegate = {
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
  findFirst(args: { where: Record<string, unknown> }): Promise<unknown>;
  updateMany(args: {
    where: Record<string, unknown>;
    data: Record<string, unknown>;
  }): Promise<{ count: number }>;
  deleteMany(args: { where: Record<string, unknown> }): Promise<{ count: number }>;
};

export type SectionConfig = {
  path: string;
  label: string;
  delegate: Delegate;
  createSchema: z.ZodTypeAny;
  updateSchema: z.ZodTypeAny;
};

// Each Prisma model has its own type, so we cast once per section.
export const sections: SectionConfig[] = [
  {
    path: "educations",
    label: "Education",
    delegate: prisma.education as unknown as Delegate,
    createSchema: v.educationSchema,
    updateSchema: v.educationUpdateSchema,
  },
  {
    path: "skills",
    label: "Skill",
    delegate: prisma.skill as unknown as Delegate,
    createSchema: v.skillSchema,
    updateSchema: v.skillUpdateSchema,
  },
  {
    path: "projects",
    label: "Project",
    delegate: prisma.project as unknown as Delegate,
    createSchema: v.projectSchema,
    updateSchema: v.projectUpdateSchema,
  },
  {
    path: "certifications",
    label: "Certification",
    delegate: prisma.certification as unknown as Delegate,
    createSchema: v.certificationSchema,
    updateSchema: v.certificationUpdateSchema,
  },
  {
    path: "achievements",
    label: "Achievement",
    delegate: prisma.achievement as unknown as Delegate,
    createSchema: v.achievementSchema,
    updateSchema: v.achievementUpdateSchema,
  },
];

export async function createInSection(
  userId: string,
  section: SectionConfig,
  data: Record<string, unknown>
) {
  const profileId = await profileIdFor(userId);
  // profileId comes last, so it always wins over anything in `data`.
  return section.delegate.create({ data: { ...data, profileId } });
}

// The ownership check: the row only matches if its profile belongs to this user.
export async function updateInSection(
  userId: string,
  section: SectionConfig,
  id: string,
  data: Record<string, unknown>
) {
  const where = { id, profile: { userId } };
  const result = await section.delegate.updateMany({ where, data });

  if (result.count === 0) return null;
  return section.delegate.findFirst({ where });
}

export async function deleteInSection(
  userId: string,
  section: SectionConfig,
  id: string
): Promise<boolean> {
  const result = await section.delegate.deleteMany({
    where: { id, profile: { userId } },
  });
  return result.count > 0;
}