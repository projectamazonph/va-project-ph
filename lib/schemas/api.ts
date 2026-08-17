import { z } from "zod";

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.string()).optional(),
});

export const ApiErrorEnvelope = z.object({
  ok: z.literal(false),
  error: ApiErrorSchema,
});

export const PageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().max(80).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type PageQuery = z.infer<typeof PageQuerySchema>;

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError & { fieldErrors?: Record<string, string[]> } };
