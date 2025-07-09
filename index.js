const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 10000;
const UUID_STORE_PATH = './uuid-store.json';

app.use(cors());
app.use(express.json());

// 🧠 Load existing UUIDs
let uuidStore = [];
if (fs.existsSync(UUID_STORE_PATH)) {
  uuidStore = JSON.parse(fs.readFileSync(UUID_STORE_PATH, 'utf8'));
}

// 🧠 Save function
function saveUUID(uuid) {
  if (!uuidStore.includes(uuid)) {
    uuidStore.push(uuid);
    fs.writeFileSync(UUID_STORE_PATH, JSON.stringify(uuidStore, null, 2));
  }
}

// 🎯 POST /generate-uuid
app.post('/generate-uuid', (req, res) => {
  const newUUID = uuidv4();
  saveUUID(newUUID);
  console.log("✅ Generated UUID:", newUUID);
  res.json({ uuid: newUUID });
});

// 🎯 POST /validate-uuid
app.post('/validate-uuid', (req, res) => {
  const { uuid } = req.body;
  const isValid = uuidStore.includes(uuid);
  console.log("🔍 UUID Validation:", uuid, "→", isValid ? "✅ VALID" : "❌ INVALID");
  res.json({ valid: isValid });
});

// 🟢 Start
app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Gateway running on port ${PORT}`);
});
