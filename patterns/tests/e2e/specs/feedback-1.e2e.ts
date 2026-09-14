import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/feedback/1/');

  await expect(page).toHaveTitle('Feedback (Pattern)');
});

test('reveals comment and submit after choosing a rating, then shows confirmation', async ({ page }) => {
  await page.goto('/feedback/1/');
  await page.evaluate(() => {
    const { __focusLog } = window as typeof window & { __focusLog: string[] };
    const focusLog = __focusLog ?? [];
    (window as typeof window & { __focusLog: string[] }).__focusLog = focusLog;
    for (const id of ['feedback-question', 'feedback-thanks-heading']) {
      const element = document.getElementById(id);
      if (!element) {
        continue;
      }
      const originalFocus = element.focus.bind(element);
      element.focus = (...args) => {
        focusLog.push(id);
        return originalFocus(...args);
      };
    }
  });

  const comment = page.locator('#feedback-comment');
  const submit = page.locator('#feedback-submit');
  const thanks = page.locator('#feedback-thanks');

  await expect(comment).toHaveJSProperty('hidden', true);
  await expect(submit).toHaveJSProperty('hidden', true);

  // Choosing a rating reveals the optional free-text field and the submit button.
  await page.locator('#feedback-rating').evaluate((element) => {
    element.value = '4';
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(comment).toHaveJSProperty('hidden', false);
  await expect(submit).toHaveJSProperty('hidden', false);

  // Submitting shows the confirmation and moves focus to its heading.
  await submit.evaluate((element) => {
    element.click();
  });

  await expect(thanks).toHaveJSProperty('hidden', false);
  await expect(page.locator('#feedback-form')).toHaveJSProperty('hidden', true);
  await expect(page.locator('#feedback-question')).toHaveJSProperty('hidden', true);
  await expect
    .poll(() => {
      return page.evaluate(() => (window as typeof window & { __focusLog?: string[] }).__focusLog?.at(-1));
    })
    .toBe('feedback-thanks-heading');

  // Restarting resets the flow and returns focus to the question heading.
  await page.locator('#feedback-restart').evaluate((element) => {
    element.click();
  });

  await expect(thanks).toHaveJSProperty('hidden', true);
  await expect(page.locator('#feedback-form')).toHaveJSProperty('hidden', false);
  await expect(page.locator('#feedback-question')).toHaveJSProperty('hidden', false);
  await expect
    .poll(() => {
      return page.evaluate(() => (window as typeof window & { __focusLog?: string[] }).__focusLog?.at(-1));
    })
    .toBe('feedback-question');
});
