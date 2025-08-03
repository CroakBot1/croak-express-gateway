import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 10000;
app.use(bodyParser.json());

let savedCookie = ''; // Store PHPSESSID here

// Login to YouLikeHits and extract PHPSESSID
const loginToYouLikeHits = async () => {
  const res = await fetch('https://youlikehits.com/login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `username=app1&password=Freedon98&login=Login`
  });

  const cookies = res.headers.get('set-cookie');
  if (!cookies || !cookies.includes('PHPSESSID=')) {
    throw new Error('❌ Login failed. Invalid credentials or blocked.');
  }

  const match = cookies.match(/PHPSESSID=([^;]+);/);
  if (match) {
    savedCookie = `PHPSESSID=${match[1]};`;
    console.log('✅ Logged in to YouLikeHits');
  } else {
    throw new Error('❌ Failed to extract PHPSESSID');
  }
};

// Proxy YouLikeHits with session cookie
app.get('/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('Missing URL');

  try {
    if (!savedCookie) await loginToYouLikeHits();

    const response = await fetch(target, {
      headers: {
        'Cookie': savedCookie,
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://youlikehits.com/youtubeviews.php'
      }
    });

    const html = await response.text();
    res.send(html);
  } catch (err) {
    console.error(`❌ Proxy error: ${err.message}`);
    res.status(500).send(`Proxy Error: ${err.message}`);
  }
});

// Manual restart if needed
app.get('/restart-bot', (req, res) => {
  exec('node bot.mjs', (err, stdout, stderr) => {
    if (err || stderr) return res.status(500).send(err?.message || stderr);
    res.send('✅ Bot restarted!');
  });
});

// Basic ping endpoint
app.get('/ping', (_, res) => res.send('✅ Ping success!'));

http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Ping + Proxy Server running on http://localhost:${PORT}`);
});
