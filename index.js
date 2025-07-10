// == CROAK UUID GATEWAY – FINAL FLOW VERSION 🧠🐸 ==
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const DATA_FILE = 'uuids.json';

// ✅ PERMANENTLY APPROVED UUIDS (add your real ones here)
const validUUIDs = {
  "df35e3f2-5237-4e02-8f52-ea9cf0778f30": true,
  "example-uuid-1234-5678-9012-abcdefabcdef": true
};

// 🔄 Load active session IP bindings
function loadUUIDs() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch {
    return {};
  }
}

// 💾 Save updated session data
function saveUUIDs(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ✅ VALIDATE: Allow first IP only, one at a time
app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP) return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });

  // ❌ UUID not registered
  if (!validUUIDs[uuid]) return res.status(403).json({ valid: false, message: '❌ Invalid UUID.' });

  const sessions = loadUUIDs();
  const session = sessions[uuid];

  if (!session) {
    // 🟢 No session active → bind this IP
    sessions[uuid] = { currentIP: clientIP };
    saveUUIDs(sessions);
    return res.json({ valid: true, message: '✅ Session started. IP locked.' });
  }

  if (session.currentIP === clientIP) {
    // 🟢 Same IP → allow reuse
    return res.json({ valid: true, message: '✅ Welcome back. You are still the active user.' });
  }

  // 🔴 UUID is in use by another IP
  return res.status(401).json({ valid: false, message: '❌ UUID already in use by another IP.' });
});

// 🔓 UNBIND: Remove IP lock on logout or refresh
app.post('/unbind-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  const sessions = loadUUIDs();
  const session = sessions[uuid];

  if (!session) return res.status(404).json({ unbound: false, message: '❌ UUID not currently in use.' });

  if (session.currentIP === clientIP) {
    delete sessions[uuid];
    saveUUIDs(sessions);
    return res.json({ unbound: true, message: '✅ UUID unbound. Session ended.' });
  }

  return res.status(403).json({ unbound: false, message: '❌ Only the original IP can unbind this session.' });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Gateway live on port ${PORT}`);
});
