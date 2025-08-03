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

// Debugger checker
const analyzeHTML = (html) => {
  const lower = html.toLowerCase();

  if (lower.includes('you must login')) {
    console.log('🔒 Not logged in — login session invalid or expired.');
  } else if (lower.includes('no more youtube views') || lower.includes('no more videos')) {
    console.log('🚫 No available YouTube view tasks right now.');
  } else if (lower.includes('account disabled') || lower.includes('banned')) {
    console.log('❌ Account appears disabled or banned.');
  } else if (lower.includes('input type="submit"') && lower.includes('value="view"')) {
    console.log('✅ View button detected — task available.');
  } else {
    console.log('❓ Could not determine page status. Manual check recommended.');
  }
};

// Proxy with debugging logic
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

    console.log('\n🔍 [Proxy HTML Preview]');
    console.log(html.slice(0, 500));
    analyzeHTML(html); // 👈 automatic status analysis

    res.send(html);
  } catch (err) {
    console.error(`❌ Proxy error: ${err.message}`);
    res.status(500).send(`Proxy Error: ${err.message}`);
  }
});

// Restart endpoint
app.get('/restart-bot', (req, res) => {
  exec('node bot.mjs', (err, stdout, stderr) => {
    if (err || stderr) return res.status(500).send(err?.message || stderr);
    res.send('✅ Bot restarted!');
  });
});

// Ping
app.get('/ping', (_, res) => res.send('✅ Ping success!'));

http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Debug Proxy Server running on http://localhost:${PORT}`);
});
