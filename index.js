// == CROAK BOT LICENSE VALIDATOR – FINAL BACKEND ==
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

const LICENSE_FILE = path.join(__dirname, 'license.json');

app.use(cors());
app.use(express.json());

// Load license data
function loadLicenses() {
  if (!fs.existsSync(LICENSE_FILE)) return {};
  const raw = fs.readFileSync(LICENSE_FILE);
  return JSON.parse(raw);
}

// Save license data
function saveLicenses(data) {
  fs.writeFileSync(LICENSE_FILE, JSON.stringify(data, null, 2));
}

// POST validator route
app.post('/croak/validate', (req, res) => {
  const { licenseKey, clientIP } = req.body;

  if (!licenseKey || !clientIP) {
    return res.status(400).json({ valid: false, message: 'Missing licenseKey or clientIP' });
  }

  const licenses = loadLicenses();
  const entry = licenses[licenseKey];

  if (!entry) {
    return res.status(404).json({ valid: false, message: 'License not found' });
  }

  if (entry.used && entry.boundIP !== clientIP) {
    return res.status(403).json({ valid: false, message: 'License already used on another IP' });
  }

  if (!entry.used) {
    entry.used = true;
    entry.boundIP = clientIP;
    licenses[licenseKey] = entry;
    saveLicenses(licenses);
  }

  res.json({
    valid: true,
    message: 'License validated',
    boundIP: entry.boundIP
  });
});

app.listen(PORT, () => {
  console.log(`✅ CROAK License Validator running at http://localhost:${PORT}`);
});
