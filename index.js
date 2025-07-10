// == CROAK UUID GATEWAY – STRICT FIRST IP LOCK ==
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

const DATA_FILE = 'uuids.json';

function loadUUIDs() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch {
    return {};
  }
}

function saveUUIDs(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ✅ Pre-generated UUIDs (example UUID included)
const validUUIDs = {
  "df35e3f2-5237-4e02-8f52-ea9cf0778f30": true
};

// 🔐 Validate UUID: only first IP is accepted
app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP) return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });
  if (!validUUIDs[uuid]) return res.status(403).json({ valid: false, message: '❌ Invalid UUID.' });

  const uuids = loadUUIDs();
  const data = uuids[uuid] || {};

  if (!data.firstIP) {
    // First IP binds and locks
    data.firstIP = clientIP;
    uuids[uuid] = data;
    saveUUIDs(uuids);
    return res.json({ valid: true, message: '✅ IP locked to UUID.' });
  }

  if (data.firstIP === clientIP) {
    return res.json({ valid: true, message: '✅ Verified. You are the original user.' });
  }

  return res.status(401).json({ valid: false, message: '❌ UUID already locked by another IP.' });
});

// 🚪 Unbind UUID (browser refresh or exit)
app.post('/unbind-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  const uuids = loadUUIDs();
  const data = uuids[uuid];

  if (!data) return res.status(404).json({ unbound: false, message: '❌ UUID not found.' });

  if (data.firstIP === clientIP) {
    delete uuids[uuid]; // Fully remove binding
    saveUUIDs(uuids);
    return res.json({ unbound: true, message: '✅ UUID unbound. Ready for next session.' });
  }

  return res.status(403).json({ unbound: false, message: '❌ Only original IP can unbind.' });
});

app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Gateway live on port ${PORT}`);
});
