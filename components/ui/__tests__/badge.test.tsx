import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Badge } from "@/components/ui/badge";

describe("<Badge>", () => {
  it("renders its children", () => {
    const html = renderToStaticMarkup(<Badge tone="success">Complete</Badge>);
    expect(html).toContain("Complete");
  });

  it("uses the chosen tone's text color class", () => {
    const successHtml = renderToStaticMarkup(<Badge tone="success">x</Badge>);
    const mutedHtml = renderToStaticMarkup(<Badge tone="muted">x</Badge>);
    expect(successHtml).not.toBe(mutedHtml);
    expect(successHtml).toContain("text-blue-700");
  });
});
