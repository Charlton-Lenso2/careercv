import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { userIdOf } from "../utils/requestUser";
import { parseOrReject } from "../utils/validate";
import { idSchema } from "../validators/profile.validators";
import {
  createInSection,
  deleteInSection,
  sections,
  updateInSection,
} from "../services/sections.service";

// Mounted inside profile.routes.ts, which applies requireAuth first.
// userIdOf() throws if that ever stops being true.
const router = Router();

type Body = Record<string, unknown>;

for (const section of sections) {
  const base = `/${section.path}`;

  router.post(
    base,
    asyncHandler(async (req, res) => {
      const data = parseOrReject(section.createSchema, req.body, res) as Body | null;
      if (!data) return;

      const item = await createInSection(userIdOf(req), section, data);
      res.status(201).json({ success: true, item });
    })
  );

  router.put(
    `${base}/:id`,
    asyncHandler(async (req, res) => {
      const id = parseOrReject(idSchema, req.params.id, res);
      if (!id) return;

      const data = parseOrReject(section.updateSchema, req.body, res) as Body | null;
      if (!data) return;

      const item = await updateInSection(userIdOf(req), section, id, data);
      if (!item) {
        res.status(404).json({ success: false, message: `${section.label} not found.` });
        return;
      }

      res.json({ success: true, item });
    })
  );

  router.delete(
    `${base}/:id`,
    asyncHandler(async (req, res) => {
      const id = parseOrReject(idSchema, req.params.id, res);
      if (!id) return;

      const deleted = await deleteInSection(userIdOf(req), section, id);
      if (!deleted) {
        res.status(404).json({ success: false, message: `${section.label} not found.` });
        return;
      }

      res.json({ success: true });
    })
  );
}

export default router;