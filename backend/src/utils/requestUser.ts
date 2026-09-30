import { Request } from "express";

// Returns the verified user's id. Throws if requireAuth was forgotten on
// the route, so a missing auth check fails loudly instead of silently.
export function userIdOf(req: Request): string {
  if (!req.user) {
    throw new Error("requireAuth middleware is missing on this route");
  }
  return req.user.id;
}