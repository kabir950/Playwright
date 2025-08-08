const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const capabilities = {
    browserName: 'Chrome',
    browserVersion: 'latest',
    'LT:Options': {
      platform: 'Windows 11',
      build: process.env.LT.BUILD_NAME,
      name: 'Upload Screenshot PNG',
      user: 'kabirk',
      accessKey: 'LT_RhMHqS2TJ4lYNmnzOfTYRaNYNdbFdvoDAKSFTVknI2UQBth',
      network: true,
      video: true,
      console: true,
      tunnel: false
    }
  };

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://the-internet.herokuapp.com/upload');

  await browser.close();
})();
