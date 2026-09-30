import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getHealth = (_req: Request, res: Response) => {
  res.json({
    success: true,
    status: "ok",
    service: "careercv-api",
    timestamp: new Date().toISOString(),
  });
};

export const getDbHealth = async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, database: "connected" });
  } catch (error) {
    console.error(
      "Database health check failed:",
      error instanceof Error ? error.message : "unknown error"
    );
    res
      .status(503)
      .json({ success: false, message: "Database connection failed." });
  }
};