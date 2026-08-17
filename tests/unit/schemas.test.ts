import { describe, expect, it } from "vitest";
import { PageQuerySchema } from "@/lib/schemas/api";

describe("PageQuerySchema", () => {
  it("coerces safe query defaults", () => {
    expect(PageQuerySchema.parse({})).toEqual({ page: 1, pageSize: 20 });
    expect(PageQuerySchema.parse({ page: "2", pageSize: "50", q: "bids" })).toEqual({
      page: 2,
      pageSize: 50,
      q: "bids",
    });
  });

  it("rejects unsafe page sizes", () => {
    expect(() => PageQuerySchema.parse({ pageSize: 101 })).toThrow();
  });
});
