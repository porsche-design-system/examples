import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/examples/react-router/');

  await expect(page).toHaveTitle('New React Router App');
  await expect(page.getByRole('heading', { name: 'Porsche Design System' })).toBeVisible();
});
