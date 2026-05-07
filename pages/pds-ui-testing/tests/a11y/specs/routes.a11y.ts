import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { detailSampleIds } from '../../../app/detail/sample-ids';
import { expect, test } from '../utils';

const dynamicSegmentSamples: Record<string, string> = {
  '[id]': detailSampleIds[0],
};

const isPageFile = (entryName: string): boolean => entryName === 'page.tsx';

const getPageRoutes = (dir: string, parentParts: string[] = []): string[] => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const routes: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      routes.push(...getPageRoutes(join(dir, entry.name), [...parentParts, entry.name]));
      continue;
    }
    if (entry.isFile() && isPageFile(entry.name)) {
      const resolvedParts = parentParts.map((part) => dynamicSegmentSamples[part] ?? part);
      routes.push(resolvedParts.length === 0 ? '/' : `/${resolvedParts.join('/')}`);
    }
  }

  return routes;
};

// __dirname is provided by Playwright's TS loader (CJS).
const projectRoot = join(__dirname, '..', '..', '..');
const appDir = join(projectRoot, 'app');
const testRoutes = Array.from(new Set(getPageRoutes(appDir))).sort((a, b) => a.localeCompare(b));

test.describe('A11y route smoke tests', () => {
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
