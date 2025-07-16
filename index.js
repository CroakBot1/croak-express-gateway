// ✅ CROAK EXPRESS GATEWAY WITH BYBIT PRICE + UUID SYSTEM
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch'); // ✅ fixed module import

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const SESSION_FILE = 'uuids.json';
const VALID_UUIDS_FILE = 'valid-uuids.json';

// ✅ Load temporary session IPs
function loadUUIDSessions() {
  try {
    return JSON.parse(fs.readFileSync(SESSION_FILE));
  } catch {
    return {};
  }
}

// ✅ Save session locks
function saveUUIDSessions(data) {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2));
}

// ✅ Load permanent UUIDs
function loadValidUUIDs() {
  try {
    return JSON.parse(fs.readFileSync(VALID_UUIDS_FILE));
  } catch {
    return {};
  }
}

// ✅ Save permanent UUID list
function saveValidUUIDs(data) {
  fs.writeFileSync(VALID_UUIDS_FILE, JSON.stringify(data, null, 2));
}

let validUUIDs = loadValidUUIDs();

// ✅ Validate UUID and Lock IP
app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP) return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });

  if (!validUUIDs[uuid]) return res.status(403).json({ valid: false, message: '❌ Invalid UUID.' });

  const sessions = loadUUIDSessions();
  const session = sessions[uuid];

  if (!session) {
    sessions[uuid] = { currentIP: clientIP };
    saveUUIDSessions(sessions);
    return res.json({ valid: true, message: '✅ Session started. IP locked.' });
  }

  if (session.currentIP === clientIP) {
    return res.json({ valid: true, message: '✅ Welcome back. You are still the active user.' });
  }

  return res.status(401).json({ valid: false, message: '❌ UUID already in use by another IP.' });
});

// ✅ Unbind UUID
app.post('/unbind-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  const sessions = loadUUIDSessions();
  const session = sessions[uuid];

  if (!session) return res.status(404).json({ unbound: false, message: '❌ UUID not currently in use.' });

  if (session.currentIP === clientIP) {
    delete sessions[uuid];
    saveUUIDSessions(sessions);
    return res.json({ unbound: true, message: '✅ UUID unbound. Session ended.' });
  }

  return res.status(403).json({ unbound: false, message: '❌ Only the original IP can unbind this session.' });
});

// ✅ Generate UUID
app.get('/register', (req, res) => {
  const newUUID = uuidv4();
  const uuids = loadValidUUIDs();
  uuids[newUUID] = true;
  saveValidUUIDs(uuids);
  validUUIDs = uuids;
  res.json({ uuid: newUUID, message: '✅ Your personal UUID is now registered.' });
});

// ✅ NEW: Bybit Price Proxy Endpoint
app.get('/bybit-price', async (req, res) => {
  try {
    const response = await fetch('https://api.bybit.com/v2/public/tickers?symbol=ETHUSDT');
    const data = await response.json();
    const price = parseFloat(data.result[0].last_price);
    res.json({ price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Bybit', details: err.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🟢 Croak Express Gateway running on port ${PORT}`);
});
