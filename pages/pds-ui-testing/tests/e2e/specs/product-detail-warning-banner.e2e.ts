import { expect, test } from "@playwright/test";
import { waitForPdsHost } from "../utils/pds";

const PRODUCT_PATH = "/en/products/porsche-design-baseball-cap/";

test.describe("product detail out of stock banner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCT_PATH, { waitUntil: "networkidle" });
    await expect(page.getByTestId("main-content")).toBeVisible();
  });

  test("shows a dismissible info banner on load", async ({ page }) => {
    await waitForPdsHost(page, "p-banner");

    await expect(
      page.getByRole("heading", {
        name: /Limited availability/i,
      }),
    ).toBeVisible();

    const dismissButton = page.getByRole("button", { name: /close banner/i });
    await expect(dismissButton).toBeVisible();
    await dismissButton.click();

    await expect(
      page.getByRole("heading", {
        name: /Limited availability/i,
      }),
    ).toBeHidden();
  });
});
