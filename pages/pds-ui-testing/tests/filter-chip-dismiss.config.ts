import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "filter-chip-*.spec.ts",
  timeout: 30000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:3456",
  },
  webServer: {
    command: "npx serve dist -l 3456",
    port: 3456,
    reuseExistingServer: true,
  },
});
