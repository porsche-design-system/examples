import { expect, test } from '../utils';

// The demo page is an isolated footer fragment, so the document-structure best-practice
// rules that expect a page-level `<main>` and `<h1>` are not applicable here.
const documentStructureRules = ['landmark-one-main', 'page-has-heading-one'];

test.describe('has WCAG 2.2 (AA) compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/feedback/1/');
    await expect(page.locator('#feedback-question')).toBeVisible();
  });

  test('with a11y tree', async ({ page }) => {
    await expect(page.locator('body')).toMatchAriaSnapshot({ name: 'feedback-1.aria.yml' });
  });

  test('with axe', async ({ makeAxeBuilder }) => {
    expect((await makeAxeBuilder().disableRules(documentStructureRules).analyze()).violations).toEqual([]);
  });

  test('with axe in confirmation state', async ({ page, makeAxeBuilder }) => {
    await page.locator('#feedback-rating').evaluate((element) => {
      element.value = '4';
      element.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.locator('#feedback-submit').evaluate((element) => {
      element.click();
    });
    await expect(page.locator('#feedback-thanks')).toHaveJSProperty('hidden', false);

    expect((await makeAxeBuilder().disableRules(documentStructureRules).analyze()).violations).toEqual([]);
  });
});
