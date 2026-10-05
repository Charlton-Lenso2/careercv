import { apiFetch } from "./api";

export type Item = { id: string } & Record<string, unknown>;

export type Profile = {
  id: string;
  fullName: string | null;
  headline: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  summary: string | null;
  experiences: Item[];
  educations: Item[];
  skills: Item[];
  projects: Item[];
  certifications: Item[];
  achievements: Item[];
};

export function itemsOf(profile: Profile, sectionKey: string): Item[] {
  const value = (profile as unknown as Record<string, unknown>)[sectionKey];
  return Array.isArray(value) ? (value as Item[]) : [];
}

export async function getProfile(): Promise<Profile> {
  const res = await apiFetch<{ success: boolean; profile: Profile }>("/api/profile");
  return res.profile;
}

export function updateProfile(data: Record<string, unknown>) {
  return apiFetch("/api/profile", { method: "PUT", body: JSON.stringify(data) });
}

export function createItem(sectionKey: string, data: Record<string, unknown>) {
  return apiFetch(`/api/profile/${sectionKey}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateItem(
  sectionKey: string,
  id: string,
  data: Record<string, unknown>
) {
  return apiFetch(`/api/profile/${sectionKey}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteItem(sectionKey: string, id: string) {
  return apiFetch(`/api/profile/${sectionKey}/${id}`, { method: "DELETE" });
}