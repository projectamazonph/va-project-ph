import { z } from "zod";

export const ReportMetricsInputSchema = z
  .object({
    spend: z.number().finite().min(0),
    sales: z.number().finite().min(0),
    clicks: z.number().int().min(0),
    impressions: z.number().int().min(0),
    orders: z.number().int().min(0),
    marginPct: z.number().finite().min(0).max(95),
  })
  .superRefine((input, context) => {
    if (input.clicks > input.impressions) {
      context.addIssue({
        code: "custom",
        path: ["clicks"],
        message: "Clicks cannot exceed impressions.",
      });
    }

    if (input.orders > input.clicks) {
      context.addIssue({
        code: "custom",
        path: ["orders"],
        message: "Orders cannot exceed clicks.",
      });
    }
  });

export type ReportMetricsInput = z.infer<typeof ReportMetricsInputSchema>;
