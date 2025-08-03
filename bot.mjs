import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import http from 'http';

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

const VIDEO_URL = 'https://www.youtube.com/watch?v=LaEir9XtNiY';
const VIEW_DELAY_MS = 1000;
const username = 'spw95jq2io';
const password = '~jVy74ixsez5tWW6Cr';

const ports = Array.from({ length: 100000 }, (_, i) => 10001 + i);
const usedPorts = new Set();
const usedIPs = new Set();
const MAX_USED_IPS = 500;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const getRandomUserAgent = () => {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Firefox/102',
    'Mozilla/5.0 (Linux; Android 9; Pixel 2) Chrome/90.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5) AppleWebKit/605.1.15 Safari/604.1',
  ];
  return agents[Math.floor(Math.random() * agents.length)];
};

const getUniquePort = () => {
  let port;
  do {
    port = ports[Math.floor(Math.random() * ports.length)];
  } while (usedPorts.has(port));
  usedPorts.add(port);
  return port;
};

const viewOnce = async (i, retries = 3) => {
  const port = getUniquePort();
  const proxy = `http://gate.decodo.com:${port}`;
  let browser;

  console.log(`\n🔁 View #${i} via ${proxy}`);

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: await chromium.executablePath(),
      args: [
        `--proxy-server=${proxy}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();
    await page.authenticate({ username, password });
    await page.setUserAgent(getRandomUserAgent());
    await page.setViewport({
      width: 1280 + Math.floor(Math.random() * 200),
      height: 720 + Math.floor(Math.random() * 200),
    });

    // Get real IP
    await page.goto('https://api64.ipify.org?format=json', {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    });

    const ip = await page.evaluate(() => JSON.parse(document.body.innerText).ip);
    if (usedIPs.has(ip)) {
      console.log(`⚠️ Duplicate IP ${ip}, skipping...`);
      return;
    }

    usedIPs.add(ip);
    console.log(`🆕 Unique IP: ${ip}`);
    if (usedIPs.size >= MAX_USED_IPS) {
      usedIPs.clear();
      console.log(`♻️ Cleared used IPs list`);
    }

    // Visit YouTube
    await page.goto(VIDEO_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`📺 Watching from IP ${ip}...`);
    await delay(60000);
    console.log(`⏱️ Done watching.`);

  } catch (err) {
    console.error(`❌ View #${i} error: ${err.message}`);
    if (retries > 0) {
      console.log(`🔁 Retrying View #${i} (${retries - 1} retries left)...`);
      await delay(2000);
      return await viewOnce(i, retries - 1);
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.warn(`⚠️ Browser already closed or failed to close: ${closeErr.message}`);
      }
    }
  }

  console.log(`✅ View #${i} complete.`);
  if (i % 10 === 0) console.log(`❤️ Heartbeat: running OK after ${i} views`);
  await delay(VIEW_DELAY_MS);
};

const start = async () => {
  let count = 1;
  console.log(`🚀 Starting infinite view loop...`);
  while (true) {
    try {
      await viewOnce(count++);
    } catch (err) {
      console.error(`🔥 Unexpected loop crash: ${err.message}`);
    }
  }
};

start();

// Keep service alive
http.createServer((req, res) => {
  res.end(req.url === '/ping' ? '✅ Ping success!' : '📺 YouTube view bot running...');
}).listen(process.env.PORT || 3000);
