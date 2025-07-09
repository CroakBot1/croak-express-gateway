// == CROAK LICENSE VALIDATOR BACKEND ==
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000; // Port for Render

app.use(cors());
app.use(express.json());

// License file path
const LICENSE_FILE = './license.json';

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

// Validate license route
app.post('/croak/validate', (req, res) => {
  const { licenseKey, clientIP } = req.body;

  if (!licenseKey || !clientIP) {
    return res.status(400).json({ valid: false, message: 'Missing licenseKey or clientIP' });
  }

  const licenses = loadLicenses();
  const record = licenses[licenseKey];

  if (!record) {
    return res.status(404).json({ valid: false, message: 'License not found' });
  }

  if (record.used && record.boundIP !== clientIP) {
    return res.status(403).json({
      valid: false,
      message: `License already used on different IP (${record.boundIP})`
    });
  }

  // First time activation
  if (!record.used) {
    record.used = true;
    record.boundIP = clientIP;
    licenses[licenseKey] = record;
    saveLicenses(licenses);
  }

  res.json({
    valid: true,
    message: 'License valid and authenticated',
    boundIP: record.boundIP
  });
});

// Start the backend
app.listen(PORT, () => {
  console.log(`✅ License Validator running at http://localhost:${PORT}`);
});
