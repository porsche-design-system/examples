import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const repoModules = path.resolve(rootDir, "../../node_modules");

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/unit/setup.ts"],
    server: {
      deps: {
        inline: ["react", "react-dom", "@testing-library/react"],
      },
    },
  },
  resolve: {
    alias: {
      "@": rootDir,
      react: path.join(repoModules, "react"),
      "react-dom": path.join(repoModules, "react-dom"),
      "react-dom/client": path.join(repoModules, "react-dom/client"),
      "react/jsx-runtime": path.join(repoModules, "react/jsx-runtime"),
      "react/jsx-dev-runtime": path.join(repoModules, "react/jsx-dev-runtime"),
    },
    dedupe: ["react", "react-dom"],
  },
});
