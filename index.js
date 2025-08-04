// 🌐 Express backend for FB Global Viewer (Render-ready)
import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;

const proxyUser = 'spw95jq2io';
const proxyPass = '~jVy74ixsez5tWW6Cr';
const fbVideoURL = 'https://m.facebook.com/share/v/177AxvRKYW/';

const proxyList = [
  { country: 'US', host: 'us.decodo.io', port: '12345' },
  { country: 'PH', host: 'ph.decodo.io', port: '12345' },
  { country: 'CA', host: 'ca.decodo.io', port: '12345' },
  { country: 'IN', host: 'in.decodo.io', port: '12345' },
  { country: 'BR', host: 'br.decodo.io', port: '12345' },
];

app.get('/', (req, res) => {
  res.send('✅ FB Global Viewer backend is live.');
});

app.get('/view', async (req, res) => {
  const logs = [];

  for (let i = 0; i < proxyList.length; i++) {
    const proxy = proxyList[i];
    const proxyUrl = `http://${proxyUser}:${proxyPass}@${proxy.host}:${proxy.port}`;
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: [`--proxy-server=${proxy.host}:${proxy.port}`, '--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.authenticate({ username: proxyUser, password: proxyPass });

      // Block images, fonts, styles to save MB
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
      await page.waitForTimeout(35000 + Math.random() * 15000);

      logs.push(`✅ Viewed from ${proxy.country}`);
      await browser.close();
    } catch (err) {
      logs.push(`❌ ${proxy.country} failed: ${err.message}`);
    }
  }

  res.json({ status: 'complete', logs });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
