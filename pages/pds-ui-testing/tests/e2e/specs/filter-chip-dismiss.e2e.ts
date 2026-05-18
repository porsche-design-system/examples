import { expect, test } from "@playwright/test";

async function waitForPdsReady(page: import("@playwright/test").Page) {
  await page.waitForFunction(async () => {
    const hosts = Array.from(
      document.querySelectorAll("p-tag-dismissible"),
    ) as Array<HTMLElement & { componentOnReady?: () => Promise<void> }>;

    if (hosts.length === 0) return false;

    await Promise.all(
      hosts.map(async (host) => {
        await customElements.whenDefined("p-tag-dismissible");
        if (typeof host.componentOnReady === "function") {
          await host.componentOnReady();
        }
      }),
    );

    return true;
  });
}

test.describe("product catalog filters (static preview)", () => {
  test("removes ?audience=men when Men chip is clicked", async ({ page }) => {
    await page.goto("/en/products/?audience=men", {
      waitUntil: "networkidle",
    });
    await expect(page.getByTestId("main-content")).toBeVisible();

    const chip = page.getByRole("button", { name: /remove men filter/i });
    await expect(chip).toBeVisible({ timeout: 10000 });
    await waitForPdsReady(page);
    await chip.click();

    await expect(page).toHaveURL(/\/en\/products\/?$/);
    await expect(chip).toBeHidden();
  });

  test("removes ?favorites=1 when Favorites chip is clicked", async ({ page }) => {
    await page.goto("/en/products/?favorites=1", {
      waitUntil: "networkidle",
    });
    await expect(page.getByTestId("main-content")).toBeVisible();

    const chip = page.getByRole("button", {
      name: /show full catalog.*favorites/i,
    });
    await expect(chip).toBeVisible({ timeout: 10000 });
    await waitForPdsReady(page);
    await chip.click();

    await expect(page).toHaveURL(/\/en\/products\/?$/);
  });
});
