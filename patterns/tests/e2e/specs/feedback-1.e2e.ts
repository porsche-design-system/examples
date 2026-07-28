import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/feedback/1/');

  await expect(page).toHaveTitle('Feedback (Pattern)');
});

test('reveals comment and submit after choosing a rating, then shows confirmation', async ({ page }) => {
  await page.goto('/feedback/1/');

  const comment = page.locator('#feedback-comment');
  const submit = page.locator('#feedback-submit');
  const thanks = page.locator('#feedback-thanks');

  await expect(comment).toBeHidden();
  await expect(submit).toBeHidden();

  // Choosing a rating reveals the optional free-text field and the submit button.
  await page.locator('p-segmented-control-item[value="4"]').click();

  await expect(comment).toBeVisible();
  await expect(submit).toBeVisible();

  // Submitting shows the confirmation and moves focus to its heading.
  await submit.click();

  await expect(thanks).toBeVisible();
  await expect(page.locator('#feedback-form')).toBeHidden();
  await expect(page.locator('#feedback-thanks-heading')).toBeFocused();

  // Restarting resets the flow and returns focus to the question heading.
  await page.locator('#feedback-restart').click();

  await expect(thanks).toBeHidden();
  await expect(page.locator('#feedback-form')).toBeVisible();
  await expect(page.locator('#feedback-question')).toBeFocused();
});
