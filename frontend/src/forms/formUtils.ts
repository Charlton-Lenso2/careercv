import { FieldConfig } from "../config/sections";

export type FormValues = Record<string, string | boolean>;

export type BuildResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;
const URL_RE = /^https?:\/\/\S+$/i;

export function initialValues(
  fields: FieldConfig[],
  source?: Record<string, unknown>
): FormValues {
  const values: FormValues = {};

  for (const field of fields) {
    const raw = source?.[field.key];

    if (field.type === "boolean") {
      values[field.key] = Boolean(raw);
    } else if (field.type === "list") {
      values[field.key] = Array.isArray(raw) ? raw.join("\n") : "";
    } else if (field.type === "date") {
      values[field.key] = typeof raw === "string" ? raw.slice(0, 10) : "";
    } else {
      values[field.key] = typeof raw === "string" ? raw : "";
    }
  }

  return values;
}

export function buildPayload(fields: FieldConfig[], values: FormValues): BuildResult {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "boolean") {
      payload[field.key] = Boolean(values[field.key]);
      continue;
    }

    const text = String(values[field.key] ?? "").trim();

    if (field.type === "list") {
      payload[field.key] = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      continue;
    }

    if (!text) {
      if (field.required) {
        return { ok: false, error: `${field.label} is required.` };
      }
      payload[field.key] = null;
      continue;
    }

    if (field.type === "date" && !DATE_RE.test(text)) {
      return { ok: false, error: `${field.label} must look like 2024-01-31.` };
    }
    if (field.type === "email" && !EMAIL_RE.test(text)) {
      return { ok: false, error: `${field.label} is not a valid email address.` };
    }
    if (field.type === "url" && !URL_RE.test(text)) {
      return { ok: false, error: `${field.label} must start with http:// or https://` };
    }

    payload[field.key] = text;
  }

  return { ok: true, payload };
}