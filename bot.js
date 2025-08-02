const puppeteer = require('puppeteer');

const VIDEO_URL = 'https://www.youtube.com/watch?v=LaEir9XtNiY';
const TOTAL_VIEWS = 1000;
const CONCURRENT_SESSIONS = 50;

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

const viewOnce = async (i) => {
  const port = ports[Math.floor(Math.random() * ports.length)];
  const proxy = `http://gate.decodo.com:${port}`;
  const username = 'spw95jq2io';
  const password = '~jVy74ixsez5tWW6Cr';

  console.log(`🔁 View #${i} via ${proxy}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=${proxy}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage();
    await page.authenticate({ username, password });
    await page.setUserAgent(getRandomUserAgent());

    await page.goto('https://api64.ipify.org?format=json', { waitUntil: 'domcontentloaded' });
    const ip = await page.evaluate(() => JSON.parse(document.body.innerText).ip);
    console.log(`🕵️ Real IP: ${ip}`);

    await page.goto(VIDEO_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log(`📺 Watching video on ${ip}...`);
    await delay(60000);

  } catch (err) {
    console.error(`❌ View #${i} failed: ${err.message}`);
  }

  if (browser) await browser.close();
  console.log(`✅ View #${i} complete.`);
  await delay(3000 + Math.floor(Math.random() * 5000));
};

(async () => {
  for (let batch = 0; batch < TOTAL_VIEWS / CONCURRENT_SESSIONS; batch++) {
    console.log(`🚀 Starting batch ${batch + 1} (${CONCURRENT_SESSIONS} views)`);

    const batchViews = [];
    for (let i = 1; i <= CONCURRENT_SESSIONS; i++) {
      const viewNum = batch * CONCURRENT_SESSIONS + i;
      batchViews.push(viewOnce(viewNum));
    }

    await Promise.all(batchViews);
    console.log(`✅ Batch ${batch + 1} done.`);
    await delay(5000);
  }

  console.log('\n🎉 All 1000 views completed!');
})();
      password: '~jVy74ixsez5tWW6Cr'
    });

    await page.setUserAgent(getRandomUserAgent());

    await page.goto('https://api64.ipify.org?format=json', { waitUntil: 'domcontentloaded' });
    const ip = await page.evaluate(() => JSON.parse(document.body.innerText).ip);
    console.log(`🕵️ View #${i} Real IP: ${ip}`);

    await page.goto(VIDEO_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log(`📺 Watching YouTube on IP ${ip}...`);
    await delay(60000); // Watch time: 60 seconds

  } catch (err) {
    console.error(`❌ View #${i} failed: ${err.message}`);
  }

  if (browser) await browser.close();
  console.log(`✅ View #${i} complete.`);
  await delay(3000 + Math.floor(Math.random() * 5000)); // 3–8s delay
};

(async () => {
  for (let batch = 0; batch < TOTAL_VIEWS / CONCURRENT_SESSIONS; batch++) {
    console.log(`🚀 Starting batch ${batch + 1} (${CONCURRENT_SESSIONS} views)`);

    const batchViews = [];
    for (let i = 1; i <= CONCURRENT_SESSIONS; i++) {
      const viewNum = batch * CONCURRENT_SESSIONS + i;
      batchViews.push(viewOnce(viewNum));
    }

    await Promise.all(batchViews);
    console.log(`✅ Batch ${batch + 1} complete.`);
    await delay(5000); // Short cooldown
  }

  console.log('\n🎉 All 1,000 views completed!');
})();

    await page.authenticate({
      username: 'spw95jq2io',
      password: '~jVy74ixsez5tWW6Cr',
    });

    await page.setUserAgent(getRandomUserAgent());

    // Detect real IP
    await page.goto('https://api64.ipify.org?format=json', { waitUntil: 'domcontentloaded' });
    const ip = await page.evaluate(() => JSON.parse(document.body.innerText).ip);
    console.log(`🕵️ View #${i} Real IP: ${ip}`);

    // Watch YouTube video
    await page.goto(VIDEO_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log(`📺 Watching YouTube on IP ${ip}...`);
    await delay(60000); // 60s watch time

  } catch (err) {
    console.error(`❌ View #${i} failed: ${err.message}`);
  }

  if (browser) await browser.close();
  console.log(`✅ View #${i} complete.`);
  await delay(3000 + Math.floor(Math.random() * 5000)); // Cooldown 3–8s
};

(async () => {
  for (let batch = 0; batch < TOTAL_VIEWS / CONCURRENT_SESSIONS; batch++) {
    console.log(`🚀 Starting batch ${batch + 1} (${CONCURRENT_SESSIONS} views)`);

    const batchViews = [];
    for (let i = 1; i <= CONCURRENT_SESSIONS; i++) {
      const viewNum = batch * CONCURRENT_SESSIONS + i;
      batchViews.push(viewOnce(viewNum));
    }

    await Promise.all(batchViews);
    console.log(`✅ Batch ${batch + 1} complete.`);
    await delay(5000); // Short break before next batch
  }

  console.log('\n🎉 All 1,000 views completed!');
})();
