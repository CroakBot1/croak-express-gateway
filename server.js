import express from 'express';
import request from 'request';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Decodo proxy config ===
const decodoUser = 'spw95jq2io';
const decodoPass = '~jVy74ixsez5tWW6Cr';
const decodoPort = 10001;
const decodoProxy = `http://${decodoUser}:${decodoPass}@gate.decodo.com:${decodoPort}`;

// === Serve index.html frontend ===
app.use(express.static(__dirname));
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// === Public API ===

// 1. Ping checker
app.get('/ping', (req, res) => {
  res.send('✅ Ping success!');
});

// 2. Proxy via Decodo (safe: hidden from frontend)
app.get('/proxy', (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('❌ Missing URL');
  
  console.log(`🔁 Proxying via Decodo: ${target}`);
  request({
    url: target,
    proxy: decodoProxy,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    }
  }).pipe(res);
});

// 3. Optional bot trigger endpoint
app.get('/restart-bot', (req, res) => {
  exec('node bot.mjs', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return res.status(500).send(`❌ Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`⚠️ Stderr: ${stderr}`);
      return res.status(500).send(`⚠️ Stderr: ${stderr}`);
    }
    console.log(`✅ Bot restarted:\n${stdout}`);
    res.send('✅ Bot restarted!');
  });
});

// === Start server ===
app.listen(PORT, () => {
  console.log(`🚀 Ping + Proxy Server running on http://localhost:${PORT}`);
});
