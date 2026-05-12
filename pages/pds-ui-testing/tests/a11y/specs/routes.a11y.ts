import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '../utils';

const dynamicSegmentSamples: Record<string, string | string[]> = {
  '[locale]': ['en', 'de'],
  '[companySlug]': ['glance', 'pcna', 'sustainability', 'career', 'press'],
  '[legalSlug]': ['notice', 'icp', 'environment', 'security', 'more'],
  '[productSlug]': ['porsche-baseball-cap'],
};

const isPageFile = (entryName: string): boolean => entryName === 'page.tsx';

const expandResolvedParts = (parts: string[]): string[][] => {
  return parts.reduce<string[][]>(
    (acc, part) => {
      const sample = dynamicSegmentSamples[part];
      const options: string[] =
        sample === undefined
          ? [part]
          : Array.isArray(sample)
            ? sample
            : [sample];
      if (acc.length === 0) {
        return options.map((value) => [value]);
      }
      return acc.flatMap((prefix) => options.map((value) => [...prefix, value]));
    },
    [],
  );
};

const isRouteGroup = (entryName: string): boolean =>
  entryName.startsWith('(') && entryName.endsWith(')');

const getPageRoutes = (dir: string, parentParts: string[] = []): string[] => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const routes: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Route groups (`(home)`, `(default)`, …) do not contribute URL segments.
      const childParts = isRouteGroup(entry.name)
        ? parentParts
        : [...parentParts, entry.name];
      routes.push(...getPageRoutes(join(dir, entry.name), childParts));
      continue;
    }
    if (entry.isFile() && isPageFile(entry.name)) {
      for (const resolvedParts of expandResolvedParts(parentParts)) {
        routes.push(resolvedParts.length === 0 ? '/' : `/${resolvedParts.join('/')}`);
      }
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
