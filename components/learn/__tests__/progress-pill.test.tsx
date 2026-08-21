import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProgressPill } from "@/components/learn/progress-pill";

describe("<ProgressPill>", () => {
  it("renders the right copy for not_started", () => {
    const html = renderToStaticMarkup(<ProgressPill status="not_started" />);
    expect(html).toContain("Not started");
  });

  it("renders the right copy for in_progress", () => {
    const html = renderToStaticMarkup(<ProgressPill status="in_progress" />);
    expect(html).toContain("In progress");
  });

  it("renders the right copy for complete", () => {
    const html = renderToStaticMarkup(<ProgressPill status="complete" />);
    expect(html).toContain("Complete");
  });
});
