import { defineConfig, devices } from '@playwright/test';

const A11Y_PORT = 3456;

export default defineConfig({
  testDir: '../specs',
  testMatch: '**/*.a11y.ts',
  timeout: 30000,
  expect: {
    timeout: 5000,
    toMatchAriaSnapshot: {
      pathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
    },
  },
  use: {
    actionTimeout: 0,
    trace: 'off',
    viewport: null,
    baseURL: `http://127.0.0.1:${A11Y_PORT}`,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  outputDir: '../test-results',
  projects: [
    {
      name: 'Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    // Match E2E: static export preview without base path so hydration matches URLs under test.
    command: `NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_FULLSTORY_ORG_ID= npm run build && npx serve dist -l ${A11Y_PORT}`,
    port: A11Y_PORT,
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 120_000 : 120_000,
  },
});
