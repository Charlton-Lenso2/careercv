import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabase";

export type AuthedUser = { id: string; email: string | undefined };

declare global {
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res
        .status(401)
        .json({ success: false, message: "Invalid or expired session." });
      return;
    }

    req.user = { id: data.user.id, email: data.user.email };
    next();
  } catch {
    res
      .status(503)
      .json({ success: false, message: "Could not verify your session." });
  }
}