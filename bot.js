const puppeteer = require('puppeteer');

const VIDEO_URL = 'https://www.youtube.com/watch?v=LaEir9XtNiY';
const TOTAL_VIEWS = 100;

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

(async () => {
  for (let i = 1; i <= TOTAL_VIEWS; i++) {
    const ports = [10001,10002,10003,10004,10005,10006,10007,10008,10009,10010];
    const port = ports[Math.floor(Math.random() * ports.length)];
    const proxy = `http://spw95jq2io:~jVy74ixsez5tWW6Cr@gate.decodo.com:${port}`;

    console.log(`\n🎯 View #${i} via ${proxy}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: [`--proxy-server=gate.decodo.com:${port}`],
    });

    const page = await browser.newPage();
    await page.authenticate({
      username: 'spw95jq2io',
      password: '~jVy74ixsez5tWW6Cr'
    });
    await page.setUserAgent(getRandomUserAgent());

    try {
      await page.goto(VIDEO_URL, { waitUntil: 'networkidle2', timeout: 60000 });
      console.log(`✅ Watching for 60 seconds...`);
      await delay(60000);
    } catch (err) {
      console.error(`❌ View #${i} failed: ${err.message}`);
    }

    await browser.close();
    console.log(`✅ View #${i} complete.`);
    await delay(3000 + Math.floor(Math.random() * 5000)); // Add 3–8s pause
  }

  console.log('\n🎉 100 views completed. Will auto-run again next hour on Render.');
})();

    try {
      await page.goto(VIDEO_URL, { waitUntil: 'networkidle2', timeout: 60000 });
      console.log(`✅ Watching for 60 seconds...`);
      await delay(60000);
    } catch (err) {
      console.error(`❌ View #${i} failed: ${err.message}`);
    }

    await browser.close();
    console.log(`✅ View #${i} complete.`);
    await delay(3000);
  }

  console.log('\\n🎉 All views done!');
})();
