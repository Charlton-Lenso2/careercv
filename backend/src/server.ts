import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { Prisma } from "@prisma/client";
import { env } from "./config/env";
import healthRoutes from "./routes/health.routes";
import meRoutes from "./routes/me.routes";
import profileRoutes from "./routes/profile.routes";

const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: "100kb" }));

app.use("/api/health", healthRoutes);
app.use("/api/me", meRoutes);
app.use("/api/profile", profileRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Last line of defence: never leak stack traces or internal details.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ success: false, message: "Invalid JSON body." });
    return;
  }

  // P2002 = a unique rule was broken (e.g. the same skill added twice).
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    res.status(409).json({ success: false, message: "That item already exists." });
    return;
  }

  // Log only the error type: messages can contain user data (CV content).
  console.error("Unhandled error:", err instanceof Error ? err.name : "unknown");
  res
    .status(500)
    .json({ success: false, message: "Something went wrong on our side." });
});

app.listen(env.port, () => {
  console.log(`CareerCV API running on http://localhost:${env.port}`);
});