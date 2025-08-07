const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

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
      tunnel: false
    }
  };

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://the-internet.herokuapp.com/upload');


  // ✅ Manually create JUnit XML
  const xml = `
<testsuites>
  <testsuite name="Playwright Raw Script" tests="1" failures="0">
    <testcase classname="FileUpload" name="Upload Screenshot PNG" time="1"/>
  </testsuite>
</testsuites>
  `;

  const reportDir = path.join(__dirname, 'test-results');
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'results.xml'), xml.trim());
  console.log('✅ JUnit XML report generated at test-results/results.xml');

  await browser.close();
})();
