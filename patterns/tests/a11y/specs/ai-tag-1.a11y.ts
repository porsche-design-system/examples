import { expect, test } from '../utils';

test.describe('has WCAG 2.2 (AA) compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/patterns/ai-tag/1/');
    await expect(page.getByText('Pattern')).toBeVisible();
  });

  test('with a11y tree', async ({ page }) => {
    await expect(page.locator('body')).toMatchAriaSnapshot({ name: 'ai-tag-1.aria.yml' });
  });

  test('with axe', async ({ makeAxeBuilder }) => {
    expect((await makeAxeBuilder().analyze()).violations).toEqual([]);
  });
});
