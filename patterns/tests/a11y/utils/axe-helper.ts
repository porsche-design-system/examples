import { AxeBuilder } from '@axe-core/playwright';
import { expect as playwrightExpect, test as playwrightTest } from '@playwright/test';
import type { Page } from 'playwright-core';

// Extend Playwright test to be used in multiple test files, and each of them
// will get a consistently configured AxeBuilder instance.
export const test = playwrightTest.extend<{
  makeAxeBuilder: () => AxeBuilder;
}>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => {
      return new AxeBuilder({ page: page as Page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22aa',
        'best-practice',
      ]);
    };
    await use(makeAxeBuilder);
  },
});

export const expect = playwrightExpect;
