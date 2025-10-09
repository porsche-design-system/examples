import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Astro Basics');
  await expect(page.getByRole('heading', { name: 'Porsche Design System' }).first()).toBeVisible();
  await expect(page.locator('p-wordmark').first()).toBeVisible();
});
