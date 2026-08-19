export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    public readonly safeMessage: string,
  ) {
    super(code);
    this.name = "AppError";
  }
}

export class CurriculumError extends AppError {
  constructor(
    code: "COURSE_NOT_FOUND" | "MODULE_NOT_FOUND" | "LESSON_NOT_FOUND" | "PROGRESS_FORBIDDEN",
    safeMessage: string,
  ) {
    super(code, code === "PROGRESS_FORBIDDEN" ? 403 : 404, safeMessage);
    this.name = "CurriculumError";
  }
}
