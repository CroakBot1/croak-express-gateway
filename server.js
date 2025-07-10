// == CROAK UUID BACKEND FINAL V2 🔐🐸 ==
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

const DATA_FILE = 'uuids.json';
const IP_EXPIRY_HOURS = 24; // Change to 0 for no expiry

function loadUUIDs() {
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveUUIDs(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function isExpired(boundAt) {
  if (!boundAt) return true;
  const now = new Date();
  const then = new Date(boundAt);
  const hoursPassed = (now - then) / (1000 * 60 * 60);
  return hoursPassed >= IP_EXPIRY_HOURS;
}

// == ROUTE: Generate UUID ==
app.post('/generate-uuid', (req, res) => {
  const uuids = loadUUIDs();
  const newUUID = uuidv4();
  uuids[newUUID] = {
    ip: null,
    created: new Date().toISOString(),
    boundAt: null
  };
  saveUUIDs(uuids);
  res.json({ uuid: newUUID, status: '✅ UUID generated. Not yet bound.' });
});

// == ROUTE: Validate UUID ==
app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP) {
    return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });
  }

  const uuids = loadUUIDs();
  const data = uuids[uuid];

  if (!data) {
    return res.status(404).json({ valid: false, message: '❌ UUID not found.' });
  }

  // Handle first-time bind or expired IP
  if (!data.ip || isExpired(data.boundAt)) {
    data.ip = clientIP;
    data.boundAt = new Date().toISOString();
    uuids[uuid] = data;
    saveUUIDs(uuids);
    return res.json({ valid: true, message: '✅ UUID validated and IP locked.' });
  }

  // Still valid IP
  if (data.ip === clientIP) {
    return res.json({ valid: true, message: '✅ UUID verified.' });
  }

  return res.status(401).json({ valid: false, message: '❌ UUID is locked to a different IP.' });
});

// == ROUTE: Unbind UUID ==
app.post('/unbind-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP) {
    return res.status(400).json({ unbound: false, message: '❌ Missing UUID or IP.' });
  }

  const uuids = loadUUIDs();
  const data = uuids[uuid];

  if (!data) {
    return res.status(404).json({ unbound: false, message: '❌ UUID not found.' });
  }

  if (data.ip === clientIP || isExpired(data.boundAt)) {
    data.ip = null;
    data.boundAt = null;
    uuids[uuid] = data;
    saveUUIDs(uuids);
    return res.json({ unbound: true, message: '✅ UUID unbound. You may re-login from a new device.' });
  }

  return res.status(403).json({ unbound: false, message: '❌ IP mismatch. Cannot unbind UUID.' });
});

// == ROUTE: Developer view (REMOVE in prod) ==
app.get('/dev-all', (req, res) => {
  const uuids = loadUUIDs();
  res.json(uuids);
});

app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Gateway running on port ${PORT}`);
});
