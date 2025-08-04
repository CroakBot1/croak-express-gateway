// 🌐 Express backend for FB Global Viewer (Loop + Proxy Rotation)
import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;

const proxyUser = 'spw95jq2io';
const proxyPass = '~jVy74ixsez5tWW6Cr';
const fbVideoURL = 'https://m.facebook.com/share/v/177AxvRKYW/';

// Load proxies from proxies.txt if available
let proxyList = [];
try {
  const file = fs.readFileSync('proxies.txt', 'utf8');
  proxyList = file
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [country, host, port] = line.split(',');
      return { country, host, port };
    });
  console.log(`✅ Loaded ${proxyList.length} proxies from file.`);
} catch (e) {
  console.log('⚠️ No proxies.txt found, using default list.');
  proxyList = [
    { country: 'US', host: 'us.decodo.io', port: '12345' },
    { country: 'PH', host: 'ph.decodo.io', port: '12345' },
    { country: 'CA', host: 'ca.decodo.io', port: '12345' },
    { country: 'IN', host: 'in.decodo.io', port: '12345' },
    { country: 'BR', host: 'br.decodo.io', port: '12345' },
  ];
}

async function runViewCycle() {
  const logs = [];

  for (const proxy of proxyList) {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          `--proxy-server=${proxy.host}:${proxy.port}`,
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });

      const page = await browser.newPage();
      await page.authenticate({ username: proxyUser, password: proxyPass });

      await page.setRequestInterception(true);
      page.on('request', req => {
        const type = req.resourceType();
        if (['image', 'stylesheet', 'font'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(fbVideoURL, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.waitForTimeout(35000 + Math.random() * 15000); // 35–50s

      logs.push(`✅ Viewed from ${proxy.country}`);
      await browser.close();
    } catch (err) {
      logs.push(`❌ ${proxy.country} failed: ${err.message}`);
    }
  }

  return logs;
}

// ROUTES
app.get('/', (req, res) => {
  res.send('✅ FB Global Viewer backend is live.');
});

app.get('/view', async (req, res) => {
  const result = await runViewCycle();
  res.json({ status: 'complete', logs: result });
});

// LOOP MODE
let looping = false;
app.get('/loop', async (req, res) => {
  if (looping) return res.send('🔁 Already looping.');

  looping = true;
  res.send('🔁 Loop mode started. Views every 5 minutes.');

  const loop = async () => {
    if (!looping) return;
    console.log('🔁 Running scheduled view cycle...');
    await runViewCycle();
    setTimeout(loop, 5 * 60 * 1000); // 5 mins
  };

  loop();
});

app.get('/stop', (req, res) => {
  looping = false;
  res.send('🛑 Loop mode stopped.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
