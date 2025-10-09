import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Vite + React + TS');
  await expect(page.getByRole('heading', { name: 'Porsche Design System' })).toBeVisible();
  await expect(page.locator('p-wordmark')).toBeVisible();
});
