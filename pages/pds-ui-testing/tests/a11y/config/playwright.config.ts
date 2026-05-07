import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../specs',
  testMatch: '**/*.a11y.ts',
  timeout: 20000,
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
    command: 'npm run dev',
    port: 3010,
  },
});
