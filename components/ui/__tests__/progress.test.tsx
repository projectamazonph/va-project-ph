import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProgressBar } from "@/components/ui/progress";

describe("<ProgressBar>", () => {
  it("renders nothing when total is 0", () => {
    const html = renderToStaticMarkup(<ProgressBar total={0} complete={0} />);
    expect(html).toBe("");
  });

  it("clamps complete to total", () => {
    const html = renderToStaticMarkup(<ProgressBar total={4} complete={9} />);
    expect(html).toContain('aria-valuenow="100"');
    expect(html).toContain('aria-valuemax="100"');
  });

  it("reports partial completion", () => {
    const html = renderToStaticMarkup(<ProgressBar total={4} complete={1} />);
    expect(html).toContain('aria-valuenow="25"');
    expect(html).toContain("1 of 4 lessons complete");
  });
});
