package com.lambdatest;

import com.google.gson.JsonObject;
import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import java.net.URLEncoder;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PlaywrightTestParallelTest  {

    private static final String USER = "kabirk";
    private static final String ACCESS_KEY = "pERMCQ3SNrz1kq71zXL1tbfLfEYwMvewv6fBovwIV0iZYbWCSG";

    @BeforeEach
    public void setup() {
        // No need to create Playwright instance here, each test will create its own.
    }

    @Test
    @Order(1)
    public void testSearchLambdaTest() {
        Playwright playwright = Playwright.create();
        BrowserType chromium = playwright.chromium();
        JsonObject capabilities = new JsonObject();
        JsonObject ltOptions = new JsonObject();

        capabilities.addProperty("browserName", "Chrome");
        capabilities.addProperty("browserVersion", "136");
        ltOptions.addProperty("platform", "Windows 11");
        ltOptions.addProperty("name", "Playwright Test");
        ltOptions.addProperty("build", "Playwright Java Build");
        ltOptions.addProperty("user", USER);
        ltOptions.addProperty("accessKey", ACCESS_KEY);
        capabilities.add("LT:Options", ltOptions);

        Browser browser = null;
        try {
            String caps = URLEncoder.encode(capabilities.toString(), "utf-8");
            String cdpUrl = "wss://cdp.lambdatest.com/playwright?capabilities=" + caps;
            browser = chromium.connect(cdpUrl);

            Page page = browser.newPage();
            page.navigate("https://jobget.com/hire");

    }

    private void setTestStatus(String status, String remark, Page page) {
        page.evaluate("_ => {}", "lambdatest_action: { \"action\": \"setTestStatus\", \"arguments\": { \"status\": \"" + status + "\", \"remark\": \"" + remark + "\"}}");
    }
}
