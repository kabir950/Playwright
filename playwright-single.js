



const { chromium } = require('playwright');

(async () => {
  const capabilities = {
    browserName: 'Chrome',
    browserVersion: 'latest',
    'LT:Options': {
      platform: 'Windows 11',
      build: 'Playwright File Upload',
      name: 'Upload Screenshot PNG',
      user: 'vaneetb',
      accessKey: 'PQ2AhuxqqOWAfvzfJlvPaOqusS7YKqfwFJR6DoWY2vsA8CvTzC',
      network: true,
      video: true,
      console: true,
      tunnel: false,
      // 👇 Upload file to LambdaTest
      files: ['"C:/Users/kabirk/Pictures/Screenshots/Screenshot (2).png"']
    }
  };

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://the-internet.herokuapp.com/upload');
  console.log('Opened file upload page');

  // 👇 STILL use the local path — LambdaTest remaps it in the backend
  await page.locator('#file-upload').setInputFiles('C:/Users/kabirk/Pictures/Screenshots/Screenshot (2).png');

  await page.locator('#file-submit').click();

  console.log('File uploaded successfully via LambdaTest cloud storage');

  await browser.close();
})();

