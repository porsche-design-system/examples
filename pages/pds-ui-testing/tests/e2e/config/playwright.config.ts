import { defineConfig, devices } from "@playwright/test";

const E2E_PORT = 3456;

export default defineConfig({
  testDir: "../specs",
  testMatch: "**/*.e2e.ts",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    actionTimeout: 0,
    trace: "off",
    viewport: null,
    baseURL: `http://127.0.0.1:${E2E_PORT}`,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  outputDir: "../test-results",
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Deploy artifacts set NEXT_PUBLIC_BASE_PATH; E2E must serve from site root so
    // `/_next` and client hydration match the URLs under test (see filter-chip-dismiss).
    command: `NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_FULLSTORY_ORG_ID= npm run build && npx serve dist -l ${E2E_PORT}`,
    port: E2E_PORT,
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 120_000 : 120_000,
  },
});
