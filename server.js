// == CROAK GATEWAY FULL SERVER 🔐🐸 ==
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// == FILE PATHS ==
const UUID_DATA_FILE = 'uuids.json';
const VALID_UUIDS_FILE = 'valid-uuids.json';
const IP_EXPIRY_HOURS = 24; // Change to 0 for no expiry

// == HELPERS: File Utilities ==
function loadFile(path) {
  try {
    return JSON.parse(fs.readFileSync(path));
  } catch {
    return {};
  }
}
function saveFile(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// == HELPERS: Expiry ==
function isExpired(boundAt) {
  if (!boundAt) return true;
  const now = new Date();
  const then = new Date(boundAt);
  const hoursPassed = (now - then) / (1000 * 60 * 60);
  return hoursPassed >= IP_EXPIRY_HOURS;
}

// == CROAK UUID BACKEND FINAL V2 ==
app.post('/generate-uuid', (req, res) => {
  const uuids = loadFile(UUID_DATA_FILE);
  const newUUID = uuidv4();
  uuids[newUUID] = {
    ip: null,
    created: new Date().toISOString(),
    boundAt: null
  };
  saveFile(UUID_DATA_FILE, uuids);
  res.json({ uuid: newUUID, status: '✅ UUID generated. Not yet bound.' });
});

app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP) {
    return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });
  }

  const uuids = loadFile(UUID_DATA_FILE);
  const data = uuids[uuid];

  if (!data) {
    return res.status(404).json({ valid: false, message: '❌ UUID not found.' });
  }

  if (!data.ip || isExpired(data.boundAt)) {
    data.ip = clientIP;
    data.boundAt = new Date().toISOString();
    uuids[uuid] = data;
    saveFile(UUID_DATA_FILE, uuids);
    return res.json({ valid: true, message: '✅ UUID validated and IP locked.' });
  }

  if (data.ip === clientIP) {
    return res.json({ valid: true, message: '✅ UUID verified.' });
  }

  return res.status(401).json({ valid: false, message: '❌ UUID is locked to a different IP.' });
});

app.post('/unbind-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  const uuids = loadFile(UUID_DATA_FILE);
  const data = uuids[uuid];

  if (!data) return res.status(404).json({ unbound: false, message: '❌ UUID not found.' });

  if (data.ip === clientIP || isExpired(data.boundAt)) {
    data.ip = null;
    data.boundAt = null;
    uuids[uuid] = data;
    saveFile(UUID_DATA_FILE, uuids);
    return res.json({ unbound: true, message: '✅ UUID unbound. You may re-login from a new device.' });
  }

  return res.status(403).json({ unbound: false, message: '❌ IP mismatch. Cannot unbind UUID.' });
});

// == DEV ONLY: See all UUIDs (Remove in prod) ==
app.get('/dev-all', (req, res) => {
  const uuids = loadFile(UUID_DATA_FILE);
  res.json(uuids);
});

// == REGISTER UUID ==
app.get('/register', (req, res) => {
  const uuids = loadFile(VALID_UUIDS_FILE);
  const newUUID = uuidv4();
  uuids[newUUID] = true;
  saveFile(VALID_UUIDS_FILE, uuids);
  res.json({ uuid: newUUID, message: '✅ Your personal UUID is now registered.' });
});

// == BYBIT PRICE ==
app.get('/bybit-price', async (req, res) => {
  try {
    const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear&symbol=ETHUSDT');
    const data = await response.json();

    if (!data || !data.result || !data.result.list || !data.result.list[0]) {
      return res.status(500).json({ error: 'Invalid data structure from Bybit' });
    }

    const price = parseFloat(data.result.list[0].lastPrice);
    if (isNaN(price)) return res.status(500).json({ error: 'Invalid price value from Bybit' });

    res.json({ price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Bybit', details: err.message });
  }
});

// == HEARTBEAT ==
app.get('/heartbeat', (req, res) => {
  res.send('❤️ CROAK alive and listening');
});

// == KEEP-ALIVE SIMPLE PING ==
app.get('/keep-alive', (req, res) => {
  res.send('🟢 Croak server is alive!');
});

// == START SERVER ==
app.listen(PORT, () => {
  console.log(`🟢 Croak Gateway running on port ${PORT}`);
});
