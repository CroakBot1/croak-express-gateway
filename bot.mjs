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
let usedPorts = new Set();
const usedIPs = new Set(); // ✅ TRACK USED IPs

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

  console.log(`🔁 View #${i} via ${proxy}`);
  let browser;

  try {
    await delay(300);

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

    await page.goto('https://api64.ipify.org?format=json', { waitUntil: 'domcontentloaded' });
    const ip = await page.evaluate(() => JSON.parse(document.body.innerText).ip);

    if (usedIPs.has(ip)) {
      console.log(`⚠️ Duplicate IP detected: ${ip}. Skipping this view.`);
      await browser.close();
      return;
    } else {
      usedIPs.add(ip);
      console.log(`🆕 Unique IP: ${ip}`);
    }

    await page.goto(VIDEO_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log(`📺 Watching video on ${ip}...`);
    await delay(60000); // Watch 60s

  } catch (err) {
    console.error(`❌ View #${i} failed: ${err.message}`);
    if (retries > 0) {
      console.log(`🔁 Retrying View #${i}... Attempts left: ${retries}`);
      await viewOnce(i, retries - 1);
      return;
    }
  }

  if (browser) await browser.close();
  console.log(`✅ View #${i} complete.`);
  await delay(VIEW_DELAY_MS);
};

const start = async () => {
  let count = 1;
  console.log(`🚀 Starting 24/7 forever loop...`);
  while (true) {
    await viewOnce(count++);
  }
};

start();

// ✅ Keeps Render alive
http.createServer((req, res) => {
  if (req.url === '/ping') {
    res.end('✅ Ping success!');
  } else {
    res.end('📺 YouTube view bot is running forever...');
  }
}).listen(process.env.PORT || 3000);
