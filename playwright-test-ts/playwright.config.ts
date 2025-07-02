import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "tests",
  testMatch: "**/tests/test_1.spec.ts",
  timeout: 300000,
  use: {},
  workers: 10,
  repeatEach: 1,
  projects: [
    {
      name: "chrome:latest:Windows 11@lambdatest",
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
};

export default config;

