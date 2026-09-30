import { Response } from "express";
import { z } from "zod";

// Returns the validated data, or sends a 400 and returns null.
export function parseOrReject<T extends z.ZodTypeAny>(
  schema: T,
  input: unknown,
  res: Response
): z.infer<T> | null {
  const result = schema.safeParse(input);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid input.",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return null;
  }

  return result.data;
}