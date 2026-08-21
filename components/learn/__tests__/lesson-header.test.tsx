import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonHeader } from "@/components/learn/lesson-header";

describe("<LessonHeader>", () => {
  it("renders eyebrow, title, and meta line", () => {
    const html = renderToStaticMarkup(
      <LessonHeader
        eyebrow="Module: Amazon basics"
        title="What is a seller account?"
        estimatedMinutes={3}
        position={2}
        totalLessons={7}
      />,
    );
    expect(html).toContain("Module: Amazon basics");
    expect(html).toContain("What is a seller account?");
    expect(html).toContain("Lesson 2 of 7");
    expect(html).toContain("about 3 min to read");
  });
});
