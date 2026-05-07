import { AxeBuilder } from '@axe-core/playwright';
import { expect as playwrightExpect, test as playwrightTest } from '@playwright/test';

export const test = playwrightTest.extend<{
  makeAxeBuilder: () => AxeBuilder;
}>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => {
      return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'EN-301-549', 'best-practice']);
    };
    await use(makeAxeBuilder);
  },
});

export const expect = playwrightExpect;
