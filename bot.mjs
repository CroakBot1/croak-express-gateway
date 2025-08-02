import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const VIDEO_URL = 'https://www.youtube.com/watch?v=LaEir9XtNiY';
const TOTAL_VIEWS = 1000;
const CONCURRENT_SESSIONS = 5;

const username = 'spw95jq2io';
const password = '~jVy74ixsez5tWW6Cr';

// Generate 100,000 Decodo ports: 10001–110000
const ports = Array.from({ length: 100000 }, (_, i) => 10001 + i);
let usedPorts = new Set();

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

const getUniquePort = () => {
  let port;
  do {
    port = ports[Math.floor(Math.random() * ports.length)];
  } while (usedPorts.has(port));
  usedPorts.add(port);
  return port;
};

const viewOnce = async (i) => {
  const port = getUniquePort();
  const proxy = `http://gate.decodo.com:${port}`;

  console.log(`🔁 View #${i} via ${proxy}`);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: chromium.executablePath,
      args: [
        `--proxy-server=${proxy}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();
    await page.authenticate({ username, password });
    await page.setUserAgent(getRandomUserAgent());

    // Get current IP for verification
    await page.goto('https://api64.ipify.org?format=json', { waitUntil: 'domcontentloaded' });
    const ip = await page.evaluate(() => JSON.parse(document.body.innerText).ip);
    console.log(`🕵️ Real IP: ${ip}`);

    // Visit video
    await page.goto(VIDEO_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log(`📺 Watching video on ${ip}...`);
    await delay(60000); // 60s watch time

  } catch (err) {
    console.error(`❌ View #${i} failed: ${err.message}`);
  }

  if (browser) await browser.close();
  console.log(`✅ View #${i} complete.`);
  await delay(3000 + Math.floor(Math.random() * 3000)); // small cooldown
};

const start = async () => {
  for (let batch = 0; batch < TOTAL_VIEWS / CONCURRENT_SESSIONS; batch++) {
    console.log(`🚀 Batch ${batch + 1}`);
    const tasks = [];

    for (let i = 1; i <= CONCURRENT_SESSIONS; i++) {
      const viewNum = batch * CONCURRENT_SESSIONS + i;
      tasks.push(viewOnce(viewNum));
    }

    await Promise.all(tasks);
    await delay(5000); // short delay between batches
  }

  console.log('\n🎉 All views completed!');
};

start();
