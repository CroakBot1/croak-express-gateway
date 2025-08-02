import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const VIDEO_URL = 'https://www.youtube.com/watch?v=LaEir9XtNiY';
const TOTAL_VIEWS = 1000;
const CONCURRENT_SESSIONS = 10; // Safe for 512MB RAM
const MAX_RETRIES = 2;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getRandomUserAgent = () => {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Firefox/102',
    'Mozilla/5.0 (Linux; Android 9; Pixel 2) Chrome/90.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5) AppleWebKit/605.1.15 Safari/604.1',
  ];
  return agents[Math.floor(Math.random() * agents.length)];
};

const ports = Array.from({ length: 100 }, (_, i) => 10001 + i);
let successfulViews = 0;
let viewCounter = 0;

const viewOnce = async (i, attempt = 0) => {
  const port = ports[Math.floor(Math.random() * ports.length)];
  const proxy = `http://gate.decodo.com:${port}`;
  const username = 'spw95jq2io';
  const password = '~jVy74ixsez5tWW6Cr';

  console.log(`🔁 View #${i} (Attempt ${attempt + 1}) via ${proxy}`);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: chromium.headless,
      executablePath: await chromium.executablePath(),
      args: [
        `--proxy-server=${proxy}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        ...chromium.args
      ]
    });

    const page = await browser.newPage();
    await page.authenticate({ username, password });
    await page.setUserAgent(getRandomUserAgent());

    await page.goto('https://api64.ipify.org?format=json', { waitUntil: 'domcontentloaded' });
    const ip = await page.evaluate(() => JSON.parse(document.body.innerText).ip);
    console.log(`🕵️ Real IP: ${ip}`);

    const response = await page.goto(VIDEO_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log(`📺 Status: ${response.status()} | Watching on IP ${ip}...`);
    await delay(60000); // 1 minute watch time

    await browser.close();
    successfulViews++;
    console.log(`✅ View #${i} complete. (Success #${successfulViews})`);
    await delay(3000 + Math.floor(Math.random() * 5000));
    return true;

  } catch (err) {
    if (browser) await browser.close();
    console.error(`❌ View #${i} failed: ${err.message}`);

    if (attempt < MAX_RETRIES) {
      console.log(`🔁 Retrying View #${i} (Retry ${attempt + 2}/${MAX_RETRIES + 1})...`);
      await delay(2000);
      return viewOnce(i, attempt + 1);
    } else {
      console.log(`⛔ View #${i} permanently failed after ${MAX_RETRIES + 1} attempts.`);
      return false;
    }
  }
};

(async () => {
  while (successfulViews < TOTAL_VIEWS) {
    console.log(`🚀 New batch: ${successfulViews}/${TOTAL_VIEWS} successful`);

    const remaining = TOTAL_VIEWS - successfulViews;
    const batchSize = Math.min(CONCURRENT_SESSIONS, remaining);
    const batchViews = [];

    for (let i = 0; i < batchSize; i++) {
      viewCounter++;
      batchViews.push(viewOnce(viewCounter));
    }

    await Promise.all(batchViews);
    await delay(5000);
  }

  console.log(`🎉 Finished: ${TOTAL_VIEWS} successful views`);
})();
