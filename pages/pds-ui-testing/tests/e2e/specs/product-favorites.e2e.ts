import { expect, test } from "@playwright/test";
import { waitForPdsHost, waitForPdsHosts } from "../utils/pds";

const PRODUCT_NAME = "Porsche Design Baseball Cap";
const PRODUCT_SLUG = "porsche-design-baseball-cap";
const PRODUCT_PATH = `/en/products/${PRODUCT_SLUG}/`;
const FAVORITES_STORAGE_KEY = "pds-ui-testing:product-favorite-slugs";

test.describe("product favorites (session, static preview)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCT_PATH, { waitUntil: "networkidle" });
    await page.evaluate((key) => sessionStorage.removeItem(key), FAVORITES_STORAGE_KEY);
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByTestId("main-content")).toBeVisible();
  });

  test("adds a favorite from the detail page and lists it on the favorites catalog view", async ({
    page,
  }) => {
    const addButton = page.getByRole("button", {
      name: /add to favorites/i,
    });
    await expect(addButton).toBeVisible();
    await waitForPdsHost(page, "p-button");
    await addButton.click();

    await expect(
      page.getByRole("button", { name: /remove from favorites/i }),
    ).toBeVisible();

    const favoritesLink = page.getByRole("link", {
      name: /favorites, 1 items saved/i,
    });
    await expect(favoritesLink).toBeVisible();
    await expect(
      page.getByTestId("global-header").getByText("1", { exact: true }),
    ).toBeVisible();

    await favoritesLink.click();
    await expect(page).toHaveURL(/\/en\/products\/\?favorites=1/);
    await expect(page.getByTestId("main-content")).toBeVisible();

    await waitForPdsHosts(page, "p-link-tile-product");
    await expect(
      page.getByRole("article", { name: PRODUCT_NAME }),
    ).toBeVisible();
  });

  test("removes a favorite and shows the empty favorites state", async ({
    page,
  }) => {
    const addButton = page.getByRole("button", {
      name: /add to favorites/i,
    });
    await waitForPdsHost(page, "p-button");
    await addButton.click();
    await expect(
      page.getByRole("button", { name: /remove from favorites/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /remove from favorites/i }).click();
    await expect(
      page.getByRole("button", { name: /add to favorites/i }),
    ).toBeVisible();

    await page.getByRole("link", {
      name: /favorites, no items saved yet/i,
    }).click();
    await expect(page).toHaveURL(/\/en\/products\/\?favorites=1/);

    await expect(page.getByText(/no favorites yet/i)).toBeVisible();
    await expect(
      page.getByText(/kept for this browser tab session only/i),
    ).toBeVisible();
  });
});
