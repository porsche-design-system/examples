import { expect, test } from "@playwright/test";
import { waitForPdsHost } from "../utils/pds";

async function typeInSearchModal(page: import("@playwright/test").Page, query: string) {
  const searchbox = page.getByRole("searchbox", { name: /search items/i });
  await expect(searchbox).toBeVisible();
  await searchbox.fill(query);
}

const PRODUCT_NAME = "Porsche Design Baseball Cap";
const PRODUCT_SLUG = "porsche-design-baseball-cap";

function searchDialog(page: import("@playwright/test").Page) {
  return page.getByRole("dialog", { name: /search products/i });
}

test.describe("header product search modal (static preview)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/products/", { waitUntil: "networkidle" });
    await expect(page.getByTestId("global-header")).toBeVisible();
    await expect(page.getByTestId("main-content")).toBeVisible();
  });

  test("opens the modal and shows the empty prompt before typing", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /^search$/i }).click();

    const dialog = searchDialog(page);
    await expect(dialog).toBeVisible();
    await waitForPdsHost(page, 'p-input-search[name="global-header-product-search"]');

    await expect(page.getByText(/loading catalog/i)).toBeHidden({
      timeout: 15_000,
    });
    await expect(
      page.getByText(/start typing to see ranked suggestions/i),
    ).toBeVisible();
  });

  test("finds products and navigates to the detail page", async ({ page }) => {
    await page.getByRole("button", { name: /^search$/i }).click();
    await expect(searchDialog(page)).toBeVisible();

    await typeInSearchModal(page, "cap");
    await expect(page.getByText(/loading catalog/i)).toBeHidden({
      timeout: 15_000,
    });

    const resultLink = page.getByRole("link", {
      name: /Porsche Design Baseball Cap.*everyday city looks/i,
    });
    await expect(resultLink.first()).toBeVisible({ timeout: 15_000 });
    await resultLink.first().click();

    await expect(page).toHaveURL(new RegExp(`/en/products/${PRODUCT_SLUG}/?$`));
    await expect(
      page.getByRole("heading", { level: 1, name: PRODUCT_NAME }),
    ).toBeVisible();
  });

  test("shows no matches for nonsense queries", async ({ page }) => {
    await page.getByRole("button", { name: /^search$/i }).click();
    await typeInSearchModal(page, "zzznomatchquery");
    await expect(page.getByText(/loading catalog/i)).toBeHidden({
      timeout: 15_000,
    });

    await expect(
      page.getByText(/no products match that search/i),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("closes via the modal close button", async ({ page }) => {
    await page.getByRole("button", { name: /^search$/i }).click();
    const dialog = searchDialog(page);
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: /^close$/i }).click();
    await expect(dialog).toBeHidden();
  });
});
