// index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

let uuidList = [];

const DATA_FILE = 'uuids.json';

// Load UUIDs from file (if exists)
if (fs.existsSync(DATA_FILE)) {
  uuidList = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Save to file
function saveUUIDs() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(uuidList, null, 2));
}

// == GENERATE NEW UUID ==
app.post('/generate-uuid', (req, res) => {
  const uuid = uuidv4();
  if (!uuidList.includes(uuid)) {
    uuidList.push(uuid);
    saveUUIDs();
  }
  res.json({ uuid });
});

// == VALIDATE UUID ==
app.post('/validate-uuid', (req, res) => {
  const { uuid } = req.body;
  const valid = uuidList.includes(uuid);
  res.json({ valid });
});

// == STATUS CHECK ==
app.get('/', (req, res) => {
  res.send('🟢 CROAK UUID GATEWAY LIVE – READY TO GENERATE 🔑');
});

app.listen(PORT, () => {
  console.log(`🟢 Croak UUID Gateway running on port ${PORT}`);
});
