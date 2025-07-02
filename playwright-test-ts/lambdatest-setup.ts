import * as base from "@playwright/test";
import path from "path";
import { chromium } from "playwright";

// LambdaTest capabilities
const capabilities = {
  browserName: 'Chrome',
  browserVersion: 'latest',
  'LT:Options': {
    platform: 'Windows 10',
    build: 'Playwright Sample Build',
    name: 'Playwright Sample Test',
    user: 'kabirk',          // your username here
    accessKey: 'pERMCQ3SNrz1kq71zXL1tbfLfEYwMvewv6fBovwIV0iZYbWCSG',  // your access key here
    'goog:chromeOptions': [
      '--disable-blink-features=AutomationControlled',

    ],
  },
};



const modifyCapabilities = (configName: string, testName: string) => {
  const config = configName.split("@lambdatest")[0];
  const [browserName, browserVersion, platform] = config.split(":");
  capabilities.browserName = browserName || capabilities.browserName;
  capabilities.browserVersion = browserVersion || capabilities.browserVersion;
  capabilities["LT:Options"]["platform"] = platform || capabilities["LT:Options"]["platform"];
  capabilities["LT:Options"]["name"] = testName;
};

const customTest = base.test.extend({
  page: async ({ page, playwright }, use, testInfo) => {
    const fileName = testInfo.file.split(path.sep).pop();

    if (testInfo.project.name.match(/lambdatest/)) {
      modifyCapabilities(
        testInfo.project.name,
        `${testInfo.title} - ${fileName}`
      );

      const browser = await chromium.connect({
        wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
          JSON.stringify(capabilities)
        )}`,
      });

      console.log("✅ Connected to LambdaTest via CDP WebSocket");

      const ltPage = await browser.newPage(testInfo.project.use);
      ltPage.setDefaultTimeout(15000);
      ltPage.setDefaultNavigationTimeout(20000);

      await use(ltPage);

      const testStatus = {
        action: "setTestStatus",
        arguments: {
          status: testInfo.status,
          remark: testInfo.error?.stack || testInfo.error?.message,
        },
      };

      await ltPage.evaluate(() => {}, `lambdatest_action: ${JSON.stringify(testStatus)}`);

      await ltPage.close();
      await browser.close();
    } else {
      await use(page);
    }
  },
});

// ✅ Attach describe, beforeAll, etc. from base test
Object.assign(customTest, {
  describe: base.test.describe,
  describeOnly: base.test.describe.only,
  describeSkip: base.test.describe.skip,
  beforeAll: base.test.beforeAll,
  afterAll: base.test.afterAll,
  beforeEach: base.test.beforeEach,
  afterEach: base.test.afterEach,
});

export default customTest;
export const expect = customTest.expect;
