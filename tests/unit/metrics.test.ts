import { describe, expect, it } from "vitest";
import { calculateReportMetrics } from "@/lib/metrics";

describe("calculateReportMetrics", () => {
  it("calculates the teaching metrics from one source of truth", () => {
    expect(
      calculateReportMetrics({
        spend: 100,
        sales: 400,
        clicks: 50,
        impressions: 1000,
        orders: 5,
        marginPct: 25,
      }),
    ).toEqual({
      acosPct: 25,
      roas: 4,
      cpc: 2,
      ctrPct: 5,
      cvrPct: 10,
      breakEvenPct: 25,
    });
  });

  it("handles zero denominators without producing invalid numbers", () => {
    expect(
      calculateReportMetrics({
        spend: 0,
        sales: 0,
        clicks: 0,
        impressions: 0,
        orders: 0,
        marginPct: 30,
      }),
    ).toEqual({
      acosPct: null,
      roas: 0,
      cpc: 0,
      ctrPct: 0,
      cvrPct: 0,
      breakEvenPct: 30,
    });
  });
});
