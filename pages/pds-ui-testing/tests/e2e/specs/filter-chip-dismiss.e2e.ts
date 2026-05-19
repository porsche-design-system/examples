import { expect, test } from "@playwright/test";
import { waitForPdsHosts } from "../utils/pds";

/** Waits until URL-driven filter chips are in the DOM (static export hydrates params on mount). */
async function waitForFilterChips(page: import("@playwright/test").Page) {
  await page.waitForFunction(
    () => document.querySelectorAll("p-tag-dismissible").length > 0,
    undefined,
    { timeout: 10000 },
  );
  await waitForPdsHosts(page, "p-tag-dismissible");
}

test.describe("product catalog filters (static preview)", () => {
  test("removes ?audience=men when Men chip is clicked", async ({ page }) => {
    await page.goto("/en/products/?audience=men", {
      waitUntil: "networkidle",
    });
    await expect(page.getByTestId("main-content")).toBeVisible();
    await waitForFilterChips(page);

    // PDS v4: explicit aria-label, or default "Remove:" + visible label ("Men").
    const chip = page.getByRole("button", { name: /remove.*men/i });
    await expect(chip).toBeVisible();
    await chip.click();

    await expect(page).toHaveURL(/\/en\/products\/?$/);
    await expect(chip).toBeHidden();
  });

  test("removes ?favorites=1 when Favorites chip is clicked", async ({ page }) => {
    await page.goto("/en/products/?favorites=1", {
      waitUntil: "networkidle",
    });
    await expect(page.getByTestId("main-content")).toBeVisible();
    await waitForFilterChips(page);

    const chip = page.getByRole("button", {
      name: /show full catalog.*favorites/i,
    });
    await expect(chip).toBeVisible();
    await chip.click();

    await expect(page).toHaveURL(/\/en\/products\/?$/);
  });
});
