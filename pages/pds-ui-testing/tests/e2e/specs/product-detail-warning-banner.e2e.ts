import { expect, test } from "@playwright/test";
import { waitForPdsHost } from "../utils/pds";

const PRODUCT_PATH = "/en/products/porsche-design-baseball-cap/";

test.describe("product detail Prop 65 warning banner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCT_PATH, { waitUntil: "networkidle" });
    await expect(page.getByTestId("main-content")).toBeVisible();
  });

  test("shows a dismissible warning banner on load", async ({ page }) => {
    await waitForPdsHost(page, "p-banner");

    await expect(
      page.getByRole("heading", {
        name: /california proposition 65 warning/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/expose you to chemicals known to the state of california/i),
    ).toBeVisible();

    const dismissButton = page.getByRole("button", { name: /close banner/i });
    await expect(dismissButton).toBeVisible();
    await dismissButton.click();

    await expect(
      page.getByRole("heading", {
        name: /california proposition 65 warning/i,
      }),
    ).toBeHidden();
  });
});
