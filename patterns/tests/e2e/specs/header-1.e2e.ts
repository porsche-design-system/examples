import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/header/1/');

  await expect(page).toHaveTitle('Header (Pattern)');
});
