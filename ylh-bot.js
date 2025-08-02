const puppeteer = require("puppeteer");

const USERNAME = "app1";
const PASSWORD = "Freedom98";
const LOGIN_URL = "https://www.youlikehits.com/login.php";
const YT_VIEW_URL = "https://www.youlikehits.com/youtubeviews.php";
const VIEW_WAIT = 35000;

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Set to true if you want to hide browser
        defaultViewport: null,
        args: ["--start-maximized"]
    });

    const page = await browser.newPage();

    // Login
    console.log("🔐 Navigating to login...");
    await page.goto(LOGIN_URL, { waitUntil: "networkidle2" });

    await page.type('input[name="username"]', USERNAME);
    await page.type('input[name="password"]', PASSWORD);
    await Promise.all([
        page.click('input[type="submit"][value="Login"]'),
        page.waitForNavigation({ waitUntil: "networkidle2" })
    ]);

    console.log("✅ Logged in");

    // Main Loop
    while (true) {
        console.log("➡️ Navigating to YouTube View page...");
        await page.goto(YT_VIEW_URL, { waitUntil: "networkidle2" });

        const viewButton = await page.$('input[type="submit"][value="View"]');
        if (viewButton) {
            console.log("▶️ Clicking View...");
            await Promise.all([
                viewButton.click(),
                page.waitForNavigation({ waitUntil: "networkidle2" })
            ]);

            if (page.url().includes("youtubeplay.php")) {
                console.log(`⏳ Watching video for ${VIEW_WAIT / 1000}s...`);
                await new Promise((r) => setTimeout(r, VIEW_WAIT));
                console.log("✅ Done watching. Looping back...");
            } else {
                console.log("⚠️ Unexpected redirect after View.");
            }
        } else {
            console.log("❌ No view available. Retrying in 10s...");
            await new Promise((r) => setTimeout(r, 10000));
        }
    }

    // await browser.close(); // This never gets called unless you stop loop
})();
