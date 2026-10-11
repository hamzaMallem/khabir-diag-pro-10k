import { defineConfig } from "@playwright/test";

// Run against a production build:  npm run build && npx playwright test
// (the config starts `next start` on port 3001 if nothing is running there already)
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 60_000,
  workers: 2,
  reporter: [["list"]],
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:3001" },
  webServer: {
    command: "npm run start -- -p 3001",
    url: "http://localhost:3001/fr",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
