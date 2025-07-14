// == CROAK UUID ADDER TOOL 🧠🐸 ==
const fs = require('fs');
const path = require('path');

const UUID_FILE = 'uuids.json';
const uuidToAdd = process.argv[2]; // Pass UUID as argument

if (!uuidToAdd || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuidToAdd)) {
  console.error("❌ Invalid UUID format. Usage: node add-uuid.js <your-uuid>");
  process.exit(1);
}

function loadUUIDs() {
  try {
    return JSON.parse(fs.readFileSync(UUID_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveUUIDs(data) {
  fs.writeFileSync(UUID_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ UUID ${uuidToAdd} added to uuids.json`);
}

const uuids = loadUUIDs();

if (uuids[uuidToAdd]) {
  console.log("⚠️ UUID already exists in file.");
} else {
  uuids[uuidToAdd] = {
    ip: null,
    created: new Date().toISOString(),
    boundAt: null
  };
  saveUUIDs(uuids);
}
