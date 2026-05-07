import { expect, test } from '../utils';
import { readdirSync } from 'node:fs';

const dynamicSegmentSamples: Record<string, string> = {
  '[id]': 'watch-001',
};

const isPageFile = (entryName: string): boolean => entryName === 'page.tsx';

const getPageRoutes = (dir: string, parentParts: string[] = []): string[] => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const routes: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      routes.push(...getPageRoutes(`${dir}/${entry.name}`, [...parentParts, entry.name]));
      continue;
    }
    if (entry.isFile() && isPageFile(entry.name)) {
      const resolvedParts = parentParts.map((part) => dynamicSegmentSamples[part] ?? part);
      routes.push(resolvedParts.length === 0 ? '/' : `/${resolvedParts.join('/')}`);
    }
  }

  return routes;
};

const appDir = 'app';
const testRoutes = Array.from(new Set(getPageRoutes(appDir))).sort((a, b) => a.localeCompare(b));

test.describe('A11y test shop', () => {
  for (const route of testRoutes) {
    test(`axe has no critical violations on ${route}`, async ({ page, makeAxeBuilder }) => {
      await page.goto(route);
      await expect(page.getByTestId('main-content')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const results = await makeAxeBuilder().analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
