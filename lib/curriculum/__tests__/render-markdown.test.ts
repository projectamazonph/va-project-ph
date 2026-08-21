import { describe, expect, it } from "vitest";
import { renderLessonBody } from "@/lib/curriculum/render-markdown";

describe("renderLessonBody", () => {
  it("converts headings, paragraphs, and lists to HTML", () => {
    const html = renderLessonBody({
      format: "mdx",
      raw: "## What is Amazon?\n\nAmazon is a store. Here is a list:\n\n- One\n- Two",
    });
    expect(html).toContain("<h2>What is Amazon?</h2>");
    expect(html).toContain("<p>Amazon is a store.");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>One</li>");
    expect(html).toContain("<li>Two</li>");
  });

  it("renders tables with header cells", () => {
    const html = renderLessonBody({
      format: "mdx",
      raw: "| Term | Plain meaning |\n|---|---|\n| ACOS | Ad cost of sales |\n",
    });
    expect(html).toContain("<table>");
    expect(html).toContain("<th>Term</th>");
    expect(html).toContain("<td>ACOS</td>");
  });

  it("renders inline emphasis", () => {
    const html = renderLessonBody({
      format: "mdx",
      raw: "This is **bold** and *italic* text.",
    });
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
  });

  it("renders fenced code blocks", () => {
    const html = renderLessonBody({
      format: "mdx",
      raw: "```\nplain text\n```",
    });
    expect(html).toContain("<pre>");
    expect(html).toContain("<code>");
  });
});
