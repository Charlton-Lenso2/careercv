import { supabase } from "../lib/supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type FetchOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const detail =
        Array.isArray(body?.errors) && body.errors.length > 0
          ? `${body.errors[0].field}: ${body.errors[0].message}`
          : null;
      throw new ApiError(detail ?? body?.message ?? "Request failed.", res.status);
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Could not reach the server.", 0);
  } finally {
    clearTimeout(timer);
  }
}