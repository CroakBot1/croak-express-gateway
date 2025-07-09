const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const LICENSE_FILE = './license.json';
const META_FILE = './licenseMeta.json';
const LOG_DIR = './logs';

// Ensure logs folder exists
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

// Load helpers
function load(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file));
}
function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Extract IP properly
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
}

// ✅ License endpoint
app.post('/croak/validate', (req, res) => {
  const { licenseKey } = req.body;
  const clientIP = getClientIP(req);

  if (!licenseKey || !clientIP) {
    return res.status(400).json({ valid: false, message: 'Missing licenseKey or clientIP' });
  }

  const db = load(LICENSE_FILE);
  const meta = load(META_FILE);
  const license = db[licenseKey];

  if (!license) {
    return res.status(404).json({ valid: false, message: 'License not found' });
  }

  if (license.used && license.boundIP !== clientIP) {
    return res.status(403).json({ valid: false, message: 'Already used on another IP' });
  }

  if (!license.used) {
    license.used = true;
    license.boundIP = clientIP;
    db[licenseKey] = license;
    save(LICENSE_FILE, db);
  }

  // Log usage
  const logPath = path.join(LOG_DIR, `${licenseKey}.log`);
  const logLine = `[${new Date().toISOString()}] Accessed from ${clientIP}\n`;
  fs.appendFileSync(logPath, logLine);

  return res.json({
    valid: true,
    boundIP: license.boundIP,
    user: meta[licenseKey]?.user || 'Unknown',
    plan: meta[licenseKey]?.plan || 'Free',
    validUntil: meta[licenseKey]?.validUntil || 'N/A',
    message: 'License Validated ✅'
  });
});

app.listen(PORT, () => console.log(`✅ CROAK LICENSE SERVER running @ http://localhost:${PORT}`));
