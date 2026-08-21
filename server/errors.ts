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

export type CurriculumErrorCode =
  | "COURSE_NOT_FOUND"
  | "MODULE_NOT_FOUND"
  | "LESSON_NOT_FOUND"
  | "PROGRESS_FORBIDDEN"
  | "INVALID_INPUT";

export class CurriculumError extends AppError {
  constructor(code: CurriculumErrorCode, safeMessage: string) {
    const status =
      code === "PROGRESS_FORBIDDEN"
        ? 403
        : code === "INVALID_INPUT"
          ? 400
          : 404;
    super(code, status, safeMessage);
    this.name = "CurriculumError";
  }
}
