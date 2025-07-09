// == CROAK BOT LICENSE VALIDATOR – FINAL BACKEND V2 ==
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

const LICENSE_FILE = path.join(__dirname, 'license.json');

app.use(cors());
app.use(express.json());

// Load licenses
function loadLicenses() {
  if (!fs.existsSync(LICENSE_FILE)) return {};
  try {
    const raw = fs.readFileSync(LICENSE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error("❌ Failed to load license file:", e);
    return {};
  }
}

// Save licenses
function saveLicenses(data) {
  try {
    fs.writeFileSync(LICENSE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("❌ Failed to save license file:", e);
  }
}

// POST: /croak/validate
app.post('/croak/validate', (req, res) => {
  const rawKey = req.body.licenseKey;
  const clientIP = req.body.clientIP;

  const licenseKey = String(rawKey).trim(); // 🧠 Force string + trim

  console.log("🔑 License received:", licenseKey);
  console.log("🌐 IP received:", clientIP);

  if (!licenseKey || !clientIP) {
    return res.status(400).json({ valid: false, message: "Missing licenseKey or clientIP" });
  }

  const licenses = loadLicenses();
  console.log("🧾 Loaded license keys:", Object.keys(licenses));

  const entry = licenses[licenseKey];

  if (!entry) {
    return res.status(404).json({ valid: false, message: "License not found" });
  }

  if (entry.used && entry.boundIP !== clientIP) {
    return res.status(403).json({ valid: false, message: "License already used on another IP" });
  }

  // First time use
  if (!entry.used) {
    entry.used = true;
    entry.boundIP = clientIP;
    licenses[licenseKey] = entry;
    saveLicenses(licenses);
    console.log("✅ License activated:", licenseKey, "→", clientIP);
  }

  return res.json({
    valid: true,
    message: "License validated",
    boundIP: entry.boundIP
  });
});

// OPTIONAL GET: /croak/view (view raw licenses)
app.get('/croak/view', (req, res) => {
  const licenses = loadLicenses();
  res.json(licenses);
});

app.listen(PORT, () => {
  console.log(`✅ CROAK LICENSE BACKEND ready at http://localhost:${PORT}`);
});
