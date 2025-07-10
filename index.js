// == CROAK UUID GATEWAY – IP LOCKED VERSION ==
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

// ✅ Generate UUID
app.post('/generate-uuid', (req, res) => {
  const uuids = loadUUIDs();
  const uuid = uuidv4();
  uuids[uuid] = { firstIP: null, ips: [], created: new Date().toISOString() };
  saveUUIDs(uuids);
  res.json({ uuid, status: '✅ UUID generated.' });
});

// 🔐 Validate UUID
app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  const uuids = loadUUIDs();
  const data = uuids[uuid];

  if (!uuid || !clientIP) return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });
  if (!data) return res.status(404).json({ valid: false, message: '❌ UUID not found.' });

  if (!data.firstIP) {
    data.firstIP = clientIP;
    data.ips = [clientIP];
    uuids[uuid] = data;
    saveUUIDs(uuids);
    return res.json({ valid: true, message: '✅ First IP locked.' });
  }

  if (clientIP === data.firstIP) {
    return res.json({ valid: true, message: '✅ IP verified.' });
  }

  if (!data.ips.includes(clientIP)) {
    data.ips.push(clientIP);
    saveUUIDs(uuids);
  }

  return res.status(401).json({ valid: false, message: '❌ UUID is locked to a different IP.' });
});

// 🚪 Unbind UUID (only original IP allowed)
app.post('/unbind-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  const uuids = loadUUIDs();
  const data = uuids[uuid];

  if (!data) return res.status(404).json({ unbound: false, message: '❌ UUID not found.' });

  if (clientIP === data.firstIP) {
    data.ips = [data.firstIP];
    saveUUIDs(uuids);
    return res.json({ unbound: true, message: '✅ Other IPs removed. Still locked to you.' });
  }

  return res.status(403).json({ unbound: false, message: '❌ Only original IP can unbind.' });
});

// 🧪 Dev Route (optional, remove in production)
app.get('/dev-all', (req, res) => {
  res.json(loadUUIDs());
});

app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Server running on port ${PORT}`);
});
