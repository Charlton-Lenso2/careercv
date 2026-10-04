import { z } from "zod";
import { prisma } from "../config/prisma";
import {
  experienceSchema,
  experienceUpdateSchema,
  profileSchema,
} from "../validators/profile.validators";

type ProfileInput = z.infer<typeof profileSchema>;
type ExperienceInput = z.infer<typeof experienceSchema>;
type ExperienceUpdateInput = z.infer<typeof experienceUpdateSchema>;

// Every user has exactly one profile. Create it on first use.
export function getOrCreateProfile(userId: string) {
  return prisma.careerProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      experiences: { orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }] },
      educations: { orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }] },
      skills: { orderBy: { name: "asc" } },
      projects: { orderBy: { sortOrder: "asc" } },
      certifications: { orderBy: { issueDate: "desc" } },
      achievements: { orderBy: { date: "desc" } },
    },
  });
}

export function updateProfile(userId: string, data: ProfileInput) {
  return prisma.careerProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}

export async function profileIdFor(userId: string): Promise<string> {
  const profile = await prisma.careerProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: { id: true },
  });
  return profile.id;
}

export async function createExperience(userId: string, data: ExperienceInput) {
  const profileId = await profileIdFor(userId);
  return prisma.experience.create({ data: { ...data, profileId } });
}

// `where: { id, profile: { userId } }` is the ownership check: the row is only
// matched if its profile belongs to this user. Someone else's row -> count 0.
export async function updateExperience(
  userId: string,
  id: string,
  data: ExperienceUpdateInput
) {
  const result = await prisma.experience.updateMany({
    where: { id, profile: { userId } },
    data,
  });

  if (result.count === 0) return null;

  return prisma.experience.findFirst({ where: { id, profile: { userId } } });
}

export async function deleteExperience(userId: string, id: string): Promise<boolean> {
  const result = await prisma.experience.deleteMany({
    where: { id, profile: { userId } },
  });
  return result.count > 0;
}