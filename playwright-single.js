const cp = require('child_process');
const { chromium } = require('playwright'); // ✅ Use Chromium for Chrome

(async () => {
  const playwrightClientVersion = cp
    .execSync('npx playwright --version')
    .toString()
    .trim()
    .split(' ')[1];

  const capabilities = {
    browserName: 'chrome',              // ✅ Chromium for Chrome
    version: 'latest',
    platform: 'MacOS Ventura',                  // ✅ Use desktop OS
    type: 'playwright',
    region: 'apac',
    geoLocation: 'NZ',
   // resolution: '1920x1080',                 // ✅ Full desktop screen

    video: true,
    commandLog: true,
    user: 'kabirk',
    accessKey: 'LT_RhMHqS2TJ4lYNmnzOfTYRaNYNdbFdvoDAKSFTVknI2UQBth'
  };

  const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
    JSON.stringify(capabilities)
  )}`;

  const browserInstance = await chromium.connect({ wsEndpoint }); // ✅ Connect with Chromium
  const context = await browserInstance.newContext();
  const page = await context.newPage();

  const setTestStatus = async (status, remark) => {
    const testStatus = {
      action: 'setTestStatus',
      arguments: {
        status,
        remark
      }
    };
    await page.evaluate(
      () => {},
      `lambdatest_action: ${JSON.stringify(testStatus)}`
    );
  };

  try {
    await page.goto('https://www.spingalaxy.com/?s=bfp33171&a=115299733123112');
    await page.waitForTimeout(3000);

    const title = await page.title();
    console.log('Page title:', title);

    if (!title.includes('LambdaTest')) {
      throw new Error('Title does not contain LambdaTest');
    }

    await setTestStatus('passed', 'Title matched');
  } catch (error) {
    await setTestStatus('failed', error.message || 'Test failed');
    console.error(error);
    await browserInstance.close();
    process.exit(1);
  }

  await page.close();
  await browserInstance.close();
  process.exit(0);
})();
