import { ReportMetricsInputSchema, type ReportMetricsInput } from "@/lib/schemas/report-metrics";

export type ReportMetrics = {
  acosPct: number | null;
  roas: number;
  cpc: number;
  ctrPct: number;
  cvrPct: number;
  breakEvenPct: number;
};

export function calculateReportMetrics(input: ReportMetricsInput): ReportMetrics {
  const { spend, sales, clicks, impressions, orders, marginPct } = ReportMetricsInputSchema.parse(input);

  return {
    acosPct: sales > 0 ? (spend / sales) * 100 : null,
    roas: spend > 0 ? sales / spend : 0,
    cpc: clicks > 0 ? spend / clicks : 0,
    ctrPct: impressions > 0 ? (clicks / impressions) * 100 : 0,
    cvrPct: clicks > 0 ? (orders / clicks) * 100 : 0,
    breakEvenPct: marginPct,
  };
}
