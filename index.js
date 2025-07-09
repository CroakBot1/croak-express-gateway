// == CROAK UUID BACKEND FINAL LOCKED VERSION ==

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
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveUUIDs(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// == ROUTE: Generate new UUID ==
app.post('/generate-uuid', (req, res) => {
  const uuids = loadUUIDs();
  const newUUID = uuidv4();
  uuids[newUUID] = { ip: null, created: new Date().toISOString() };
  saveUUIDs(uuids);
  res.json({ uuid: newUUID, status: '✅ UUID generated & stored (no IP yet).' });
});

// == ROUTE: Validate UUID & allow one IP per UUID ==
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

  if (!data.ip) {
    data.ip = clientIP;
    uuids[uuid] = data;
    saveUUIDs(uuids);
    return res.json({ valid: true, message: '✅ UUID validated and IP locked.' });
  }

  if (data.ip === clientIP) {
    return res.json({ valid: true, message: '✅ UUID verified.' });
  }

  return res.status(401).json({ valid: false, message: '❌ UUID is locked to a different IP.' });
});

// == DEV: See all UUIDs (REMOVE IN PRODUCTION) ==
app.get('/dev-all', (req, res) => {
  const uuids = loadUUIDs();
  res.json(uuids);
});

app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Gateway running on port ${PORT}`);
});
