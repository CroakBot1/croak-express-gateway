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
  { country: 'FR', host: 'fr.decodo.io', port: '12345' },
  { country: 'DE', host: 'de.decodo.io', port: '12345' },
  { country: 'JP', host: 'jp.decodo.io', port: '12345' },
  { country: 'KR', host: 'kr.decodo.io', port: '12345' },
  { country: 'UK', host: 'uk.decodo.io', port: '12345' },
  { country: 'AU', host: 'au.decodo.io', port: '12345' },
  { country: 'IT', host: 'it.decodo.io', port: '12345' },
  { country: 'NL', host: 'nl.decodo.io', port: '12345' },
  { country: 'ES', host: 'es.decodo.io', port: '12345' },
  { country: 'MX', host: 'mx.decodo.io', port: '12345' },
  { country: 'AR', host: 'ar.decodo.io', port: '12345' },
  { country: 'SG', host: 'sg.decodo.io', port: '12345' },
  { country: 'TH', host: 'th.decodo.io', port: '12345' },
  { country: 'MY', host: 'my.decodo.io', port: '12345' },
  { country: 'VN', host: 'vn.decodo.io', port: '12345' },
  { country: 'HK', host: 'hk.decodo.io', port: '12345' },
  { country: 'ID', host: 'id.decodo.io', port: '12345' },
  { country: 'TR', host: 'tr.decodo.io', port: '12345' },
  { country: 'PL', host: 'pl.decodo.io', port: '12345' },
  { country: 'SE', host: 'se.decodo.io', port: '12345' },
  { country: 'NO', host: 'no.decodo.io', port: '12345' },
  { country: 'FI', host: 'fi.decodo.io', port: '12345' },
  { country: 'DK', host: 'dk.decodo.io', port: '12345' },
  { country: 'BE', host: 'be.decodo.io', port: '12345' },
  { country: 'CH', host: 'ch.decodo.io', port: '12345' },
  { country: 'IE', host: 'ie.decodo.io', port: '12345' },
  { country: 'RU', host: 'ru.decodo.io', port: '12345' },
  { country: 'UA', host: 'ua.decodo.io', port: '12345' },
  { country: 'IL', host: 'il.decodo.io', port: '12345' },
  { country: 'SA', host: 'sa.decodo.io', port: '12345' },
  { country: 'AE', host: 'ae.decodo.io', port: '12345' },
  { country: 'ZA', host: 'za.decodo.io', port: '12345' },
  { country: 'NG', host: 'ng.decodo.io', port: '12345' },
  { country: 'EG', host: 'eg.decodo.io', port: '12345' },
  { country: 'KE', host: 'ke.decodo.io', port: '12345' },
  { country: 'TZ', host: 'tz.decodo.io', port: '12345' },
  { country: 'PK', host: 'pk.decodo.io', port: '12345' },
  { country: 'BD', host: 'bd.decodo.io', port: '12345' },
  { country: 'LK', host: 'lk.decodo.io', port: '12345' },
  { country: 'NZ', host: 'nz.decodo.io', port: '12345' },
  { country: 'TW', host: 'tw.decodo.io', port: '12345' },
  { country: 'CZ', host: 'cz.decodo.io', port: '12345' },
  { country: 'SK', host: 'sk.decodo.io', port: '12345' },
  { country: 'HU', host: 'hu.decodo.io', port: '12345' },
  { country: 'RO', host: 'ro.decodo.io', port: '12345' },
  { country: 'BG', host: 'bg.decodo.io', port: '12345' },
  { country: 'GR', host: 'gr.decodo.io', port: '12345' },
  { country: 'HR', host: 'hr.decodo.io', port: '12345' },
  { country: 'SI', host: 'si.decodo.io', port: '12345' },
  { country: 'RS', host: 'rs.decodo.io', port: '12345' },
  { country: 'AT', host: 'at.decodo.io', port: '12345' },
  { country: 'KZ', host: 'kz.decodo.io', port: '12345' },
  { country: 'AZ', host: 'az.decodo.io', port: '12345' },
  { country: 'GE', host: 'ge.decodo.io', port: '12345' },
  { country: 'MD', host: 'md.decodo.io', port: '12345' },
  { country: 'BY', host: 'by.decodo.io', port: '12345' },
  { country: 'BA', host: 'ba.decodo.io', port: '12345' },
  { country: 'ME', host: 'me.decodo.io', port: '12345' },
  { country: 'AL', host: 'al.decodo.io', port: '12345' },
  { country: 'MK', host: 'mk.decodo.io', port: '12345' },
  { country: 'IS', host: 'is.decodo.io', port: '12345' },
  { country: 'EE', host: 'ee.decodo.io', port: '12345' },
  { country: 'LT', host: 'lt.decodo.io', port: '12345' },
  { country: 'LV', host: 'lv.decodo.io', port: '12345' },
  { country: 'PA', host: 'pa.decodo.io', port: '12345' },
  { country: 'CL', host: 'cl.decodo.io', port: '12345' },
  { country: 'CO', host: 'co.decodo.io', port: '12345' },
  { country: 'PE', host: 'pe.decodo.io', port: '12345' },
  { country: 'EC', host: 'ec.decodo.io', port: '12345' },
  { country: 'BO', host: 'bo.decodo.io', port: '12345' },
  { country: 'PY', host: 'py.decodo.io', port: '12345' },
  { country: 'UY', host: 'uy.decodo.io', port: '12345' },
  { country: 'VE', host: 've.decodo.io', port: '12345' },
  { country: 'CR', host: 'cr.decodo.io', port: '12345' },
  { country: 'GT', host: 'gt.decodo.io', port: '12345' },
  { country: 'HN', host: 'hn.decodo.io', port: '12345' },
  { country: 'NI', host: 'ni.decodo.io', port: '12345' },
  { country: 'SV', host: 'sv.decodo.io', port: '12345' },
  { country: 'JM', host: 'jm.decodo.io', port: '12345' },
  { country: 'DO', host: 'do.decodo.io', port: '12345' },
  { country: 'HT', host: 'ht.decodo.io', port: '12345' },
  { country: 'CU', host: 'cu.decodo.io', port: '12345' },
  { country: 'MA', host: 'ma.decodo.io', port: '12345' },
  { country: 'DZ', host: 'dz.decodo.io', port: '12345' },
  { country: 'TN', host: 'tn.decodo.io', port: '12345' },
  { country: 'ET', host: 'et.decodo.io', port: '12345' },
  { country: 'GH', host: 'gh.decodo.io', port: '12345' },
  { country: 'CI', host: 'ci.decodo.io', port: '12345' },
  { country: 'SN', host: 'sn.decodo.io', port: '12345' },
  { country: 'ZM', host: 'zm.decodo.io', port: '12345' },
  { country: 'UG', host: 'ug.decodo.io', port: '12345' },
  { country: 'MW', host: 'mw.decodo.io', port: '12345' },
  { country: 'MZ', host: 'mz.decodo.io', port: '12345' },
  { country: 'BW', host: 'bw.decodo.io', port: '12345' },
  { country: 'NA', host: 'na.decodo.io', port: '12345' }
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
  res.send('🔁 Loop mode started. Views every 1 minute.');

  const interval = 60 * 1000; // 1 minute
  async function loop() {
    if (!looping) return;
    console.log('🔁 Running high-speed view cycle...');
    await runViewCycle();
    setTimeout(loop, interval);
  }

  loop();
});

app.get('/stop', (req, res) => {
  looping = false;
  res.send('🛑 Loop mode stopped.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
