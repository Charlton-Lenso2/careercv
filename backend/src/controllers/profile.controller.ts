import { asyncHandler } from "../utils/asyncHandler";
import { userIdOf } from "../utils/requestUser";
import { parseOrReject } from "../utils/validate";
import {
  experienceSchema,
  experienceUpdateSchema,
  idSchema,
  profileSchema,
} from "../validators/profile.validators";
import * as profileService from "../services/profile.service";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getOrCreateProfile(userIdOf(req));
  res.json({ success: true, profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = parseOrReject(profileSchema, req.body, res);
  if (!data) return;

  const profile = await profileService.updateProfile(userIdOf(req), data);
  res.json({ success: true, profile });
});

export const createExperience = asyncHandler(async (req, res) => {
  const data = parseOrReject(experienceSchema, req.body, res);
  if (!data) return;

  const experience = await profileService.createExperience(userIdOf(req), data);
  res.status(201).json({ success: true, experience });
});

export const updateExperience = asyncHandler(async (req, res) => {
  const id = parseOrReject(idSchema, req.params.id, res);
  if (!id) return;

  const data = parseOrReject(experienceUpdateSchema, req.body, res);
  if (!data) return;

  const experience = await profileService.updateExperience(userIdOf(req), id, data);
  if (!experience) {
    res.status(404).json({ success: false, message: "Experience not found." });
    return;
  }

  res.json({ success: true, experience });
});

export const deleteExperience = asyncHandler(async (req, res) => {
  const id = parseOrReject(idSchema, req.params.id, res);
  if (!id) return;

  const deleted = await profileService.deleteExperience(userIdOf(req), id);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Experience not found." });
    return;
  }

  res.json({ success: true });
});