const { chromium } = require('playwright');
const { expect } = require("expect");
const cp = require('child_process');
const playwrightClientVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

const parallelTests = async (capability, index) => {
  console.log(`Initializing test run ${index + 1}:: `, capability['LT:Options']['name']);

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capability))}`,
    timeout: 60000
  });

  const page = await browser.newPage();

  await page.goto("https://duckduckgo.com");

  let element = await page.locator("[name=\"q\"]");
  await element.click();
  await element.type("LambdaTest");
  await element.press("Enter");
  const title = await page.title();

  try {
    expect(title).toEqual('LambdaTest at DuckDuckGo');
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Title matched' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.stack } })}`);
    throw e;
  } finally {
    await teardown(page, browser);
  }
};

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}

const capabilities = new Array(25).fill({
  'browserName': 'Chrome',
  'browserVersion': 'latest',
  'LT:Options': {
    'platform': 'Windows 10',
    'build': 'Playwright With Parallel Build',
    'name': 'Playwright Sample Test',
    'user': 'kabirk',
    'accessKey': 'pERMCQ3SNrz1kq71zXL1tbfLfEYwMvewv6fBovwIV0iZYbWCSG',
    'network': true,
    'video': true,
    'console': true,
    'playwrightClientVersion': playwrightClientVersion
  }
});

capabilities.forEach(async (capability, index) => {
  await parallelTests(capability, index);
});
