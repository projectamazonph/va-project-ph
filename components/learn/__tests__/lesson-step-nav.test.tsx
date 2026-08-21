import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonStepNav } from "@/components/learn/lesson-step-nav";

describe("<LessonStepNav>", () => {
  it("shows prev and next links when both are present", () => {
    const html = renderToStaticMarkup(
      <LessonStepNav moduleSlug="module-0" prevSlug="lesson-1" nextSlug="lesson-3" />,
    );
    expect(html).toContain("Previous lesson");
    expect(html).toContain("Next lesson");
    expect(html).toContain("/learn/module-0/lesson-1");
    expect(html).toContain("/learn/module-0/lesson-3");
  });

  it("renders 'First lesson' placeholder when there is no previous", () => {
    const html = renderToStaticMarkup(
      <LessonStepNav moduleSlug="module-0" prevSlug={null} nextSlug="lesson-2" />,
    );
    expect(html).toContain("First lesson");
    expect(html).not.toContain("Previous lesson");
  });

  it("renders 'Last lesson' placeholder when there is no next", () => {
    const html = renderToStaticMarkup(
      <LessonStepNav moduleSlug="module-0" prevSlug="lesson-6" nextSlug={null} />,
    );
    expect(html).toContain("Last lesson");
    expect(html).not.toContain("Next lesson");
  });
});
