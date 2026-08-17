import { expect, test } from "@playwright/test";

test("home page offers a clear path into the learning hub", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /zero experience in/i })).toBeVisible();
  await page.getByRole("link", { name: "Start learning" }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole("heading", { name: /good to see you/i })).toBeVisible();
});
