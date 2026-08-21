import { expect, test } from "@playwright/test";

test("the learning hub links into Module 0", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: /good to see you/i })).toBeVisible();
  await page.getByRole("link", { name: /start module 0/i }).click();
  await expect(page).toHaveURL(/\/learn\/module-0/);
});

test("a lesson page renders a header and the mark-read form", async ({ page }) => {
  // PREVIEW_MODE bypasses auth and the unconfigured-Supabase branch returns
  // the empty-state copy. The header and form are still part of the
  // auth-gated layout, so the auth-redirect must not fire here.
  await page.goto("/learn/module-0/lesson-1-what-is-amazon");
  // Lesson page in unconfigured mode shows the "No content available" hero.
  await expect(page.getByRole("heading", { name: /no content available/i })).toBeVisible();
  // The lesson detail page is the auth-gated layout; visiting it must not
  // bounce the visitor to /login.
  await expect(page).toHaveURL(/lesson-1-what-is-amazon/);
});
