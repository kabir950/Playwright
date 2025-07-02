import test, { expect } from "../lambdatest-setup";

test.describe("Browse LambdaTest", () => {
  test("Open URL and wait before ending session", async ({ page }) => {
    await page.goto("https://jobget.com/hire");

        // Wait for 15 seconds
    await page.waitForTimeout(15000);


    console.log("Waited for 15 seconds. Ending session.");
  });
});
