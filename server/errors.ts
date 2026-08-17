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
