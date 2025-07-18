// == CROAK UUID + PRICE GATEWAY FINAL V2 🔐🐸 ==
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const SESSION_FILE = 'uuids.json';
const VALID_UUIDS_FILE = 'valid-uuids.json';
const IP_EXPIRY_HOURS = 24;

// == Helper Functions ==
function loadJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch {
    return {};
  }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function isExpired(boundAt) {
  if (!boundAt) return true;
  const now = new Date();
  const then = new Date(boundAt);
  const hoursPassed = (now - then) / (1000 * 60 * 60);
  return hoursPassed >= IP_EXPIRY_HOURS;
}

// == ROUTES ==

// 🎟️ Generate UUID
app.get('/register', (req, res) => {
  const newUUID = uuidv4();
  const uuids = loadJSON(VALID_UUIDS_FILE);
  uuids[newUUID] = true;
  saveJSON(VALID_UUIDS_FILE, uuids);
  res.json({ uuid: newUUID, message: '✅ UUID registered.' });
});

// 🔐 Validate UUID + Lock IP
app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP)
    return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });

  const validUUIDs = loadJSON(VALID_UUIDS_FILE);
  if (!validUUIDs[uuid])
    return res.status(403).json({ valid: false, message: '❌ Invalid UUID.' });

  const sessions = loadJSON(SESSION_FILE);
  const data = sessions[uuid];

  if (!data || isExpired(data.boundAt)) {
    sessions[uuid] = { ip: clientIP, boundAt: new Date().toISOString() };
    saveJSON(SESSION_FILE, sessions);
    return res.json({ valid: true, message: '✅ UUID validated and IP locked.' });
  }

  if (data.ip === clientIP)
    return res.json({ valid: true, message: '✅ UUID verified.' });

  return res.status(401).json({ valid: false, message: '❌ UUID already in use by another IP.' });
});

// 🔓 Unbind UUID
app.post('/unbind-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  const sessions = loadJSON(SESSION_FILE);
  const data = sessions[uuid];

  if (!data)
    return res.status(404).json({ unbound: false, message: '❌ UUID not in use.' });

  if (data.ip === clientIP || isExpired(data.boundAt)) {
    delete sessions[uuid];
    saveJSON(SESSION_FILE, sessions);
    return res.json({ unbound: true, message: '✅ UUID unbound. Session cleared.' });
  }

  return res.status(403).json({ unbound: false, message: '❌ IP mismatch.' });
});

// 📈 Bybit Price Fetcher (ETHUSDT)
app.get('/bybit-price', async (req, res) => {
  try {
    const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear&symbol=ETHUSDT');
    const data = await response.json();

    if (!data?.result?.list?.[0]) {
      return res.status(500).json({ error: 'Invalid Bybit response' });
    }

    const price = parseFloat(data.result.list[0].lastPrice);
    if (isNaN(price)) {
      return res.status(500).json({ error: 'Invalid price value' });
    }

    res.json({ price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price', details: err.message });
  }
});

// ❤️ Heartbeat (cron job)
app.get('/heartbeat', (req, res) => {
  console.log(`[HEARTBEAT] Ping at ${new Date().toISOString()}`);
  res.send('❤️ CROAK alive and listening');
});

// 🔄 Keep-Alive endpoint for Render + cron jobs
app.get('/keep-alive', (req, res) => {
  console.log(`[KEEP-ALIVE] Server pinged at ${new Date().toISOString()}`);
  res.status(200).send('🟢 Croak server is alive!');
});

// 🔍 Developer route (only for testing, remove in prod)
app.get('/dev-all', (req, res) => {
  res.json(loadJSON(SESSION_FILE));
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🟢 Croak Gateway running on port ${PORT}`);
});
                     
